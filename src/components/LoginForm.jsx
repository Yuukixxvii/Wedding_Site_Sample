import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setSuccess(true);
      setError("");

      setTimeout(() => {
        onClose();
        navigate("/admin");
      }, 1000);
    } catch (err) {
      setError("Invalid email or password");

      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-sm bg-white/10 p-6 rounded-2xl flex flex-col gap-4 ${
          shake ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
      >
        {success && (
          <div className="p-2 rounded-lg bg-green-100 text-green-700 text-center text-sm">
            Login successful! Redirecting...
          </div>
        )}
        {error && (
          <div className="p-2 rounded-lg bg-red-100 text-red-600 text-center text-sm">
            {error}
          </div>
        )}
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-xl bg-white/10 border border-black focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-xl bg-white/10 border border-black focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <button className="bg-rose-600 hover:bg-rose-700 transition py-3 rounded-xl hover:text-white">
          Login
        </button>

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-800 hover:text-white hover:bg-black transition py-3 rounded-xl"
        >
          Cancel
        </button>
        <style>
          {`
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
`}
        </style>
      </form>
    </div>
  );
}
