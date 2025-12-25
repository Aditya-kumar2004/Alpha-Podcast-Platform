import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Headphones, Search, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BASE_URL } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Podcast" },
  { href: "/upload", label: "Upload" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <Headphones className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">ALPHA Podcast platform</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              // Only show Upload link if user is logged in
              if (link.href === "/upload" && !user) return null;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-2",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {isOpen ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle search submission
                }}
                className="relative flex items-center animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 w-64 rounded-full bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  onBlur={(e) => {
                    // Only close if input is empty
                    if (!e.target.value) setIsOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/browse?search=${encodeURIComponent(e.target.value)}`);
                      setIsOpen(false);
                    }
                    if (e.key === 'Escape') setIsOpen(false);
                  }}
                />
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Search className="w-5 h-5" />
              </Button>
            )}

            {user ? (
              <div className="relative group/profile">
                <button className="flex items-center gap-3 p-1.5 rounded-full hover:bg-white/5 transition-colors focus:outline-none">
                  {user.profilePicture ? (
                    <img
                      src={`${BASE_URL}${user.profilePicture}`}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 shadow-lg shadow-primary/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-64 p-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover/profile:translate-y-0 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 mb-2 border-b border-white/5">
                    <p className="font-medium text-white line-clamp-1">{user.username}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                      <div className="relative">
                        <div className="w-4 h-4 border-2 border-current rounded-full opacity-60" />
                      </div>
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-4 mb-2">
                <span className="text-sm font-medium text-muted-foreground">Switch Theme</span>
                <ModeToggle />
              </div>
              {navLinks.map((link) => {
                // Only show Upload link if user is logged in
                if (link.href === "/upload" && !user) return null;

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 px-4 border-t border-white/5 mt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground px-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Signed in as {user.username}</span>
                    </div>
                    <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button variant="hero" className="w-full" asChild>
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;