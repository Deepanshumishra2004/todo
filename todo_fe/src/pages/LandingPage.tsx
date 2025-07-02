import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Deep Todo</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
        Manage your tasks with ease. Sign in or sign up to get started!
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/signin")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
