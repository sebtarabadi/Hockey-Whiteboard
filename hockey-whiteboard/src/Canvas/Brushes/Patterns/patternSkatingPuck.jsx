export function patternSkatingPuck(ctx, x, y, angle, strokeColour){    
    ctx.save();
    ctx.translate(x, y); 
    ctx.rotate(angle); 
    ctx.translate(-x, -y); 

    ctx.beginPath();
    ctx.fillStyle = strokeColour;
    ctx.strokeStyle = strokeColour;
    ctx.fill();
    ctx.stroke();

    const scale = 0.8750; // Scale variable here for testing purposes; changing wave size to see how it looks

    ctx.beginPath();
    ctx.moveTo(x - 4, y - 1);
    ctx.bezierCurveTo(
      x + (1.167 - (-4)) * scale - 4, y + (16.667 - (-1)) * scale - 1,  
      x + (12 - (-4)) * scale - 4, y + (4.667 - (-1)) * scale - 1,      
      x + (10 - (-4)) * scale - 4, y - 1                              
    );
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + 9, y);
    ctx.bezierCurveTo(
      x + (7.167 - 9) * scale + 9, y + (-16.667 - 0) * scale,        
      x + (26.667 - 9) * scale + 9, y + (-4.667 - 0) * scale,        
      x + (22.5 - 9) * scale + 9, y + (1 - 0) * scale                 
    );
    ctx.stroke();
    

    ctx.restore(); 
}
