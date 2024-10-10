// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import CreatePostPage from './PostForm';
import PostPage from './PostPage';
import EditPostPage from './EditPostPage';
import Sidebar from './Sidebar'; 

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {}
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPostPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
