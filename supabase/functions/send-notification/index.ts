
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
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
  
  const body = new URLSearchParams({
    From: twilioPhoneNumber,
    To: phone,
    Body: message,
  });

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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio SMS failed: ${error}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerId, type, customerName, customerPhone, token, waitTime }: NotificationRequest = await req.json();

    console.log(`Sending SMS notification to customer ${customerId}`);

    if (type !== 'sms') {
      throw new Error('Only SMS notifications are supported');
    }

    if (!customerPhone) {
      throw new Error('Customer phone number is required for SMS');
    }
    
    const message = `Hello ${customerName}! Your queue number ${token} at Esca Optical is ready. Current wait time: ${Math.floor(waitTime / 60)}:${(waitTime % 60).toString().padStart(2, '0')}. Please arrive soon to maintain your position.`;
    
    const result = await sendSMS(customerPhone, message);

    // Log the notification in the database
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
          wait_time: waitTime
        }
      });

    if (logError) {
      console.error('Error logging notification:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        message: 'SMS notification sent successfully'
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
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
