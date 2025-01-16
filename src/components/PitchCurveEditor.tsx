import React, { useState } from 'react';
import { GameEngine } from 'react-game-engine';
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
      points,
      setPoints,
      renderer: <ControlPoints points={points} />,
    },
    spline: {
      points,
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
        style={{ width: '100%', height: '100%', position: 'relative' }}
        onEvent={(e) => {
          console.log('Game Engine Event:', e);
        }}
      />
    </div>
  );
};

const ControlPoints = ({ points = [] }: { points: Array<{ id: string; x: number; y: number }> }) => {
  return (
    <>
      {points.map((point) => (
        <ControlPoint key={point.id} id={point.id} x={point.x} y={point.y} />
      ))}
    </>
  );
};