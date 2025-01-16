import React from 'react';
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
  const [entities, setEntities] = React.useState({
    points: {
      points: initialPoints,
      renderer: <ControlPoints />,
    },
    spline: {
      points: initialPoints,
      renderer: <SplineCurve />,
    },
    grid: {
      renderer: <Grid />,
    },
  });

  return (
    <div className="w-full h-full relative">
      <GameEngine
        systems={[systems.dragSystem]}
        entities={entities}
        onEvent={(e: any) => {
          if (e.type === 'point-moved') {
            setEntities(prev => ({
              ...prev,
              points: {
                ...prev.points,
                points: e.points,
              },
              spline: {
                ...prev.spline,
                points: e.points,
              },
            }));
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