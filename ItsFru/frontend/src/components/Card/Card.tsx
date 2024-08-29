import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 border-b border-green-500 ${className}`}>
      {children}
    </div>
  );
};

export default Card;