import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  type: 'microphone' | 'speaker';
}

export default function AudioVisualizer({ isActive, type }: AudioVisualizerProps) {
  const barsCount = 5;
  const bars = Array.from({ length: barsCount }, (_, i) => i);

  return (
    <div className="flex items-center gap-0.5 h-5">
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-full transition-all duration-150 ${
            isActive
              ? type === 'microphone'
                ? 'bg-orange-500'
                : 'bg-blue-500'
              : 'bg-gray-600'
          }`}
          style={{
            height: isActive
              ? `${Math.random() * 60 + 40}%`
              : '20%',
            animation: isActive
              ? `soundWave ${0.5 + Math.random() * 0.5}s ease-in-out infinite`
              : 'none',
            animationDelay: `${bar * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes soundWave {
          0%, 100% { height: 20%; }
          50% { height: ${Math.random() * 60 + 40}%; }
        }
      `}</style>
    </div>
  );
}
