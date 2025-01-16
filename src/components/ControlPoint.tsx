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
        width: '12px',
        height: '12px',
        backgroundColor: '#3B82F6',
        borderRadius: '50%',
        cursor: 'move',
        transform: `translate(${x}px, ${y}px)`,
      }}
      data-point-id={id}
      className="hover:scale-150 transition-transform duration-200"
    />
  );
};