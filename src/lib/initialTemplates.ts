
import { supabase } from "@/integrations/supabase/client";

export const setupInitialTemplates = async () => {
  try {
    // Check if minimalist template exists
    const { data: existingTemplate, error: queryError } = await supabase
      .from('predefined_templates')
      .select('*')
      .eq('type', 'minimalist')
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Error checking template:', queryError);
      return;
    }

    if (!existingTemplate) {
      // Create minimalist template
      const minimalistTemplate = {
        name: "Minimalistický protokol",
        type: "minimalist",
        file_path: "templates/minimalist-template.json",
        is_active: true
      };

      const { error: insertError } = await supabase
        .from('predefined_templates')
        .insert([minimalistTemplate]);

      if (insertError) {
        console.error('Error creating template:', insertError);
      }
    }

    // Upload default template file if it doesn't exist
    const { data: templateFile, error: storageError } = await supabase.storage
      .from('document-templates')
      .download('templates/minimalist-template.json');

    if (storageError && storageError.message.includes('Object not found')) {
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
        .upload('templates/minimalist-template.json', 
          JSON.stringify(defaultTemplate, null, 2),
          {
            contentType: 'application/json',
            upsert: true
          }
        );

      if (uploadError) {
        console.error('Error uploading template:', uploadError);
      }
    }
  } catch (error) {
    console.error('Error in setupInitialTemplates:', error);
  }
};
