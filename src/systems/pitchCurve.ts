interface Point {
  id: string;
  x: number;
  y: number;
}

interface Entities {
  points: {
    points: Point[];
    setPoints: (points: Point[]) => void;
  };
  dragging?: {
    id: string;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  };
}

const dragSystem = (entities: Entities, { input }: any) => {
  if (!input) return entities;

  const mouseDown = input.find((x: any) => x.type === "mousedown");
  const mouseMove = input.find((x: any) => x.type === "mousemove");
  const mouseUp = input.find((x: any) => x.type === "mouseup");

  if (mouseDown) {
    const target = mouseDown.payload.target;
    const pointId = target.dataset.pointId;
    
    if (pointId) {
      const container = target.closest('.game-engine');
      if (!container) return entities;

      const rect = container.getBoundingClientRect();
      const point = entities.points.points.find(p => p.id === pointId);
      
      if (point) {
        const offsetX = mouseDown.payload.clientX - rect.left;
        const offsetY = mouseDown.payload.clientY - rect.top;
        
        return {
          ...entities,
          dragging: {
            id: pointId,
            startX: point.x,
            startY: point.y,
            offsetX: offsetX - point.x,
            offsetY: offsetY - point.y
          }
        };
      }
    }
  }

  if (mouseMove && entities.dragging) {
    const container = document.querySelector('.game-engine');
    if (!container) return entities;

    const rect = container.getBoundingClientRect();
    const x = mouseMove.payload.clientX - rect.left - entities.dragging.offsetX;
    const y = mouseMove.payload.clientY - rect.top - entities.dragging.offsetY;

    const updatedPoints = entities.points.points.map(p =>
      p.id === entities.dragging.id ? { ...p, x, y } : p
    );

    entities.points.setPoints(updatedPoints);
    return entities;
  }

  if (mouseUp && entities.dragging) {
    const { dragging, ...rest } = entities;
    return rest;
  }

  return entities;
};

export const systems = {
  dragSystem,
};