import React, { useState } from 'react';
import { GameEngine } from 'react-game-engine';
import { useSpring, animated } from '@react-spring/web';
import { ControlPoint } from './ControlPoint';
import { SplineCurve } from './SplineCurve';
import { Grid } from './Grid';
import { systems } from '@/systems/pitchCurve';

const initialPoints = [
  { id: 'p1', x: 100, y: 100 },
  { id: 'p2', x: 300, y: 200 },
  { id: 'p3', x: 500, y: 300 },
];

export const PitchCurveEditor = () => {
  const [points, setPoints] = useState(initialPoints);
  
  const entities = {
    points: {
      points: points,
      renderer: <ControlPoints points={points} />,
    },
    spline: {
      points: points,
      renderer: <SplineCurve points={points} />,
    },
    grid: {
      renderer: <Grid />,
    },
  };

  return (
    <div className="w-full h-full relative">
      <GameEngine
        className="game-engine"
        systems={[systems.dragSystem]}
        entities={entities}
        onEvent={(e: any) => {
          if (e.type === 'point-moved') {
            setPoints(e.points);
          }
        }}
      />
    </div>
  );
};

const ControlPoints = ({ points = [] }: { points?: Array<{ id: string; x: number; y: number }> }) => {
  return (
    <>
      {points.map((point) => (
        <ControlPoint key={point.id} id={point.id} x={point.x} y={point.y} />
      ))}
    </>
  );
};