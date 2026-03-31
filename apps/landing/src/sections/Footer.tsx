import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Built with{" "}
          <span className="text-gray-400">Claude</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a
            href="https://github.com/afrostam/pretext-ui"
            className="hover:text-gray-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://github.com/chenglou/pretext"
            className="hover:text-gray-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            pretext engine
          </a>
          <span className="text-gray-800">MIT License</span>
        </div>
      </div>
    </footer>
  );
}
