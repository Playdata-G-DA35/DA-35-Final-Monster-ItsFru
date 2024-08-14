import React, { useState } from 'react';
import styles from './tap.module.css';

interface TapProps {
  tabs: string[];
  children: React.ReactNode[];
}

const Tap: React.FC<TapProps> = ({ tabs, children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tab} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.content}>{children[activeIndex]}</div>
    </div>
  );
};

export default Tap;