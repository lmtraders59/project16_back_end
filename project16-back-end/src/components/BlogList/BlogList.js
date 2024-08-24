import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from './BlogCard';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog-list">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          title={post.title}
          description={post.content.slice(0, 150)}
          image={post.images ? post.images[0].url : 'default-image-url'} // Handle image scenarios
        />
      ))}
    </div>
  );
};

export default BlogList;
