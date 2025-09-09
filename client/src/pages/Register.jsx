import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithGooglePopup } from "../firebase";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://naturenest-y4n0.onrender.com/api/user/check-email", {
        email: form.email,
      });
      if (res.status === 200) {
        navigate("/register", { state: form });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const googleUser = result.user;
      const res = await axios.post("https://naturenest-y4n0.onrender.com/api/user/google-register", {
        email: googleUser.email,
        username: googleUser.displayName,
      });
      if (res.status === 201) {
        alert("Google registration successful!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Google registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Top Banner */}
      <div className="w-full py-6 text-center text-white bg-green-800">
        <h1 className="mb-2 text-3xl font-bold">🌿 Welcome to Nature Nest</h1>
        <p className="text-lg">
          Explore the mangroves, wildlife, and beauty of Sundarban. Register to begin your journey.
        </p>
      </div>

      <div className="flex flex-1">
        {/* Left: Nature Background */}
        <div
          className="relative hidden w-1/2 bg-center bg-cover md:flex rounded-l-2xl"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/30 rounded-l-2xl"></div>
        </div>

        {/* Right: Register Form */}
        <div className="flex items-center justify-center w-full p-6 md:w-1/2">
          <div className="w-full max-w-md p-10 bg-white shadow-xl rounded-2xl backdrop-blur-md">
            <h2 className="mb-6 text-2xl font-bold text-center text-green-800">
              Register
            </h2>

            {error && (
              <div className="mb-4 text-sm text-center text-red-500">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="p-3 font-semibold text-white transition bg-green-700 rounded-lg shadow-md hover:bg-green-800"
              >
                Send OTP
              </button>
            </form>

            <div className="my-6 text-center text-gray-500">OR</div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-2 p-3 font-semibold text-gray-800 transition bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <p className="mt-6 text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 hover:underline">
                Login
              </Link>
              <br />
              <Link
                to="/login/forgetPassword"
                className="text-green-700 hover:underline"
              >
                Forget Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
