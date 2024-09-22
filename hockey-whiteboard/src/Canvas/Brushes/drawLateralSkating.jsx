export function drawLateralSkating(ctx, restore_array, index, strokeStartX, strokeStartY, x, y){
    restore_array.push(ctx.getImageData(0, 0, 1310, 700))   // 1310, 700 = canvas dimensions
    index += 1;

    ctx.putImageData(restore_array[index], 0, 0);
    ctx.setLineDash([1, 15]);
    
    let offset = 2;
    const angle = Math.atan2(y - strokeStartY, x - strokeStartX);
    const offsetX = offset * Math.cos(angle + Math.PI / 2);
    const offsetY = offset * Math.sin(angle + Math.PI / 2);
    
    for (let i = 0; i <= 4; i++){
        ctx.beginPath();
        ctx.moveTo(strokeStartX + offsetX*[i], strokeStartY + offsetY*[i]);
        ctx.lineTo(x + offsetX*[i], y + offsetY*[i]);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(strokeStartX - offsetX*[i], strokeStartY - offsetY*[i]);
        ctx.lineTo(x - offsetX*[i], y - offsetY*[i]);
        ctx.stroke();
    }
}