import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-green-500 text-white text-center py-2 rounded-md shadow-md">
      {message}
    </div>
  );
};

export default ErrorMessage;