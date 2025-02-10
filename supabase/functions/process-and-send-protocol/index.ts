
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import JSZip from "npm:jszip@3.10.1";
import Docxtemplater from "npm:docxtemplater@3.42.4";
import PizZip from "npm:pizzip@3.1.6";
import { format } from "npm:date-fns@3.3.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
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

    // Fetch template file
    const { data: templateFile, error: templateError } = await supabase.storage
      .from('document-templates')
      .download(protocol.template_file_path);

    if (templateError) throw templateError;

    // Process template
    const zip = new PizZip(await templateFile.arrayBuffer());
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepare data for template
    const templateData = {
      PROTOCOL_NUMBER: protocol.protocol_number,
      DATE: format(new Date(protocol.created_at), 'dd.MM.yyyy'),
      COMPANY_NAME: protocol.settings.company_name,
      COMPANY_EMAIL: protocol.settings.company_email,
      COMPANY_PHONE: protocol.settings.company_phone,
      COMPANY_ADDRESS: protocol.settings.company_address,
      CLIENT_NAME: protocol.clients.name,
      CLIENT_EMAIL: protocol.clients.email,
      ITEMS: protocol.content.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
      })),
      MANAGER_SIGNATURE: protocol.manager_signature,
      CLIENT_SIGNATURE: protocol.client_signature,
    };

    // Render document
    doc.render(templateData);

    const generatedDoc = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // Upload generated document
    const docxFileName = `protocol-${protocol.protocol_number}.docx`;
    const { error: uploadError } = await supabase.storage
      .from('processed-documents')
      .upload(docxFileName, generatedDoc);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('processed-documents')
      .getPublicUrl(docxFileName);

    // Send email
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: `${protocol.settings.company_name} <${protocol.settings.company_email}>`,
      to: protocol.clients.email,
      subject: emailSubject,
      html: emailBody,
      attachments: [{
        filename: docxFileName,
        path: publicUrl.publicUrl,
      }],
    });

    if (emailError) throw emailError;

    // Log email
    const { error: logError } = await supabase
      .from('email_log')
      .insert({
        protocol_id: protocolId,
        sent_to: protocol.clients.email,
        email_subject: emailSubject,
        email_body: emailBody,
        attachments: [{ name: docxFileName, url: publicUrl.publicUrl }],
        sent_by: req.headers.get('x-user-id'),
      });

    if (logError) throw logError;

    // Update protocol status
    const { error: updateError } = await supabase
      .from('protocols')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', protocolId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: 'Protocol processed and sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing and sending protocol:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
