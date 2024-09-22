export function drawSkating(ctx, x, y){
    ctx.setLineDash([]); 
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}