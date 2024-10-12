import supabase from "./supabaseClient";

// Fetch all posts
export const fetchPosts = async () => {
  const { data, error } = await supabase.from("post").select("*");

  if (error) {
    throw error;
  }
  return data;
};

// Create a new post
export const createPost = async (newPost) => {
  const { data, error } = await supabase.from("post").insert(newPost);

  if (error) {
    throw error;
  }
  return data;
};

// Fetch a single post by ID
export const fetchPostById = async (id) => {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// Update post
export const updatePost = async (id, updatedPost) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .update(updatedPost)
      .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (id) => {
  const { data, error } = await supabase.from("post").delete().eq("id", id);

  if (error) {
    throw error;
  }
  return data;
};

// Upvote post
export const upvotePost = async (id) => {
  try {
    // Fetch current upvote count
    let { data: post, error: fetchError } = await supabase
      .from("post")
      .select("upvotes")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Increment upvote count
    const { data: updatedPost, error: updateError } = await supabase
      .from("post")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", id)
      .select();

    if (updateError) throw new Error(updateError.message);

    return updatedPost[0]; // Return the updated post object with upvotes
  } catch (error) {
    console.error("Error upvoting post:", error);
    throw error;
  }
};

// Fetch comments for a specific post
export const fetchComments = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId); // Get comments for this post
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Add a comment to a specific post
export const addComment = async (postId, content) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, content }]);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
