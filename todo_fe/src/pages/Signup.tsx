import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) navigate('/signin');
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-800'>
      <div className='w-[25%] bg-gray-200 p-10 rounded shadow-xl'>
        <h1 className='text-4xl font-bold text-center text-gray-900 mb-8'>Sign Up</h1>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={e => setUsername(e.target.value)}
          className='w-full p-3 mb-4 rounded bg-gray-300 placeholder-gray-600 text-black'
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='w-full p-3 mb-4 rounded bg-gray-300 placeholder-gray-600 text-black'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full p-3 mb-6 rounded bg-gray-300 placeholder-gray-600 text-black'
        />
        <button
          onClick={handleSignup}
          className='w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition duration-300'
        >
          Sign Up
        </button>
        <p className='text-center mt-4 text-sm text-gray-700'>
          Already have an account? <Link to="/signin" className='text-blue-600 underline'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
