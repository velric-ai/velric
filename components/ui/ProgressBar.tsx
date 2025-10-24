import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'cyan' | 'green' | 'purple' | 'pink' | 'orange' | 'blue';
  height?: number;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({ 
  value, 
  color = 'cyan', 
  height = 6, 
  animated = true,
  className = '' 
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const colorClasses = {
    cyan: 'progress-cyan',
    green: 'progress-green',
    purple: 'progress-purple',
    pink: 'progress-pink',
    orange: 'progress-orange',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
  };

  return (
    <div 
      className={`progress-bar ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`progress-fill ${colorClasses[color]}`}
        style={{ 
          width: `${Math.min(Math.max(displayValue, 0), 100)}%`,
          transition: animated ? 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      />
    </div>
  );
}