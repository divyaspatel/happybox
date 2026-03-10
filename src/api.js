import { supabase } from './supabaseClient';

export const fetchNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('createdAt', { ascending: false });
    
  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
  return data;
};

export const createNote = async (formData) => {
  const note = formData.get('note');
  const date = formData.get('date');
  const files = formData.getAll('images');
  
  const uploadedImagePaths = [];
  
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.size === 0) continue;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
      } else {
        uploadedImagePaths.push(fileName);
      }
    }
  }
  
  const newNote = {
    id: Date.now().toString(),
    note: note || '',
    date: date || new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
    images: uploadedImagePaths,
    createdAt: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('notes')
    .insert([newNote])
    .select();
    
  if (error) {
    console.error('Error creating note:', error);
    throw error;
  }
  
  return data[0];
};

export const updateNote = async (id, noteText) => {
  const { data, error } = await supabase
    .from('notes')
    .update({ note: noteText })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating note:', error);
    throw error;
  }
  return data[0];
};

export const deleteNote = async (id) => {
  const { data, error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error deleting note:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn('Delete called but no rows were affected. Checking if row exists...');
    throw new Error('Permission denied or note not found. Please ensure you have run the "DELETE" policy in Supabase.');
  }
};


export const syncPendingNotes = async (pendingNotes) => {
  const syncedNotes = [];
  const errors = [];

  for (const pending of pendingNotes) {
    try {
      // Re-create FormData for sync
      const formData = new FormData();
      formData.append('note', pending.note);
      formData.append('date', pending.date);
      
      // Images in IndexedDB are stored as Files/Blobs
      if (pending.images && pending.images.length > 0) {
        pending.images.forEach(img => {
          formData.append('images', img);
        });
      }

      const synced = await createNote(formData);
      syncedNotes.push({ originalId: pending.id, synced });
    } catch (err) {
      console.error(`Failed to sync note ${pending.id}:`, err);
      errors.push({ id: pending.id, error: err });
    }
  }

  return { syncedNotes, errors };
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath instanceof Blob || imagePath instanceof File) {
    return URL.createObjectURL(imagePath);
  }
  if (imagePath.startsWith('http')) return imagePath;
  const { data } = supabase.storage.from('images').getPublicUrl(imagePath);
  return data.publicUrl;
};
