import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium">{label}</label>}
        <input
          ref={ref}
          className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-green-100 text-black"
          {...props}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;