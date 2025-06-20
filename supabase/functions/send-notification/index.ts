
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  customerId: string;
  type: 'sms';
  customerName: string;
  customerPhone: string;
  token: string;
  waitTime: number;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

async function sendSMS(phone: string, message: string) {
  const clicksendUsername = Deno.env.get('CLICKSEND_USERNAME');
  const clicksendApiKey = Deno.env.get('CLICKSEND_API_KEY');

  console.log('Attempting to send SMS with ClickSend:');
  console.log('To:', phone);
  console.log('Message:', message);
  console.log('Username configured:', !!clicksendUsername);
  console.log('API Key configured:', !!clicksendApiKey);

  if (!clicksendUsername || !clicksendApiKey) {
    throw new Error('ClickSend credentials not configured');
  }

  // Format phone number for Philippines
  let formattedPhone = phone;
  if (phone.startsWith('09')) {
    formattedPhone = '+63' + phone.substring(1);
  } else if (phone.startsWith('9') && phone.length === 10) {
    formattedPhone = '+63' + phone;
  } else if (!phone.startsWith('+')) {
    formattedPhone = '+63' + phone;
  }

  console.log('Formatted phone number:', formattedPhone);

  // ClickSend API requires Basic Auth
  const auth = btoa(`${clicksendUsername}:${clicksendApiKey}`);
  
  const smsData = {
    messages: [
      {
        to: formattedPhone,
        body: message,
        from: 'EscaOptical'
      }
    ]
  };

  console.log('Sending request to ClickSend API...');

  try {
    const response = await fetch('https://rest.clicksend.com/v3/sms/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData),
    });

    const responseText = await response.text();
    console.log('ClickSend API Response Status:', response.status);
    console.log('ClickSend API Response:', responseText);

    if (!response.ok) {
      console.error('ClickSend SMS failed with status:', response.status);
      console.error('Error response:', responseText);
      throw new Error(`ClickSend SMS failed: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('SMS sent successfully! Response:', result);
    
    // Check if the message was accepted
    if (result.data && result.data.messages && result.data.messages[0]) {
      const messageResult = result.data.messages[0];
      if (messageResult.status === 'SUCCESS') {
        console.log('Message accepted with ID:', messageResult.message_id);
        return { success: true, messageId: messageResult.message_id, result };
      } else {
        throw new Error(`Message failed: ${messageResult.status}`);
      }
    }
    
    return { success: true, result };
  } catch (error) {
    console.error('Error in sendSMS function:', error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerId, type, customerName, customerPhone, token, waitTime }: NotificationRequest = await req.json();

    console.log(`Processing SMS notification request for customer ${customerId}`);
    console.log('Customer details:', { customerName, customerPhone, token, waitTime });

    if (type !== 'sms') {
      throw new Error('Only SMS notifications are supported');
    }

    if (!customerPhone) {
      throw new Error('Customer phone number is required for SMS');
    }
    
    const message = `Hello ${customerName}! Your queue number ${token} at Esca Optical is ready. Current wait time: ${Math.floor(waitTime / 60)}:${(waitTime % 60).toString().padStart(2, '0')}. Please arrive soon to maintain your position.`;
    
    console.log('Attempting to send SMS...');
    const result = await sendSMS(customerPhone, message);

    // Log the notification in the database
    console.log('Logging notification to database...');
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        activity_type: 'notification',
        customer_id: customerId,
        description: `SMS notification sent to ${customerName}`,
        user_name: 'System',
        user_type: 'system',
        details: {
          notification_type: 'sms',
          customer_contact: customerPhone,
          token: token,
          wait_time: waitTime,
          clicksend_message_id: result.messageId
        }
      });

    if (logError) {
      console.error('Error logging notification:', logError);
    } else {
      console.log('Notification logged successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        message: 'SMS notification sent successfully via ClickSend',
        formattedPhone: customerPhone.startsWith('09') ? '+63' + customerPhone.substring(1) : customerPhone
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Notification error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Check the function logs for more details'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
