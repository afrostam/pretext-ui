import React from "react";
import { Hero } from "./sections/Hero.js";
import { Problem } from "./sections/Problem.js";
import { Components } from "./sections/Components.js";
import { Performance } from "./sections/Performance.js";
import { GetStarted } from "./sections/GetStarted.js";
import { Footer } from "./sections/Footer.js";

export function App() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/80 border-b border-gray-800/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="font-bold text-lg">
            <span className="text-accent-light">pretext</span>
            <span className="text-gray-500">-ui</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#components" className="text-sm text-gray-500 hover:text-gray-200 transition-colors hidden sm:block">
              Components
            </a>
            <a
              href="https://github.com/afrostam/pretext-ui"
              className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <Hero />
      <Problem />
      <Components />
      <Performance />
      <GetStarted />
      <Footer />
    </div>
  );
}
