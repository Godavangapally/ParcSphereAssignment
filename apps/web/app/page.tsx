import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowRight, CheckCircle, Shield, Zap, Sparkles, Target, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 relative z-10 animate-slideDown">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              PracSphere
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin/email-control">
              <Button variant="ghost" className="text-white hover:text-purple-200 hover:scale-105 transition-transform">
                Email Control
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-purple-200 hover:scale-105 transition-transform">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fadeInUp">
          <div className="inline-block mb-4 animate-bounce">
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fadeInUp animation-delay-200">
            Welcome to
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient bg-300">
              {" "}PracSphere
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fadeInUp animation-delay-400">
            Your AI-powered ERP solution for streamlined task management,
            enhanced productivity, and seamless collaboration.
          </p>
          <div className="flex items-center justify-center space-x-4 animate-fadeInUp animation-delay-600">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-400 text-white hover:bg-purple-400/10 text-lg px-8 py-6 transform hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <FeatureCard
            icon={<CheckCircle className="w-12 h-12 text-purple-400" />}
            title="Task Management"
            description="Organize, track, and complete tasks efficiently with our intuitive interface"
            delay="0"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-pink-400" />}
            title="Secure & Private"
            description="Enterprise-grade security with encrypted data and user authentication"
            delay="200"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-indigo-400" />}
            title="AI-Powered"
            description="Smart insights and automation to boost your productivity"
            delay="400"
          />
        </div>

        {/* About Section */}
        <div className="mt-24 text-center max-w-3xl mx-auto animate-fadeInUp animation-delay-800">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <h2 className="text-3xl font-bold text-white mb-4">About PracSphere</h2>
            <p className="text-gray-300 leading-relaxed">
              Built as a modern task management solution, PracSphere combines intuitive design 
              with powerful features to help you stay organized and productive. Manage your daily 
              tasks, track progress, and achieve your goals efficiently.
            </p>
          </div>
        </div>
      </main>


    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div 
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-purple-400/50 group cursor-pointer animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {description}
      </p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">
        {label}
      </div>
    </div>
  );
}