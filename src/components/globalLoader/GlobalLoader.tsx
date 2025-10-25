// import bgImage from '@/assets/images/main-bg.png';
// export const GlobalLoader = () => {
//   return (
//     <div
//       className="global-loader-container"
//       style={{ ['--loader-bg' as any]: `url(${bgImage})` }}
//     >
//       <div className="global-loader">
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect, useRef } from 'react';


interface GlobalLoaderProps {
  progress?: number;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ progress = 0 }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [displayProgress, setDisplayProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    animationRef.current = window.setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 1, progress);
        } else if (prev > progress) {
           return Math.max(prev - 1, progress);
        } else {
          if (animationRef.current) {
             clearInterval(animationRef.current);
             animationRef.current = null;
          }
          return prev;
        }
      });
    }, 15);

    return () => {
      if (animationRef.current) {
         clearInterval(animationRef.current);
      }
    };
  }, [progress]);

  const offset = circumference - (displayProgress / 100) * circumference;

  return (
    <div
      className="global-loader-container"
      // style={{ ['--loader-bg' as any]: `url(${bgImage})` }}
    >
      <svg className="progress-ring" width="120" height="120">
        <circle
          className="progress-ring__circle-bg"
          stroke="#e6e6e6" strokeWidth="8" fill="transparent"
          r={radius} cx="60" cy="60"
        />
        <circle
          className="progress-ring__circle"
          stroke="#0049c7" strokeWidth="8" fill="transparent"
          r={radius} cx="60" cy="60"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
          }}
          transform="rotate(-90 60 60)"
        />
        <text
          x="50%" y="50%"
          dominantBaseline="middle" textAnchor="middle"
          className="progress-text font-poppins"
        >
          {`${Math.round(displayProgress)}%`}
        </text>
      </svg>
    </div>
  );
};