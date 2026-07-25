import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-600"
      >
        AI Campus Assistant
      </Link>

      {/* Menu */}
      <div className="hidden md:flex gap-8 text-gray-700 font-medium">
        <a href="#features" className="hover:text-indigo-600">
          Features
        </a>

        <a href="#about" className="hover:text-indigo-600">
          About
        </a>

        <a href="#contact" className="hover:text-indigo-600">
          Contact
        </a>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}