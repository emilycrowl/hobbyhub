import React, { useState, useEffect } from 'react';
import { fetchPosts } from './PostService';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]); // Initialize posts as an empty array

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts || []); // Ensure fetchedPosts is an array
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]); // Set posts to an empty array on error
      }
    };
    fetchPostsData();
  }, []);

  return (
    <div>
      <h1>Cooking Forum</h1>
      <Link to="/create">Create a New Post</Link>

      {/* Check if posts is an array and has content */}
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                {post.title} - Upvotes: {post.upvotes}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found. Create the first one!</p>
      )}
    </div>
  );
};

export default HomePage;
