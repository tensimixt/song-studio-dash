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

const dragSystem = (entities: Entities, { input, dispatch }: any) => {
  if (!input) return entities;

  const { points } = entities.points;
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
      const x = mouseDown.payload.clientX - rect.left;
      const y = mouseDown.payload.clientY - rect.top;

      const updatedPoints = points.map(p => 
        p.id === pointId ? { ...p, x, y } : p
      );

      dispatch({ type: 'point-moved', points: updatedPoints });
      
      return {
        ...entities,
        dragging: pointId,
        points: { ...entities.points, points: updatedPoints },
      };
    }
  }

  if (mouseMove && entities.dragging) {
    const container = document.querySelector('.game-engine');
    if (!container) return entities;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(mouseMove.payload.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(mouseMove.payload.clientY - rect.top, rect.height));

    const updatedPoints = points.map(p => 
      p.id === entities.dragging ? { ...p, x, y } : p
    );

    dispatch({ type: 'point-moved', points: updatedPoints });

    return {
      ...entities,
      points: { ...entities.points, points: updatedPoints },
    };
  }

  if (mouseUp && entities.dragging) {
    const updatedEntities = { ...entities };
    delete updatedEntities.dragging;
    return updatedEntities;
  }

  return entities;
};

export const systems = {
  dragSystem,
};