
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
  const twilioAccountSid = 'ACc276c280eb5088c4234ca3233c0e5ea5';
  const twilioAuthToken = 'c8c56184f7ad23be869c17c185b0182a';
  const twilioPhoneNumber = '+14144045399';

  console.log('Attempting to send SMS with the following details:');
  console.log('To:', phone);
  console.log('From:', twilioPhoneNumber);
  console.log('Message:', message);
  console.log('Account SID:', twilioAccountSid);

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  // Ensure phone number is in correct format
  let formattedPhone = phone;
  if (phone.startsWith('09')) {
    formattedPhone = '+63' + phone.substring(1);
  } else if (phone.startsWith('9') && phone.length === 10) {
    formattedPhone = '+63' + phone;
  } else if (!phone.startsWith('+')) {
    formattedPhone = '+63' + phone;
  }

  console.log('Formatted phone number:', formattedPhone);

  const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
  
  const body = new URLSearchParams({
    From: twilioPhoneNumber,
    To: formattedPhone,
    Body: message,
  });

  console.log('Sending request to Twilio API...');

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    const responseText = await response.text();
    console.log('Twilio API Response Status:', response.status);
    console.log('Twilio API Response:', responseText);

    if (!response.ok) {
      console.error('Twilio SMS failed with status:', response.status);
      console.error('Error response:', responseText);
      throw new Error(`Twilio SMS failed: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('SMS sent successfully! Message SID:', result.sid);
    return result;
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
          twilio_sid: result.sid
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
        message: 'SMS notification sent successfully',
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
