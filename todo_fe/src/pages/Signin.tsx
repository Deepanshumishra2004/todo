import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async () => {
    const res = await fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-800'>
      <div className='w-[25%] bg-gray-200 p-10 rounded shadow-xl'>
        <h1 className='text-4xl font-bold text-center text-gray-900 mb-8'>Sign In</h1>
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
          onClick={handleSignin}
          className='w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition duration-300'
        >
          Sign In
        </button>
        <p className='text-center mt-4 text-sm text-gray-700'>
          Don't have an account? <Link to="/signup" className='text-green-600 underline'>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
