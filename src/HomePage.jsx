import React, { useState, useEffect } from 'react';
import { fetchPosts } from './PostService';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]); // Initialize posts as an empty array
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [sortOption, setSortOption] = useState('created_at'); // Default sort by created_at

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

  // Function to handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle sorting change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Filter posts by search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort posts based on the selected option (created_at or upvotes)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === 'upvotes') {
      return b.upvotes - a.upvotes; // Sort by upvotes descending
    }
    return new Date(b.created_at) - new Date(a.created_at); // Sort by created_at descending
  });

  return (
    <div>
      <h1>Cooking Forum</h1>
      <Link to="/create">Create a New Post</Link>

      {/* Search input */}
      <div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Sort options */}
      <div>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="created_at">Created Time</option>
          <option value="upvotes">Upvotes</option>
        </select>
      </div>

      {/* Display posts */}
      {sortedPosts.length > 0 ? (
        <ul>
          {sortedPosts.map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                {post.title} - Upvotes: {post.upvotes} - Created at: {new Date(post.created_at).toLocaleString()}
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
