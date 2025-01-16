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
    const pointId = mouseDown.payload.target.dataset.pointId;
    if (pointId) {
      entities.dragging = pointId;
    }
  }

  if (mouseMove && entities.dragging) {
    const updatedPoints = points.map(p => {
      if (p.id === entities.dragging) {
        return {
          ...p,
          x: mouseMove.payload.pageX,
          y: mouseMove.payload.pageY,
        };
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