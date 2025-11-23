import React from 'react';

interface GeminiIconProps {
  className?: string;
}

const GeminiIcon: React.FC<GeminiIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42 42"
      className={className}
    >
      <style>
        {`
          .gemini-icon-group {
            animation: gemini-spin 2s linear infinite;
            transform-origin: center;
          }
          @keyframes gemini-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .gemini-icon-pulse {
            animation: gemini-pulse 2.5s infinite ease-in-out;
            transform-origin: center;
          }
          @keyframes gemini-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.9); opacity: 0.7; }
          }
        `}
      </style>
      <defs>
        <linearGradient id="gemini-gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#9B72CB" />
        </linearGradient>
        <linearGradient id="gemini-gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34A853" />
          <stop offset="100%" stopColor="#F9AB00" />
        </linearGradient>
      </defs>
      {/* FIX: Removed invalid `transformOrigin` prop. The transform origin is now set via CSS in the <style> tag. */}
      <g className="gemini-icon-group">
        <path
          d="M21 4.5a16.5 16.5 0 1 0 16.5 16.5A16.519 16.519 0 0 0 21 4.5zm0 30a13.5 13.5 0 1 1 13.5-13.5A13.515 13.515 0 0 1 21 34.5z"
          fill="url(#gemini-gradient-outer)"
        />
        {/* FIX: Removed invalid `transformOrigin` prop. The transform origin is now set via CSS in the <style> tag. */}
        <circle
          cx="21"
          cy="21"
          r="7.5"
          fill="url(#gemini-gradient-inner)"
          className="gemini-icon-pulse"
        />
      </g>
    </svg>
  );
};

export default GeminiIcon;
