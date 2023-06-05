"use client"
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { withSessionSsr } from '@lib/withSession';

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    let user = req.session.user;

    if (!user) {
      user = {
        role: "Guest",
      }
    }

    return {
      props: {
        user,
      },
    };
  }
);

export default function Login({user}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const router = useRouter();

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
        setIsInvalid(true);
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      setIsInvalid(false);
       
      router.push('/');

    } catch (err) {
      console.error(err);
    }
  };

  function showInvalid() {
    if (isInvalid) {
      return <div className='error'>Invalid username or password</div>;
    }
  }

  return (
    <main>
      <div className="main-section">
        <div className='login-section'>
          <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"w
                value={username}
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
                type="password"
                value={password}
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button type="submit">Enter</button>
              {showInvalid()}
            </form>
          </div>
        </div>
      </div>
    </main>


  );
}