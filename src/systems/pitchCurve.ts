interface Point {
  id: string;
  x: number;
  y: number;
}

interface Entities {
  points: {
    points: Point[];
  };
  dragging?: string;
}

const dragSystem = (entities: Entities, { input }: any) => {
  if (!input) return entities;

  const { points } = entities.points;
  const mouseDown = input.find((x: any) => x.type === "mousedown");
  const mouseMove = input.find((x: any) => x.type === "mousemove");
  const mouseUp = input.find((x: any) => x.type === "mouseup");

  if (mouseDown) {
    const target = mouseDown.payload.target;
    const pointId = target.dataset.pointId;
    if (pointId) {
      const rect = target.closest('.game-engine').getBoundingClientRect();
      const x = mouseDown.payload.clientX - rect.left;
      const y = mouseDown.payload.clientY - rect.top;
      
      entities.dragging = pointId;
      
      // Update point position immediately on mouse down
      const updatedPoints = points.map(p => {
        if (p.id === pointId) {
          return { ...p, x, y };
        }
        return p;
      });

      return {
        ...entities,
        points: {
          ...entities.points,
          points: updatedPoints,
        },
      };
    }
  }

  if (mouseMove && entities.dragging) {
    const container = document.querySelector('.game-engine');
    if (!container) return entities;

    const rect = container.getBoundingClientRect();
    const x = mouseMove.payload.clientX - rect.left;
    const y = mouseMove.payload.clientY - rect.top;

    const updatedPoints = points.map(p => {
      if (p.id === entities.dragging) {
        return { ...p, x, y };
      }
      return p;
    });

    return {
      ...entities,
      points: {
        ...entities.points,
        points: updatedPoints,
      },
    };
  }

  if (mouseUp && entities.dragging) {
    delete entities.dragging;
  }

  return entities;
};

export const systems = {
  dragSystem,
};