import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchPostById,
  updatePost,
  deletePost,
  addComment,
  fetchComments,
  upvotePost,
} from "./PostService";

const PostPage = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate(); // To programmatically navigate after delete
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // To handle new comment input
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing
  const [editedTitle, setEditedTitle] = useState(""); // For edited post title
  const [editedContent, setEditedContent] = useState(post.content || "");
  const [editedImage, setEditedImage] = useState(post.img || "");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        setPost(fetchedPost);
        const fetchedComments = await fetchComments(id); // Fetch comments for the post
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPostData();
  }, [id]);

  // Function to handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    try {
      await addComment(id, newComment); // Add comment to the post
      const updatedComments = await fetchComments(id); // Fetch updated comments
      setComments(updatedComments);
      setNewComment(""); // Clear input after submission
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async () => {
    try {
      await deletePost(id); // Delete the post
      navigate("/"); // Navigate back to home page
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Function to handle post editing
  const handleEditPost = async () => {
  try {
    await updatePost(post.id, editedTitle, editedContent, editedImage); // Make sure your service supports these parameters
    setIsEditing(false);
    setPost({ ...post, title: editedTitle, content: editedContent, img: editedImage });
  } catch (error) {
    console.error('Error editing post:', error);
  }
};


  // Function to handle post upvoting
  const handleUpvote = async () => {
    try {
      const updatedPost = await upvotePost(id); // Increment upvotes
      setPost({ ...post, upvotes: updatedPost.upvotes }); // Update post state with new upvote count
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  return (
    <div>
      {post ? (
        <div>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Edit title"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Edit content"
              />
              <input
                type="text"
                value={editedImage}
                onChange={(e) => setEditedImage(e.target.value)}
                placeholder="Edit image URL"
              />
              <button onClick={handleEditPost}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              {post.img && <img src={post.img} alt={post.title} />}
              <p>Upvotes: {post.upvotes}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDeletePost}>Delete</button>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3>Comments</h3>
            {comments.length > 0 ? (
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id}>{comment.content}</li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading post...</p>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default PostPage;
