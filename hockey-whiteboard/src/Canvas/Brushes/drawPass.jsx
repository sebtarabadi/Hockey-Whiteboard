export function drawPass(ctx, restore_array, index, strokeStartX, strokeStartY, x, y){
    restore_array.push(ctx.getImageData(0, 0, 1310, 700))   // 1310, 700 = canvas dimensions
    index += 1;

    ctx.setLineDash([]); 
    ctx.setLineDash([15, 20]);
    ctx.putImageData(restore_array[index], 0, 0); 
    ctx.beginPath();
    ctx.moveTo(strokeStartX, strokeStartY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]); 
}