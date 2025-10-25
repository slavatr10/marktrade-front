import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: "circle" | "star" | "square";
  rotation: number;
  rotationSpeed: number;
}

const colors = [
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
];

const createParticle = (id: number): Particle => ({
  id,
  x: Math.random() * window.innerWidth,
  y: -10,
  vx: (Math.random() - 0.5) * 4,
  vy: Math.random() * 2 + 1,
  color: colors[Math.floor(Math.random() * colors.length)],
  size: Math.random() * 6 + 4,
  shape: ["circle", "star", "square"][Math.floor(Math.random() * 3)] as
    | "circle"
    | "star"
    | "square",
  rotation: 0,
  rotationSpeed: (Math.random() - 0.5) * 5,
});

const StarShape: React.FC<{
  size: number;
  color: string;
  rotation: number;
}> = ({ size, color, rotation }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={color}
    />
  </svg>
);

interface ConfettiAnimationProps {
  duration?: number;
  particleCount?: number;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  duration = 4000,
  particleCount = 50,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const initialParticles = Array.from({ length: particleCount }, (_, i) =>
      createParticle(i)
    );
    setParticles(initialParticles);

    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, particleCount]);

  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            rotation: particle.rotation + particle.rotationSpeed,
            vy: particle.vy + 0.1,
          }))
          .filter((particle) => particle.y < window.innerHeight + 20)
      );
    };

  const animationId = setInterval(animate, 16);

    return () => clearInterval(animationId);
  }, [isActive]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {particle.shape === "circle" && (
            <div
              className="rounded-full opacity-80"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg)`,
              }}
            />
          )}
          {particle.shape === "star" && (
            <div className="opacity-80">
              <StarShape
                size={particle.size}
                color={particle.color}
                rotation={particle.rotation}
              />
            </div>
          )}
          {particle.shape === "square" && (
            <div
              className="opacity-80"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
