import React from 'react';

interface SplineCurveProps {
  points?: Array<{ x: number; y: number }>;
}

export const SplineCurve: React.FC<SplineCurveProps> = ({ points = [] }) => {
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    if (!pathRef.current || points.length < 2) return;

    const path = pathRef.current;
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Calculate control points for smooth curve
      const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
      const cp1y = prevPoint.y + (currentPoint.y - prevPoint.y) / 3;
      const cp2x = prevPoint.x + 2 * (currentPoint.x - prevPoint.x) / 3;
      const cp2y = prevPoint.y + 2 * (currentPoint.y - prevPoint.y) / 3;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`;
    }

    path.setAttribute('d', d);
  }, [points]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <path
        ref={pathRef}
        stroke="#3B82F6"
        strokeWidth="2"
        fill="none"
        className="transition-all duration-300 ease-in-out"
      />
    </svg>
  );
};