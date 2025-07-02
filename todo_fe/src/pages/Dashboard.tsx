import { useEffect, useState } from 'react';
import { getToken, clearToken } from '../untils/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [todos, setTodos] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<{ email: string; id: string; username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    setUser({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username || decoded.id
    });
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const token = getToken();
    const res = await fetch('http://localhost:3000/todo', {
      headers: { Authorization: token || '' },
    });
    const data = await res.json();
    setTodos(data.data);
  };

  const handleLogout = () => {
    clearToken();
    navigate('/signin');
  };

  const handleAddTodo = async () => {
    const token = getToken();
    const res = await fetch('http://localhost:3000/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({
        tittle: title,
        decription: description,
        completed: false,
      }),
    });

    const data = await res.json();
    alert('Todo added!');
    setTitle('');
    setDescription('');
    fetchTodos();
  };

  const handleToggleComplete = async (id: number, current: boolean) => {
    const token = getToken();
    await fetch(`http://localhost:3000/todo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({
        completed: !current,
        tittle: todos.find((t) => t.id === id)?.tittle,
        decription: todos.find((t) => t.id === id)?.decription,
      }),
    });
    fetchTodos();
  };

  return (
    <div className='max-h-screen max-w-screen m-0 p-0 overflow-hidden'>
      <div className='bg-gray-300 flex justify-between w-screen h-screen'>
        <div className='ml-6 bg-gray-700 w-9.5 flex'>
          <h1 className='text-[60px] font-bold font-sans text-gray-200'>d</h1>
          <h1 className='text-[60px] font-bold font-sans'>eep</h1><br/>
          <h1 className='text-[30px] font-semibold font-sans pt-8'>todo</h1>
        </div>
        <div className='bg-amber-200 w-[85%]'>
          <div className='w-full h-[10%] bg-gray-500'>
            <div className='h-full bg-gray-700 flex justify-center items-center pl-6'>
              <input
                type='text'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='bg-gray-300 w-[30%] m-2 p-2 rounded'
              />
              <input
                type='text'
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='bg-gray-300 w-[30%] m-2 p-2 rounded'
              />
              <button
                onClick={handleAddTodo}
                className='bg-gray-800 text-zinc-400  w-[10%] m-2 p-2 font-bold rounded hover:bg-blue-500 hover:text-black'
              >
                Add Todo
              </button>
                <div className='flex justify-end w-[25%] pr-2'>
              <button
                onClick={handleLogout}
                className=' bg-blue-600  text-white text  px-4 mr-6 py-2  m-2 p-2 font-bold rounded hover:bg-red-400 hover:text-gray-800 transition duration-300'
              >
                Logout
              </button>
                </div>
            </div>
          </div>
          <div className='h-[90%] bg-gray-600 flex justify-center items-center'>
            <div className='w-[95%] h-[92%] bg-gray-100 rounded relative'>
              <p className='font-semibold pl-[3%] p-4 font-mono'>
                {user ? `${user.username} (${user.email})` : 'Loading...'}
              </p>
              <div className='flex justify-center h-[10%]'>
                <div className='w-[95%] flex justify-between bg-blue-950 p-2 rounded'>
                  <div className='w-[10%] bg-blue-900 flex justify-center uppercase items-center font-extrabold font-mono text-amber-400 text-2xl'>No.</div>
                  <div className='w-[38%] bg-blue-900 flex justify-center uppercase items-center font-extrabold font-mono text-amber-400 text-2xl'>Title</div>
                  <div className='w-[38%] bg-blue-900 flex justify-center uppercase items-center font-extrabold font-mono text-amber-400 text-2xl'>Description</div>
                  <div className='w-[12%] bg-blue-900 flex justify-center uppercase items-center font-extrabold font-mono text-amber-400 text-2xl'>Status</div>
                </div>
              </div>
              <div className='flex flex-col items-center pt-2 overflow-y-auto h-[80%]'>
                {todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={`w-[95%] flex justify-between p-2 rounded mb-2 ${todo.completed ? 'bg-gray-300 opacity-60' : 'bg-white shadow-md'}`}
                  >
                    <div className='w-[10%] bg-gray-200 flex justify-center items-center font-bold font-mono rounded p-2.5 text-xl'>
                      {index + 1}
                    </div>
                    <div
                      className={`w-[38%] bg-gray-200 flex justify-center items-center font-bold font-mono  rounded p-2.5 text-xl ${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.tittle}
                    </div>
                    <div
                      className={`w-[38%] bg-gray-200 flex justify-center items-center font-bold  font-mono rounded p-2.5 text-xl ${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.decription}
                    </div>
                    <div className='w-[12%] bg-gray-200 flex justify-center items-center font-bold font-mono  rounded p-2.5 text-xl'>
                      <button onClick={() => handleToggleComplete(todo.id, todo.completed)}>
                        {todo.completed ? '✔' : '☐'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}