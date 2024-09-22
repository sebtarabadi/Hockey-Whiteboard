import { patternBackwards } from "../Brushes/Patterns/patternBackwards.jsx";
export function drawBackwards(ctx, x, y, strokeStartX, strokeStartY, strokeColour) {
    ctx.setLineDash([]);
    let backwardsWithoutPuckDistanceChanged = 0;
        
    let dx = x - strokeStartX;
    let dy = y - strokeStartY;
    let angle = Math.atan2(dy, dx);

    backwardsWithoutPuckDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    while (backwardsWithoutPuckDistanceChanged >= 35) {     // Distance of 35 here is the distance that is needed to draw additional patterns, 35 is perfect distance with this pattern

     let directionX = dx / backwardsWithoutPuckDistanceChanged;
     let directionY = dy / backwardsWithoutPuckDistanceChanged;

      strokeStartX += 35 * directionX;
      strokeStartY += 35 * directionY;

      patternBackwards(ctx, strokeStartX, strokeStartY, angle, strokeColour);

     dx = x - strokeStartX;
     dy = y - strokeStartY;
     angle = Math.atan2(dy, dx);
     backwardsWithoutPuckDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    return {strokeStartX, strokeStartY};
}