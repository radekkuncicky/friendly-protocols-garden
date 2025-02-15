
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

    if (!protocolId || !format) {
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
      .single()

    if (protocolError || !protocol) {
      console.error('Error fetching protocol:', protocolError)
      return new Response(
        JSON.stringify({ error: 'Protocol not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Download template file
    const { data: templateFile, error: templateError } = await supabase.storage
      .from('document-templates')
      .download(protocol.predefined_templates.file_path)

    if (templateError || !templateFile) {
      console.error('Error downloading template:', templateError)
      return new Response(
        JSON.stringify({ error: 'Template file not found' }),
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

    // Convert to requested format
    let finalDocument
    if (format === 'pdf') {
      // Convert to PDF using a PDF library
      // This is a placeholder - you'll need to implement actual PDF conversion
      finalDocument = new Blob([processedContent], { type: 'application/pdf' })
    } else {
      // Return as DOCX
      finalDocument = new Blob([processedContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    }

    return new Response(
      finalDocument,
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="protocol-${protocol.protocol_number}.${format}"`,
        }
      }
    )
  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
