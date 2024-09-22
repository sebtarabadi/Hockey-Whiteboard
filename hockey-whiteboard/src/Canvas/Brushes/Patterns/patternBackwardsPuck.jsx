export function patternBackwardsPuck(ctx, x, y, angle, strokeColour) {
    ctx.save();
    ctx.translate(x, y); 
    ctx.rotate(angle); 
    ctx.translate(-x, -y); 

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);   // Same as Pattern Backwards, just with this additional line, adding the centre dot
    ctx.fillStyle = strokeColour;
    ctx.strokeStyle = strokeColour;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 1.5, y + 11.5, x + 15.5, y + 11.5, x + 15.5, y + 2);
    ctx.stroke();

    ctx.beginPath();    
    ctx.moveTo(x + 12, y - 5);
    ctx.bezierCurveTo(x - 1.75, y - 25.5, x - 18, y - 4.5, x - 10, y - 2.5);
    ctx.stroke();

    ctx.restore(); 
}