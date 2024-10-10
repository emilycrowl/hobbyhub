import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost } from './PostService';

const EditPostPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const data = await fetchPostById(id);
      setTitle(data.title);
      setContent(data.content);
      setImage(data.img);
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPost = { title, content, img: image };

    try {
      await updatePost(id, updatedPost);
      navigate('/');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPostPage;
