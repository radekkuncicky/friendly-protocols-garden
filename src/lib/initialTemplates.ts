
import { supabase } from "@/integrations/supabase/client";

export const setupInitialTemplates = async () => {
  try {
    // First, ensure the template exists in the database
    const { data: existingTemplate, error: queryError } = await supabase
      .from('predefined_templates')
      .select('*')
      .eq('type', 'minimalist')
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Error checking template:', queryError);
      return;
    }

    // If template doesn't exist in the database, create it
    if (!existingTemplate) {
      const minimalistTemplate = {
        name: "Minimalistický protokol",
        type: "minimalist",
        file_path: "minimalist-template.json",
        is_active: true
      };

      const { error: insertError } = await supabase
        .from('predefined_templates')
        .insert([minimalistTemplate]);

      if (insertError) {
        console.error('Error creating template:', insertError);
        return;
      }
    }

    // Check if template file exists in storage
    const { data: templateExists } = await supabase.storage
      .from('document-templates')
      .list('', {
        limit: 1,
        search: 'minimalist-template.json'
      });

    // If template file doesn't exist, create it
    if (!templateExists || templateExists.length === 0) {
      const defaultTemplate = {
        document: {
          header: {
            show_logo: true,
            show_title: true,
            show_page_numbers: true
          },
          content: {
            title: "PŘEDÁVACÍ PROTOKOL",
            items: [],
            signature_required: true
          },
          footer: {
            show_contact: true,
            show_disclaimer: false
          }
        }
      };

      const { error: uploadError } = await supabase.storage
        .from('document-templates')
        .upload('minimalist-template.json', 
          JSON.stringify(defaultTemplate, null, 2),
          {
            contentType: 'application/json',
            upsert: true
          }
        );

      if (uploadError) {
        console.error('Error uploading template:', uploadError);
        return;
      }

      // Get the public URL for the uploaded template
      const { data: { publicUrl } } = supabase.storage
        .from('document-templates')
        .getPublicUrl('minimalist-template.json');

      // Update the template record with the correct file path
      const { error: updateError } = await supabase
        .from('predefined_templates')
        .update({ file_path: publicUrl })
        .eq('type', 'minimalist');

      if (updateError) {
        console.error('Error updating template path:', updateError);
      }
    }
  } catch (error) {
    console.error('Error in setupInitialTemplates:', error);
  }
};
