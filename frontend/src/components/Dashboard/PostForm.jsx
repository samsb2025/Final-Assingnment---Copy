import React, { useEffect, useState } from "react";
import "./postform.css";

function PostForm({ onSubmit, editingPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingPost]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required");
      return;
    } else {
    }
    setLoading(true);
    onSubmit({ title, content });

    setLoading(false);

    if (!editingPost) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input1"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea1"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit" disabled={loading}>
        {editingPost ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}

export default PostForm;
