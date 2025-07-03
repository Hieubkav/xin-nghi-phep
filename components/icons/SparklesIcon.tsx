
import React from 'react';

interface SparklesIconProps {
  className?: string;
}

const SparklesIcon: React.FC<SparklesIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3l1.09 3.26L16.5 7.5l-3.26 1.09L12 12l-1.09-3.26L7.5 7.5l3.26-1.09L12 3z" />
    <path d="M19 12l.5 1.5L21 14l-1.5.5L19 16l-.5-1.5L17 14l1.5-.5L19 12z" />
    <path d="M5 6l.5 1.5L7 8l-1.5.5L5 10l-.5-1.5L3 8l1.5-.5L5 6z" />
  </svg>
);

export default SparklesIcon;
