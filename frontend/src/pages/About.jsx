import { Headphones, Users, Youtube, Play, Mic, Globe, Zap, Heart, Award, ArrowRight, Sparkles, CheckCircle, LogIn } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion"; // Commented out to avoid dependency issues if not installed

const stats = [
  { icon: Headphones, label: "Active Podcasters", value: "50+" },
  { icon: Users, label: "Monthly Listeners", value: "100M+" },
  { icon: Youtube, label: "Video Channels", value: "50" },
  { icon: Play, label: "Episodes Streamed", value: "1000+" },
];

const topPodcasters = [
  {
    name: "Ranveer Allahbadia",
    role: "The Ranveer Show",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Raj Shamani",
    role: "Figuring Out",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Nikhil Kamath",
    role: "WTF is with Nikhil Kamath",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    name: "Ankur Warikoo",
    role: "Warikoo Conversations",
    image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=400&fit=crop",
  },
];

const features = [
  {
    icon: Mic,
    title: "Crystal Clear Audio",
    description: "Experience every whisper and roar with our high-fidelity audio streaming technology."
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Join a vibrant ecosystem of listeners and creators from every corner of India."
  },
  {
    icon: Zap,
    title: "Instant Discovery",
    description: "Our AI-powered recommendations help you find your next obsession in seconds."
  }
];

const About = () => {
  const { user: currentUser } = useAuth(); // Correctly use hook logic

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse animation-delay-300" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium tracking-wide uppercase text-primary/90">
              The Future of Audio
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-up animation-delay-100">
            Redefining <br />
            <span className="gradient-text">Audio Storytelling</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animation-delay-200">
            We are bridging the gap between creators and listeners, building the premier destination for
            India's most influential voices.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-up animation-delay-300">
            <Button variant="hero" size="xl" className="rounded-full px-8 shadow-xl shadow-primary/20" asChild>
              <Link to="/browse">Start Listening</Link>
            </Button>
            <Button variant="outline" size="xl" className="rounded-full px-8 bg-white/5 border-white/10 hover:bg-white/10" asChild>
              <Link to="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 rounded-3xl shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-display text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl -z-10" />
              <img
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
                alt="Studio Microphone"
                className="rounded-3xl shadow-2xl border border-white/10 w-full object-cover aspect-4/5 transform rotate-2 hover:rotate-0 transition-transform duration-700"
              />
            </div>
            <div className="space-y-8">
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Our Mission to <br />
                <span className="text-primary">Democratize Audio</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  India's podcast scene has exploded in recent years, yet finding quality content remains a challenge.
                  We built this platform with a singular vision: to create a curated ecosystem where listeners can
                  discover authentic, unfiltered conversations.
                </p>
                <p>
                  From the boardrooms of Mumbai to the spiritual ghats of Varanasi, we bring you stories that matter.
                  We believe in the power of voice to inspire, educate, and transform lives.
                </p>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <h4 className="font-bold text-xl text-white mb-2">Quality First</h4>
                  <p className="text-sm text-muted-foreground">High-fidelity streaming for the true audiophile.</p>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white mb-2">Creator Driven</h4>
                  <p className="text-sm text-muted-foreground">Empowering voices that need to be heard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Why We are Different</h2>
            <p className="text-muted-foreground text-lg">
              We're not just another platform. We're a community of storytellers and listeners passionate about the art of conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-10 rounded-2xl md:min-h-[300px] flex flex-col justify-center items-center text-center hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-wider text-sm">Our Stars</span>
              <h2 className="font-display text-4xl font-bold mt-2">Featured Creators</h2>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/10">
              View All Creators <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPodcasters.map((podcaster) => (
              <div key={podcaster.name} className="group relative rounded-3xl overflow-hidden aspect-[3/4]">
                <img
                  src={podcaster.image}
                  alt={podcaster.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    {podcaster.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-4">
                    {podcaster.role}
                  </p>
                  <Button size="sm" className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 border-none text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMART CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {currentUser ? (
            // LOGGED IN VIEW: 3D Connected Card
            <div className="perspective-1000">
              <div className="relative glass-card rounded-3xl overflow-hidden bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-12 text-center transform transition-all duration-500 hover:rotate-x-2 hover:shadow-2xl hover:shadow-green-500/20">
                {/* 3D Floating Elements */}
                <div className="absolute top-10 left-10 w-24 h-24 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl animate-pulse animation-delay-200" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/40">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                    You are in!
                  </h2>
                  <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
                    You have already joined <span className="font-bold text-green-400">ALPHA Podcast Platform</span>.
                    Welcome back to the future of audio.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="hero" size="lg" className="bg-green-600 hover:bg-green-500 text-white border-none shadow-xl shadow-green-900/20" asChild>
                      <Link to="/browse">Browse New Episodes</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-green-500/30 text-green-100 hover:bg-green-500/10" asChild>
                      <Link to="/profile">View My Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // GUEST VIEW: Join Prompt
            <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-20 text-center shadow-2xl shadow-primary/20">
              {/* Abstract Shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-2">
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Join the Community</span>
                </div>
                <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-tight">
                  Join <span className="text-black/80">ALPHA</span> Podcast Platform
                </h2>
                <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto">
                  Please create your account and sign in to our platform to unlock exclusive content,
                  follow your favorite creators, and join the conversation.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="xl" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-full px-10 shadow-xl font-bold text-lg h-14" asChild>
                    <Link to="/register">Create Account</Link>
                  </Button>
                  <Button size="xl" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-2 border-white/30 hover:bg-white/10 rounded-full px-10 font-bold text-lg h-14" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default About;