import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Zap, Shield, Globe } from 'lucide-react';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-white z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
            New: AI-Powered Plan Recommendations
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            Stream Without <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Boundaries</span>
          </h1>
          <p className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed">
            Experience the next generation of content delivery. Unlimited access to premium streams, 
            zero buffering, and intelligent quality adaptation for every device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/pricing">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-200">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to scale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap className="h-8 w-8 text-white" />,
                title: "Lightning Fast",
                desc: "Global CDN ensures less than 50ms latency anywhere in the world."
              },
              {
                icon: <Shield className="h-8 w-8 text-white" />,
                title: "Bank-Grade Security",
                desc: "AES-256 bit encryption and DRM protection for all your premium content."
              },
              {
                icon: <Globe className="h-8 w-8 text-white" />,
                title: "Universal Access",
                desc: "Watch on any device: iOS, Android, Web, TVOS, and more."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your viewing experience?</h2>
          <p className="text-indigo-200 text-lg mb-10">Join 10,000+ happy subscribers today.</p>
          <Link to="/pricing">
             <Button className="bg-white text-indigo-900 hover:bg-gray-100" size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
