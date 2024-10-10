import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, upvotePost } from './PostService';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await upvotePost(id);
      setPost((prevPost) => ({
        ...prevPost,
        upvotes: prevPost.upvotes + 1,
      }));
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.img && <img src={post.img} alt={post.title} />}
      <div>
        <button onClick={handleUpvote}>Upvote</button>
        <span>Upvotes: {post.upvotes}</span>
      </div>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default PostPage;
