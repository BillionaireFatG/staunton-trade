import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/profile';

/**
 * Get the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching current profile:', error);
    return null;
  }
}

/**
 * Get any user's public profile by ID
 */
export async function getPublicProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}

/**
 * Create a new profile (called after signup)
 */
export async function createProfile(userId: string, profileData: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

/**
 * Update existing profile
 */
export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

/**
 * Upload avatar to Supabase storage
 */
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}

/**
 * Delete avatar from storage
 */
export async function deleteAvatar(avatarUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = avatarUrl.split('/avatars/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return false;
  }
}

/**
 * Search profiles by name or company
 */
export async function searchProfiles(query: string, limit = 20): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,company_name.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
}

/**
 * Get all verified profiles
 */
export async function getVerifiedProfiles(limit = 50): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'verified')
      .order('verified_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching verified profiles:', error);
    return [];
  }
}

/**
 * Request verification
 */
export async function requestVerification(userId: string, documents: string[]): Promise<boolean> {
  try {
    // Create verification request
    const { error: requestError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: userId,
        documents,
        status: 'pending',
      });

    if (requestError) throw requestError;

    // Update profile status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_status: 'pending',
        verification_requested_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error requesting verification:', error);
    return false;
  }
}

/**
 * Upload verification documents
 */
export async function uploadVerificationDocs(userId: string, files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  try {
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('verification-docs').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading verification docs:', error);
    return uploadedUrls;
  }
}

