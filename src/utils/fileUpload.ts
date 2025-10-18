import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadHomeImage(file: File, id?: string): Promise<UploadResult> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${id || 'temp'}_${Date.now()}.${fileExt}`;
    const filePath = `home-sections/${fileName}`;

    // Upload file to Supabase storage
    const { data: _data, error: uploadError } = await supabase.storage
      .from('home-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('home-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
}

export async function deleteHomeImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from('home-images')
      .remove([`home-sections/${fileName}`]);

    return !error;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
}

export async function uploadEventImage(file: File, eventId?: string): Promise<UploadResult> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId || 'temp'}_${Date.now()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    // Upload file to Supabase storage
    const { data: _data, error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
}

export async function deleteEventImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from('event-images')
      .remove([`events/${fileName}`]);

    return !error;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
}
