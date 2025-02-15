
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { protocolId, format } = await req.json()
    console.log("Received request with protocolId:", protocolId, "format:", format);

    if (!protocolId || !format) {
      console.error("Missing parameters:", { protocolId, format });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch protocol with template information
    const { data: protocol, error: protocolError } = await supabase
      .from('protocols')
      .select(`
        *,
        predefined_templates (
          file_path,
          type
        )
      `)
      .eq('id', protocolId)
      .maybeSingle();

    console.log("Protocol query result:", { protocol, error: protocolError });

    if (protocolError) {
      console.error('Database error when fetching protocol:', protocolError);
      return new Response(
        JSON.stringify({ error: 'Database error', details: protocolError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!protocol) {
      console.error('Protocol not found for ID:', protocolId);
      return new Response(
        JSON.stringify({ error: 'Protocol not found', id: protocolId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (!protocol.predefined_templates?.file_path) {
      console.error('No template associated with protocol:', protocolId);
      return new Response(
        JSON.stringify({ error: 'No template found for protocol' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Download template file
    const { data: templateFile, error: templateError } = await supabase.storage
      .from('document-templates')
      .download(protocol.predefined_templates.file_path)

    if (templateError) {
      console.error('Error downloading template:', templateError);
      return new Response(
        JSON.stringify({ error: 'Template file not found', details: templateError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (!templateFile) {
      console.error('Template file is empty');
      return new Response(
        JSON.stringify({ error: 'Template file is empty' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Process template and replace placeholders
    const templateText = await templateFile.text()
    const processedContent = templateText
      .replace('[DATE]', new Date().toLocaleDateString('cs-CZ'))
      .replace('[PROTOCOL_NUMBER]', protocol.protocol_number)
      .replace('[CLIENT_NAME]', protocol.content.client_name || '')
      // Add more replacements as needed

    console.log("Template processed successfully");

    // Convert to requested format
    let finalDocument;
    let contentType;
    if (format === 'pdf') {
      finalDocument = new Blob([processedContent], { type: 'application/pdf' });
      contentType = 'application/pdf';
    } else {
      finalDocument = new Blob([processedContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    console.log("Sending response with content type:", contentType);

    return new Response(
      await finalDocument.arrayBuffer(),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="protocol-${protocol.protocol_number}.${format}"`,
        }
      }
    )
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
