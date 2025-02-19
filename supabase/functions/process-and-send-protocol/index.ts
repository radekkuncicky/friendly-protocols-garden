
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { protocolId, emailSubject, emailBody } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch protocol data with client and settings
    const { data: protocol, error: protocolError } = await supabase
      .from('protocols')
      .select(`
        *,
        clients (
          name,
          email
        ),
        settings (
          company_name,
          company_email,
          company_phone,
          company_address,
          company_logo
        )
      `)
      .eq('id', protocolId)
      .single();

    if (protocolError) throw protocolError;

    // Send email
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: `${protocol.settings?.company_name || 'Company'} <${protocol.settings?.company_email || 'noreply@example.com'}>`,
      to: protocol.clients?.email || '',
      subject: emailSubject,
      html: emailBody,
    });

    if (emailError) throw emailError;

    // Update protocol status
    const { error: updateError } = await supabase
      .from('protocols')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('id', protocolId);

    if (updateError) throw updateError;

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Protocol sent successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing and sending protocol:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
