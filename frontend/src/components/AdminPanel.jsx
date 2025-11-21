import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import Logout from "./Logout";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // use absolute path so requests are sent to the API root,
    // request a large limit so admin sees all posts (or consider server-side admin endpoint)
    fetch("/api/posts?page=1&limit=1000", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched posts:", data);
        // backend returns { posts, totalPages, ... } — support both shapes
        if (Array.isArray(data)) setPosts(data);
        else if (Array.isArray(data.posts)) setPosts(data.posts);
        else setPosts([]);
      })
      .catch((err) => {
        console.error("error fetching posts", err);
      });

    fetch("/api/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data);

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("error fetching users", err);
      });
  }, [token]);
  const promoteUser = async (id) => {
    try {
      const res = await fetch(`api/users/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      alert(data.message);

      //update the state
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: "admin" } : user
        )
      );
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const removeUser = async (id) => {
    try {
      const res = await fetch(`api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      alert(data.message);
      //update the state
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
  const deletePost = async (id) => {
    try {
      const res = await fetch(`api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete post");
      alert(data.message);
      //update the state
      setPosts((prev) => prev.filter((post) => post._id !== id));
      // optionally refetch posts to keep pagination/meta in sync
      // (skipped here for performance; consider refetching if you rely on server pagination)
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <Logout className="logout-button" />
      <h1>Admin Panel</h1>
      {users.length === 0 ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  {user.role !== "admin" && (
                    <button
                      className="promote-btn"
                      onClick={() => promoteUser(user._id)}
                    >
                      Promote
                    </button>
                  )}
                  <button onClick={() => removeUser(user._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2>Posts</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Tags</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(posts) &&
            posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>{post.tags && post.tags.join(", ")}</td>
                <td>
                  {users.find((user) => user._id === post.user)?.username ||
                    "Unknown"}
                </td>
                <td>
                  <button onClick={() => deletePost(post._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
