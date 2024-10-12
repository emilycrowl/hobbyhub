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
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedImage, setEditedImage] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        setPost(fetchedPost);
        setEditedTitle(fetchedPost.title);
        setEditedContent(fetchedPost.content);
        setEditedImage(fetchedPost.img);
        const fetchedComments = await fetchComments(id);
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPostData();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    try {
      await addComment(id, newComment);
      const updatedComments = await fetchComments(id);
      setComments(updatedComments);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Handle post editing
  const handleEditPost = async () => {
    try {
      // Ensure the post is fully updated with new values before sending to the database
      const updatedPost = {
        title: editedTitle,
        content: editedContent,
        img: editedImage,
      };

      // Call updatePost with the correct parameters
      await updatePost(post.id, updatedPost);

      // Update local state to reflect the new post data
      setIsEditing(false);
      setPost({ ...post, ...updatedPost });
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  // Handle post upvoting
  const handleUpvote = async () => {
    try {
      const updatedPost = await upvotePost(id);
      setPost({ ...post, upvotes: updatedPost.upvotes });
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
              <button onClick={handleUpvote}>Upvote</button>{" "}
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
