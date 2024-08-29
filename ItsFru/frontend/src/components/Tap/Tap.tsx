import React from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TapProps {
  tabs: TabItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const Tap: React.FC<TapProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="font-sans">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              flex-1 py-2 text-center text-sm font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              ${
                activeTab === index
                  ? 'text-green-600 border-b-2 border-green-500 font-semibold'
                  : 'text-gray-500 hover:text-green-600'
              }
            `}
            onClick={() => onTabChange(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tap;