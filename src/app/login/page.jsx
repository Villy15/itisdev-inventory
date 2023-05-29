"use client"

import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user = {
      username: username,
      password: password
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      console.log(data);

      if (data === 'User Invalid') {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function showInvalid() {
    if (isInvalid) {
      return <p>Invalid username or password</p>;
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {showInvalid()}
    </div>
  );
}