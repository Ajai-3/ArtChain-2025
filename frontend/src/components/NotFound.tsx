import React from "react";
import { ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center px-4 sm:px-8 md:px-12 bg-background text-foreground relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left side geometric pattern */}
        <div className="absolute left-4 sm:left-10 top-1/4 w-32 sm:w-48 h-32 sm:h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full text-main-color">
            <path
              fill="currentColor"
              d="M40,40 L80,40 L80,80 L40,80 Z M120,40 L160,40 L160,80 L120,80 Z M40,120 L80,120 L80,160 L40,160 Z M120,120 L160,120 L160,160 L120,160 Z"
            />
          </svg>
        </div>

        {/* Right side geometric pattern */}
        <div className="absolute right-4 sm:right-20 bottom-1/4 w-48 sm:w-64 h-48 sm:h-64 opacity-10 rotate-45">
          <svg viewBox="0 0 200 200" className="w-full h-full text-main-color">
            <circle cx="50" cy="50" r="20" fill="currentColor" />
            <circle cx="150" cy="50" r="20" fill="currentColor" />
            <circle cx="50" cy="150" r="20" fill="currentColor" />
            <circle cx="150" cy="150" r="20" fill="currentColor" />
          </svg>
        </div>

        {/* Floating shapes - left side */}
        <div className="hidden md:block absolute left-32 top-1/3 w-24 h-24 opacity-15 animate-float">
          <div className="w-full h-full border-2 border-main-color rounded-full" />
        </div>
        <div className="hidden md:block absolute left-48 bottom-1/3 w-20 h-20 opacity-15 animate-float-slow">
          <div className="w-full h-full bg-main-color rotate-45" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute -left-40 top-1/4 w-96 h-96 bg-gradient-to-br from-main-color/25 to-main-color/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -right-40 bottom-1/4 w-80 h-80 bg-gradient-to-tr from-main-color/20 to-main-color/5 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      {/* Main content container - horizontal layout */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        {/* Left side - Text content */}
        <div className="text-center lg:text-left space-y-8 lg:space-y-12">
          {/* Large 404 */}
          <div className="space-y-4 lg:space-y-6">
            <div className="relative">
              <h1 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tighter bg-gradient-to-br from-main-color via-main-color/80 to-main-color/60 bg-clip-text text-transparent animate-fade-in">
                404
                {/* Glow effect */}
                <div className="absolute inset-0 text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] bg-gradient-to-br from-main-color/30 to-main-color/10 blur-xl -z-10 animate-pulse-glow" />
              </h1>
            </div>
            <div className="h-1.5 w-32 sm:w-48 bg-gradient-to-r from-main-color to-main-color/70 rounded-full animate-scale-in shadow-lg shadow-main-color/30 mx-auto lg:mx-0" />
          </div>

          {/* Message section */}
          <div className="space-y-4 lg:space-y-6 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-light tracking-wide text-foreground/95 leading-tight">
              This masterpiece doesn't exist... yet.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
              The page you're looking for might have been moved, deleted, or
              perhaps it's still being painted in the studio.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 animate-slide-up-delay justify-center lg:justify-start">
            <a
              href="/"
              className="group inline-flex items-center justify-center bg-main-color hover:bg-main-color-dark text-white font-semibold px-6 sm:px-8 lg:px-10 py-1 sm:py-1.5 lg:py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-main-color/25 border-2 border-main-color/20 w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 lg:mr-3 h-5 lg:h-6 w-5 lg:w-6 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="text-base lg:text-lg">Back to Gallery</span>
            </a>

            <a
              href="/contact"
              className="group inline-flex items-center justify-center border-2 border-main-color text-main-color hover:bg-main-color hover:text-white font-semibold px-6 sm:px-8 lg:px-10 py-1 sm:py-1.5 lg:py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/5 backdrop-blur-sm w-full sm:w-auto"
            >
              <span className="text-base lg:text-lg">Contact the Artist</span>
            </a>
          </div>
        </div>

        {/* Right side - Enhanced decorative flower element */}
        <div className="flex justify-center lg:justify-end items-center mt-8 lg:mt-0">
          <div className="relative opacity-40 sm:opacity-50 dark:opacity-30 dark:sm:opacity-35">
            <svg
              className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] stroke-main-color drop-shadow-lg"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Enhanced petals with better visibility */}
              <g className="animate-rotate-slow">
                <path
                  d="M100 35 Q 85 15, 100 5 Q 115 15, 100 35"
                  strokeLinecap="round"
                  className="animate-petal-1"
                />
                <path
                  d="M125 50 Q 150 30, 160 25 Q 150 40, 125 50"
                  strokeLinecap="round"
                  className="animate-petal-2"
                />
                <path
                  d="M145 85 Q 170 70, 175 80 Q 170 90, 145 85"
                  strokeLinecap="round"
                  className="animate-petal-3"
                />
                <path
                  d="M135 120 Q 155 140, 150 150 Q 140 140, 135 120"
                  strokeLinecap="round"
                  className="animate-petal-4"
                />
                <path
                  d="M100 140 Q 115 165, 100 170 Q 85 165, 100 140"
                  strokeLinecap="round"
                  className="animate-petal-5"
                />
                <path
                  d="M65 120 Q 45 140, 50 150 Q 60 140, 65 120"
                  strokeLinecap="round"
                  className="animate-petal-6"
                />
                <path
                  d="M55 85 Q 30 70, 25 80 Q 30 90, 55 85"
                  strokeLinecap="round"
                  className="animate-petal-1"
                />
                <path
                  d="M75 50 Q 50 30, 40 25 Q 50 40, 75 50"
                  strokeLinecap="round"
                  className="animate-petal-2"
                />
              </g>

              {/* Enhanced center */}
              <circle
                cx="100"
                cy="90"
                r="20"
                strokeWidth="2.5"
                className="animate-pulse-center fill-main-color/10"
              />

              {/* Enhanced stem */}
              <path
                d="M100 110 Q 92 160, 100 190"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-draw-stem"
              />

              {/* Enhanced leaves */}
              <path
                d="M92 135 Q 60 140, 55 155 Q 70 145, 92 135"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-leaf-1"
              />
              <path
                d="M108 155 Q 140 160, 145 175 Q 130 165, 108 155"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-leaf-2"
              />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8) translateX(-20px); }
          to { opacity: 1; transform: scale(1) translateX(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes draw {
          0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dasharray: 1000; stroke-dashoffset: 0; opacity: 1; }
        }
        
        @keyframes drawStem {
          0% { stroke-dasharray: 400; stroke-dashoffset: 400; opacity: 0; }
          100% { stroke-dasharray: 400; stroke-dashoffset: 0; opacity: 1; }
        }
        
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes petal {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        
        @keyframes pulseSlower {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        
        @keyframes pulseCenter {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }

        .animate-fade-in {
          animation: fadeIn 1.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 1s ease-out 0.5s both;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out 0.7s both;
        }
        
        .animate-slide-up-delay {
          animation: slideUp 1s ease-out 0.9s both;
        }
        
        .animate-draw {
          animation: draw 3.5s ease-in-out 1.2s both;
        }
        
        .animate-draw-stem {
          animation: drawStem 2.5s ease-in-out 1.8s both;
        }
        
        .animate-rotate-slow {
          animation: rotateSlow 35s linear infinite;
          transform-origin: center;
        }
        
        .animate-petal-1 {
          animation: draw 2.2s ease-in-out 1.2s both, petal 6s ease-in-out 3.5s infinite;
        }
        
        .animate-petal-2 {
          animation: draw 2.2s ease-in-out 1.4s both, petal 6s ease-in-out 3.7s infinite;
        }
        
        .animate-petal-3 {
          animation: draw 2.2s ease-in-out 1.6s both, petal 6s ease-in-out 3.9s infinite;
        }
        
        .animate-petal-4 {
          animation: draw 2.2s ease-in-out 1.8s both, petal 6s ease-in-out 4.1s infinite;
        }
        
        .animate-petal-5 {
          animation: draw 2.2s ease-in-out 2s both, petal 6s ease-in-out 4.3s infinite;
        }
        
        .animate-petal-6 {
          animation: draw 2.2s ease-in-out 2.2s both, petal 6s ease-in-out 4.5s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 9s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulseSlower 12s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 5s ease-in-out infinite;
        }
        
        .animate-pulse-center {
          animation: pulseCenter 4s ease-in-out infinite;
        }
        
        .animate-leaf-1 {
          animation: draw 1.8s ease-in-out 2.2s both, petal 7s ease-in-out 4s infinite;
        }
        
        .animate-leaf-2 {
          animation: draw 1.8s ease-in-out 2.4s both, petal 7s ease-in-out 4.2s infinite;
        }
        
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: floatSlow 9s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
