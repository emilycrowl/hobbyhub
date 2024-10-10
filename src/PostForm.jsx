import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from './PostService';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { title, content, img };
    
    try {
      await createPost(newPost);
      setTitle('');
      setContent('');
      setImg('');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required
      />
      <textarea 
        placeholder="Content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Image URL" 
        value={img} 
        onChange={(e) => setImg(e.target.value)} 
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
