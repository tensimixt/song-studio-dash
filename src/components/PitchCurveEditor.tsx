import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const POINT_RADIUS = 6;
const LINE_COLOR = 0x3B82F6;
const POINT_COLOR = 0x3B82F6;
const GRID_COLOR = 0x2D2D2D;

export const PitchCurveEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const pointsRef = useRef<PIXI.Graphics[]>([]);
  const curveRef = useRef<PIXI.Graphics | null>(null);
  const dragTarget = useRef<PIXI.Graphics | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    // Create PIXI Application
    const app = new PIXI.Application({
      background: '#1F2937',
      resizeTo: containerRef.current,
      antialias: true,
    });

    // Store the app reference
    appRef.current = app;

    // Create and append the PIXI container
    const pixiContainer = document.createElement('div');
    containerRef.current.appendChild(pixiContainer);

    // Wait for the next frame to ensure the canvas is created
    requestAnimationFrame(() => {
      if (app.view instanceof HTMLCanvasElement) {
        pixiContainer.appendChild(app.view);

        // Draw grid
        const grid = new PIXI.Graphics();
        grid.lineStyle(0.5, GRID_COLOR, 0.5);
        for (let x = 0; x < app.screen.width; x += 40) {
          grid.moveTo(x, 0);
          grid.lineTo(x, app.screen.height);
        }
        for (let y = 0; y < app.screen.height; y += 40) {
          grid.moveTo(0, y);
          grid.lineTo(app.screen.width, y);
        }
        app.stage.addChild(grid);

        // Create curve graphics
        const curve = new PIXI.Graphics();
        app.stage.addChild(curve);
        curveRef.current = curve;

        // Create initial control points
        const initialPoints = [
          { x: 100, y: 100 },
          { x: 300, y: 200 },
          { x: 500, y: 300 },
        ];

        initialPoints.forEach((point) => {
          const pointGraphics = createPoint(point.x, point.y);
          app.stage.addChild(pointGraphics);
          pointsRef.current.push(pointGraphics);
        });

        // Initial curve draw
        drawCurve();
      }
    });

    // Cleanup function
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        if (containerRef.current?.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        appRef.current = null;
        pointsRef.current = [];
        curveRef.current = null;
        dragTarget.current = null;
      }
    };
  }, []);

  const createPoint = (x: number, y: number) => {
    const point = new PIXI.Graphics();
    point.beginFill(POINT_COLOR);
    point.drawCircle(0, 0, POINT_RADIUS);
    point.endFill();
    point.position.set(x, y);
    point.eventMode = 'static';
    point.cursor = 'pointer';

    point
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

    return point;
  };

  const onDragStart = (event: PIXI.FederatedPointerEvent) => {
    const point = event.currentTarget as PIXI.Graphics;
    point.alpha = 0.8;
    dragTarget.current = point;
  };

  const onDragEnd = () => {
    if (dragTarget.current) {
      dragTarget.current.alpha = 1;
      dragTarget.current = null;
    }
  };

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    if (dragTarget.current) {
      const newPosition = event.getLocalPosition(dragTarget.current.parent);
      dragTarget.current.position.set(newPosition.x, newPosition.y);
      drawCurve();
    }
  };

  const drawCurve = () => {
    if (!curveRef.current) return;

    const points = pointsRef.current.map(p => ({ x: p.position.x, y: p.position.y }));
    const curve = curveRef.current;
    curve.clear();
    curve.lineStyle(2, LINE_COLOR);

    if (points.length >= 2) {
      curve.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];
        
        const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
        const cp1y = prevPoint.y + (currentPoint.y - prevPoint.y) / 3;
        const cp2x = prevPoint.x + 2 * (currentPoint.x - prevPoint.x) / 3;
        const cp2y = prevPoint.y + 2 * (currentPoint.y - prevPoint.y) / 3;

        curve.bezierCurveTo(
          cp1x, cp1y,
          cp2x, cp2y,
          currentPoint.x, currentPoint.y
        );
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};