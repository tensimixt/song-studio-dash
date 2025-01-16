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
  console.log('DragSystem called with input:', input);
  
  if (!input) {
    console.log('No input received');
    return entities;
  }

  const mouseDown = input.find((x: any) => x.type === "mousedown");
  const mouseMove = input.find((x: any) => x.type === "mousemove");
  const mouseUp = input.find((x: any) => x.type === "mouseup");

  console.log('Event types found:', {
    hasMouseDown: !!mouseDown,
    hasMouseMove: !!mouseMove,
    hasMouseUp: !!mouseUp
  });

  if (mouseDown) {
    console.log('MouseDown detected:', mouseDown);
    const target = mouseDown.payload.target;
    const pointId = target.dataset.pointId;
    
    console.log('Target:', target);
    console.log('Point ID:', pointId);
    
    if (pointId) {
      const container = target.closest('.game-engine');
      if (!container) return entities;

      const rect = container.getBoundingClientRect();
      const point = entities.points.points.find(p => p.id === pointId);
      
      console.log('Container found:', container);
      console.log('Point found:', point);
      
      if (point) {
        const mouseX = mouseDown.payload.clientX - rect.left;
        const mouseY = mouseDown.payload.clientY - rect.top;
        
        console.log('Mouse coordinates:', { mouseX, mouseY });
        console.log('Point coordinates:', { x: point.x, y: point.y });
        
        entities = {
          ...entities,
          dragging: {
            id: pointId,
            startX: mouseX,
            startY: mouseY,
            offsetX: mouseX - point.x,
            offsetY: mouseY - point.y
          }
        };
      }
    }
  }

  if (mouseMove && entities.dragging) {
    console.log('Moving point:', entities.dragging.id);
    const container = document.querySelector('.game-engine');
    if (!container) return entities;

    const rect = container.getBoundingClientRect();
    const mouseX = mouseMove.payload.clientX - rect.left;
    const mouseY = mouseMove.payload.clientY - rect.top;

    console.log('New position:', { x: mouseX, y: mouseY });

    const updatedPoints = entities.points.points.map(p =>
      p.id === entities.dragging.id ? { ...p, x: mouseX, y: mouseY } : p
    );

    entities.points.setPoints(updatedPoints);
  }

  if (mouseUp && entities.dragging) {
    console.log('MouseUp detected');
    const { dragging, ...rest } = entities;
    return rest;
  }

  return entities;
};

export const systems = {
  dragSystem,
};