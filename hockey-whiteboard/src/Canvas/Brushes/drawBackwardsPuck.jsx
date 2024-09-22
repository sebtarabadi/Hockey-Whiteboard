import { patternBackwardsPuck } from "../Brushes/Patterns/patternBackwardsPuck.jsx";
export function drawBackwardsPuck(ctx, x, y, strokeStartX, strokeStartY, strokeColour) {
    ctx.setLineDash([]);
    let backwardsPuckDistanceChanged = 0;
        
    let dx = x - strokeStartX;
    let dy = y - strokeStartY;
    let angle = Math.atan2(dy, dx);

    backwardsPuckDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    while (backwardsPuckDistanceChanged >= 35) {    // Distance of 35 here is the distance that is needed to draw additional patterns, 35 is perfect distance with this pattern

     let directionX = dx / backwardsPuckDistanceChanged;
     let directionY = dy / backwardsPuckDistanceChanged;

      strokeStartX += 35 * directionX;
      strokeStartY += 35 * directionY;

      patternBackwardsPuck(ctx, strokeStartX, strokeStartY, angle, strokeColour);

     dx = x - strokeStartX;
     dy = y - strokeStartY;
     angle = Math.atan2(dy, dx);
     backwardsPuckDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    return {strokeStartX, strokeStartY};
}