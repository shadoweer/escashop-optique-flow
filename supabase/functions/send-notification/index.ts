
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  customerId: string;
  type: 'sms' | 'email';
  message: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
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

async function sendEmail(email: string, subject: string, message: string) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    throw new Error('Resend API key not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Esca Optical <notifications@escaoptical.com>',
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
            <h1>Esca Optical Queue Update</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p style="font-size: 16px; line-height: 1.5;">${message}</p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Location:</strong> Esca Optical</p>
              <p><strong>Contact:</strong> (Your phone number here)</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Thank you for choosing Esca Optical for your eye care needs.
            </p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend email failed: ${error}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerId, type, customerName, customerPhone, customerEmail, token, waitTime }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to customer ${customerId}`);

    let result;
    
    if (type === 'sms') {
      if (!customerPhone) {
        throw new Error('Customer phone number is required for SMS');
      }
      
      const message = `Hello ${customerName}! Your queue number ${token} at Esca Optical is ready. Current wait time: ${Math.floor(waitTime / 60)}:${(waitTime % 60).toString().padStart(2, '0')}. Please arrive soon to maintain your position.`;
      
      result = await sendSMS(customerPhone, message);
    } else if (type === 'email') {
      if (!customerEmail) {
        throw new Error('Customer email is required for email notification');
      }
      
      const subject = `Queue Update - Token ${token} | Esca Optical`;
      const message = `Hello ${customerName}!<br><br>Your queue number <strong>${token}</strong> at Esca Optical is ready for service.<br><br>Current estimated wait time: <strong>${Math.floor(waitTime / 60)}:${(waitTime % 60).toString().padStart(2, '0')}</strong><br><br>Please arrive soon to maintain your position in the queue.`;
      
      result = await sendEmail(customerEmail, subject, message);
    } else {
      throw new Error('Invalid notification type');
    }

    // Log the notification in the database
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        activity_type: 'notification',
        customer_id: customerId,
        description: `${type.toUpperCase()} notification sent to ${customerName}`,
        user_name: 'System',
        user_type: 'system',
        details: {
          notification_type: type,
          customer_contact: type === 'sms' ? customerPhone : customerEmail,
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
        message: `${type.toUpperCase()} notification sent successfully`
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
