export function drawEraser(ctx, x, y){
    ctx.lineWidth = 26; // Increasing line width here to improve eraser UX
    ctx.setLineDash([]); 
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
