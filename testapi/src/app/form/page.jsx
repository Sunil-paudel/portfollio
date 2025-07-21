'use client';

import React, { useState } from 'react';

export default function FormPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submit: POST user data then GET saved data to preview
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setPreview(null);

    if (!name || !email) {
      setError('Please enter both name and email');
      return;
    }

    try {
      // POST user data
      const postRes = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const postData = await postRes.json();

      if (!postRes.ok) {
        setError(postData.message || 'Error submitting data');
        return;
      }

      setMessage(postData.message || 'User data received');

      // GET stored user data to show preview
      const getRes = await fetch('/api/user');
      const getData = await getRes.json();

      if (!getRes.ok) {
        setError(getData.message || 'Error fetching user data');
        return;
      }

      setPreview(getData); // Set preview data to display

    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>User Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label><br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br /><br />
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {preview && (
        <div>
          <p>Hello <strong>{preview.name}</strong>, your details are:</p>
          <ul>
            <li>Name: {preview.name}</li>
            <li>Email: {preview.email}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
