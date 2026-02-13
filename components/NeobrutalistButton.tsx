
import React from 'react';

interface NeobrutalistButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  bgColor: string;
  className?: string;
}

export const NeobrutalistButton: React.FC<NeobrutalistButtonProps> = ({ 
  children, 
  onClick, 
  bgColor,
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-4 px-6 text-xl font-black border-2 border-black 
        neobrutalism-shadow transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none
        ${bgColor} ${className}
      `}
    >
      {children}
    </button>
  );
};
