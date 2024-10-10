import supabase from './supabaseClient';

// Fetch all posts
export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('post')
    .select('*');

  if (error) {
    throw error;
  }
  return data;
};

// Create a new post
export const createPost = async (newPost) => {
  const { data, error } = await supabase
    .from('post')
    .insert(newPost);

  if (error) {
    throw error;
  }
  return data;
};

// Fetch a single post by ID
export const fetchPostById = async (id) => {
  const { data, error } = await supabase
    .from('post')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// Update a post
export const updatePost = async (id, updatedPost) => {
  const { data, error } = await supabase
    .from('post')
    .update(updatedPost)
    .eq('id', id);

  if (error) {
    throw error;
  }
  return data;
};

// Delete a post
export const deletePost = async (id) => {
  const { data, error } = await supabase
    .from('post')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return data;
};

// Function to upvote a post
export const upvotePost = async (id) => {
  try {
    const { data, error } = await supabase
      .from('post') // Ensure the correct table name
      .update({ upvotes: supabase.increment(1) }) // Increment the upvotes by 1
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error upvoting post:', error);
    throw error;
  }
};