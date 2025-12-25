import { Link } from "react-router-dom";
import { Headphones, Twitter, Instagram, Youtube, Linkedin, Send, Smartphone, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, handle subscription logic here
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 relative overflow-hidden mt-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand & Newsletter - Takes up 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-max">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                ALPHA <span className="text-primary">Podcasts</span>
              </span>
            </Link>

            <p className="text-muted-foreground leading-relaxed">
              The premier platform for Indian audio content. Discover millions of stories,
              learn from experts, and entertain yourself with the best podcasts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <label className="text-sm font-semibold text-white">Subscribe to our newsletter</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-primary/50 text-white placeholder:text-muted-foreground/50 transition-all"
                  required
                />
                <Button type="submit" size="icon" className="rounded-xl shrink-0 bg-primary hover:bg-primary/90 text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Links Sections - Takes up 8 columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Explore */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white text-lg">Explore</h4>
              <ul className="space-y-2.5">
                <li><Link to="/browse?sort=trending" className="text-sm text-muted-foreground hover:text-primary transition-colors">Trending Now</Link></li>
                <li><Link to="/browse?sort=new" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Releases</Link></li>
                <li><Link to="/browse?sort=top" className="text-sm text-muted-foreground hover:text-primary transition-colors">Top Charts</Link></li>
                <li><Link to="/browse?type=video" className="text-sm text-muted-foreground hover:text-primary transition-colors">Video Podcasts</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white text-lg">Categories</h4>
              <ul className="space-y-2.5">
                <li><Link to="/browse?category=Business" className="text-sm text-muted-foreground hover:text-primary transition-colors">Business</Link></li>
                <li><Link to="/browse?category=Comedy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Comedy</Link></li>
                <li><Link to="/browse?category=Motivation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Motivation</Link></li>
                <li><Link to="/browse?category=Mystery" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mystery</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white text-lg">Company</h4>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Download */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white text-lg">Get the App</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all group">
                  <Apple className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground uppercase leading-none">Download on the</div>
                    <div className="text-xs font-bold text-white mt-0.5">App Store</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all group">
                  <Smartphone className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground uppercase leading-none">Get it on</div>
                    <div className="text-xs font-bold text-white mt-0.5">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ALPHA Podcast Platform. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-pink-600 hover:text-white hover:scale-110 transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;