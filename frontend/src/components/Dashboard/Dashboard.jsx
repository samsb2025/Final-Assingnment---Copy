//Dashbord
import React, { useEffect, useState } from "react";
import PostForm from "./PostForm.jsx";
import axios from "axios";

import "./dashboard.css";
import SidebarLeft from "../SideBar/SidebarLeft.jsx";
import SidebarRight from "../SideBar/SidebarRight.jsx";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // fetch current user and users once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/account/current-user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data.user || res.data);
        return res.data;
      } catch (error) {
        console.error(
          "Error fetching current user:",
          error.response?.data?.message || error
        );
      }
    };

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get("/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchCurrentUser();
    fetchUsers();
  }, []);

  // fetch posts 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchPosts = async (page = 1, limit = postsPerPage) => {
      setLoadingPosts(true);
      try {
        const res = await axios.get("/api/posts", {
          params: { page, limit },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // backend posts and pagination info
        const data = res.data || {};
        setPosts(Array.isArray(data) ? data : data.posts || []);
        if (data.totalPages) setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts(currentPage, postsPerPage);
  }, [currentPage, postsPerPage]);

  const handleCreatePost = async (postData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/posts", postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        alert("Post created successfully!");
        
        setCurrentPage(1);
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      alert(
        error.response ? error.response.data.message : "Error creating post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postId, postData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update a post");
      return;
    }
    try {
      const res = await axios.put(`/api/posts/${postId}`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? res.data : post))
        );
        alert("Post updated successfully!");
      } else {
        alert("Failed to update post");
      }
    } catch (error) {
      alert(
        error.response ? error.response.data.message : "Error updating post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a post");
      return;
    }
    try {
      const res = await axios.delete(`/api/posts/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        if (editingPost && editingPost._id === postId) {
          setEditingPost(null);
        }
        alert("Post deleted successfully!");
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert(
        error.response ? error.response.data.message : "Error deleting post"
      );
    }
  };
  //Handle PostForm submission
  const handlePostSubmit = async (postData) => {
    if (editingPost) {
      await handleUpdatePost(editingPost._id, postData);
      setEditingPost(null);
    } else {
      await handleCreatePost(postData);
    }
  };

 

  return (
    <>
      <div className="dashboard-container">
        <SidebarLeft />
        <SidebarRight />
        <div className="dashboard">
          <h1>Dashboard</h1>

          {/*Display current user details*/}
          <div className="current-user">
            {currentUser ? (
              <p>
                Logged in as:<strong> {currentUser.username}</strong>(
                {currentUser.email})
              </p>
            ) : (
              <p>Loading current user...</p>
            )}
          </div>

          <PostForm
            onSubmit={handlePostSubmit}
            editingPost={editingPost}
            loading={loading}
          />
          {editingPost && (
            <button onClick={() => setEditingPost(null)}>Cancel Editing</button>
          )}
          {/*post display*/}
          <div className="post-display">
            {loadingPosts ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p>No posts found</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <small>
                    Posted on:{new Date(post.createdAt).toLocaleString()}
                  </small>
                  <button onClick={() => setEditingPost(post)}>Edit</button>

                  <button onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        {/*pagination*/}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
