import { patternSkatingPuck } from "../Brushes/Patterns/patternSkatingPuck.jsx";
export function drawSkatingPuck(ctx, x, y, strokeStartX, strokeStartY, strokeColour){ 
    ctx.setLineDash([]);
    let skatingPuckDistanceChanged = 0;
        
    let dx = x - strokeStartX;
    let dy = y - strokeStartY;
    let angle = Math.atan2(dy, dx);

    skatingPuckDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    while (skatingPuckDistanceChanged >= 24) {

     let directionX = dx / skatingPuckDistanceChanged;
     let directionY = dy / skatingPuckDistanceChanged;

      strokeStartX += 24 * directionX;
      strokeStartY += 24 * directionY;

      patternSkatingPuck(ctx, strokeStartX, strokeStartY, angle, strokeColour); 

     dx = x - strokeStartX;
     dy = y - strokeStartY;
     angle = Math.atan2(dy, dx);
     skatingPuckDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    return {strokeStartX, strokeStartY,};
}
