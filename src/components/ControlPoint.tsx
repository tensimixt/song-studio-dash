import React from 'react';
import { animated, useSpring } from '@react-spring/web';

interface ControlPointProps {
  id: string;
  x: number;
  y: number;
}

export const ControlPoint: React.FC<ControlPointProps> = ({ id, x, y }) => {
  const spring = useSpring({
    to: { transform: `translate(${x}px, ${y}px)` },
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div
      style={{
        ...spring,
        position: 'absolute',
        touchAction: 'none',
        userSelect: 'none',
      }}
      data-point-id={id}
      className="w-3 h-3 bg-blue-500 rounded-full cursor-move hover:scale-150 transition-transform duration-200 active:scale-125"
    />
  );
};