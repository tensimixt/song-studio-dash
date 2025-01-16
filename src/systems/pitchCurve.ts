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
        const offsetX = mouseDown.payload.clientX - rect.left - point.x;
        const offsetY = mouseDown.payload.clientY - rect.top - point.y;
        
        return {
          ...entities,
          dragging: { id: pointId, offsetX, offsetY }
        };
      }
    }
  }

  if (mouseMove && entities.dragging) {
    const container = document.querySelector('.game-engine');
    if (!container) return entities;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(mouseMove.payload.clientX - rect.left - entities.dragging.offsetX, rect.width));
    const y = Math.max(0, Math.min(mouseMove.payload.clientY - rect.top - entities.dragging.offsetY, rect.height));

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