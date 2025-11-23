
import React from 'react';
import { Eye, XCircle } from 'lucide-react';
import { User } from '../types';

interface MasqueradeBannerProps {
  effectiveUser: User;
  originalUser: User;
  previousUser: User | null;
  onStop: () => void;
}

const MasqueradeBanner: React.FC<MasqueradeBannerProps> = ({ effectiveUser, originalUser, previousUser, onStop }) => {
  
  const buttonText = previousUser ? `Return to ${previousUser.name}` : 'Stop Masquerading';

  return (
    <div className="bg-orange-600 text-white px-4 py-2 shadow-md flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-white/20 rounded-full animate-pulse">
          <Eye size={18} />
        </div>
        <span className="text-sm font-medium">
          Masquerading as <strong>{effectiveUser.name}</strong> ({effectiveUser.role}) 
          <span className="opacity-75 mx-2 text-xs">|</span> 
          Logged in as {originalUser.name}
        </span>
      </div>
      <button 
        onClick={onStop}
        className="flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase bg-white text-orange-600 rounded hover:bg-orange-50 transition-colors"
      >
        <XCircle size={14} />
        {buttonText}
      </button>
    </div>
  );
};

export default MasqueradeBanner;
