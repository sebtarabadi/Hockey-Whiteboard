export function drawShot(ctx, restore_array, index, strokeStartX, strokeStartY, x, y){
    restore_array.push(ctx.getImageData(0, 0, 1310, 700))   // 1310, 700 = canvas dimensions
    index += 1;

    ctx.putImageData(restore_array[index], 0, 0);
    ctx.setLineDash([]); 

    let offset = 5;
    const angle = Math.atan2(y - strokeStartY, x - strokeStartX);
    const offsetX = offset * Math.cos(angle + Math.PI / 2);
    const offsetY = offset * Math.sin(angle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(strokeStartX + offsetX, strokeStartY + offsetY);
    ctx.lineTo(x + offsetX, y + offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(strokeStartX - offsetX, strokeStartY - offsetY);
    ctx.lineTo(x - offsetX, y - offsetY);
    ctx.stroke();
}