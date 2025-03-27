
import React from "react";
import { Github, Twitter, Upload } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
      <div className="container px-4 py-8 mx-auto sm:px-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Import Genie</span>
          </div>

          <div className="text-sm text-center text-slate-500 dark:text-slate-400">
            &copy; {currentYear} Import Genie. All rights reserved.
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
