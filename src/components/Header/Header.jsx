import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // npm i lucide-react

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "My Posts", slug: "/my-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-500 backdrop-blur-md shadow-sm">
      <Container>
        <nav className="flex items-center justify-between py-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo width="60px" />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-4 py-2 rounded-full text-bold font-medium hover:bg-gray-200 transition"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && <LogoutBtn />}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col gap-2">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}
              {authStatus && <LogoutBtn />}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
