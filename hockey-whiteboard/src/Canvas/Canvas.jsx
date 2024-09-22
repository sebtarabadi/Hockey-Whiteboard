import { useState, useEffect, useRef } from "react";

import { drawPass } from "./Brushes/drawPass.jsx";
import { drawShot } from "./Brushes/drawShot.jsx";
import { drawEraser } from "./Brushes/drawEraser.jsx";
import { drawLateralSkating } from "./Brushes/drawLateralSkating.jsx";
import { drawSkatingPuck } from "./Brushes/drawSkatingPuck.jsx";
import { drawBackwardsPuck } from "./Brushes/drawBackwardsPuck.jsx";
import { drawBackwards } from "./Brushes/drawBackwards.jsx";
import { drawSkating } from "./Brushes/drawSkating.jsx"

// Using an import file here helps keep code clean and drastically reduces the line count in this main file
import {COUNTER_CONE, ARROW_HEAD, COUNTER_ERASER, COUNTER_BLUE_DEFENSE, COUNTER_BLUE_FORWARD, COUNTER_BLUE_CENTRE, COUNTER_BLUE_GOALIE, COUNTER_BLUE_LEFT_DEFENSE, COUNTER_BLUE_RIGHT_DEFENSE, COUNTER_BLUE_LEFT_WING, COUNTER_BLUE_RIGHT_WING, COUNTER_DEKER, COUNTER_NET, COUNTER_PUCK, COUNTER_PUCK_BUNDLE, 
    COUNTER_RED_DEFENSE, COUNTER_RED_FORWARD, COUNTER_RED_CENTRE, COUNTER_RED_GOALIE, COUNTER_RED_LEFT_DEFENSE, COUNTER_RED_LEFT_WING, COUNTER_RED_RIGHT_DEFENSE, COUNTER_RED_RIGHT_WING, COUNTER_TIRE, FULL_RINK,
    backgroundHalfRinkLeft, backgroundHalfRinkRight, backgroundEndZone, backgroundNeutralZone, imgCounterCone, imgCounterBlueDefense, imgCounterBlueForward, imgCounterBlueCentre, imgCounterBlueGoalie, imgCounterBlueLeftDefense, imgCounterBlueRightDefense,
    imgCounterBlueLeftWing, imgCounterBlueRightWing, imgCounterDeker, imgCounterNet, imgCounterPuck, imgCounterPuckBundle, imgCounterRedDefense, imgCounterRedForward, imgCounterRedCentre, imgCounterRedGoalie, imgCounterRedLeftDefense, imgCounterRedLeftWing, imgCounterRedRightDefense,
    imgCounterRedRightWing, imgCounterTire, backgroundFullRink
} from "./ImportFolder/Imports.jsx";

var activeRink = new Image();
activeRink.src = FULL_RINK;

let drawingsArray = [];
let index = -1;
let globalArrowColour = 'black'
let appendArrowFlag = false;
let drillTitle = 'Untitled Drill';

//The object below is responsible for holding all possible user-selectable brushes/counters
const brushTypes = {
    SKATE: 'SKATE',
    PASS: 'PASS',
    SHOT: 'SHOT',
    LATERAL_SKATING: 'LATERAL_SKATING',
    SKATING_PUCK: 'SKATING_PUCK',
    SKATING_BACKWARDS_PUCK: 'SKATING_BACKWARDS_PUCK',
    SKATING_BACKWARDS: 'SKATING_BACKWARDS',
    ERASER: 'ERASER',
    COUNTER_CONE: 'COUNTER_CONE',
    COUNTER_BLUE_DEFENSE: 'COUNTER_BLUE_DEFENSE',
    COUNTER_BLUE_FORWARD: 'COUNTER_BLUE_FORWARD',
    COUNTER_BLUE_CENTRE: 'COUNTER_BLUE_CENTRE',
    COUNTER_BLUE_GOALIE: 'COUNTER_BLUE_GOALIE',
    COUNTER_BLUE_LEFT_DEFENSE: 'COUNTER_BLUE_LEFT_DEFENSE',
    COUNTER_BLUE_RIGHT_DEFENSE: 'COUNTER_BLUE_RIGHT_DEFENSE',
    COUNTER_BLUE_LEFT_WING: 'COUNTER_BLUE_LEFT_WING',
    COUNTER_BLUE_RIGHT_WING: 'COUNTER_BLUE_RIGHT_WING',
    COUNTER_DEKER: 'COUNTER_DEKER',
    COUNTER_NET: 'COUNTER_NET',
    COUNTER_PUCK: 'COUNTER_PUCK',
    COUNTER_PUCK_BUNDLE: 'COUNTER_PUCK_BUNDLE',
    COUNTER_RED_DEFENSE: 'COUNTER_RED_DEFENSE',
    COUNTER_RED_FORWARD: 'COUNTER_RED_FORWARD',
    COUNTER_RED_CENTRE: 'COUNTER_RED_CENTRE',
    COUNTER_RED_GOALIE: 'COUNTER_RED_GOALIE',
    COUNTER_RED_LEFT_DEFENSE: 'COUNTER_RED_LEFT_DEFENSE',
    COUNTER_RED_LEFT_WING: 'COUNTER_RED_LEFT_WING',
    COUNTER_RED_RIGHT_DEFENSE: 'COUNTER_RED_RIGHT_DEFENSE',
    COUNTER_RED_RIGHT_WING: 'COUNTER_RED_RIGHT_WING',
    COUNTER_TIRE: 'COUNTER_TIRE'
};

/*
Below is the parent function for the function based Canvas component present in App.jsx,
It handles the changes in active event listeners, the brush selection logic, and contains the logic behind the drawing itself
*/

function drawFunc(canvas, strokeColour, activeBrush, activeCursor) {
    if (!canvas) return; 

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColour;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    globalArrowColour = strokeColour;
    canvas.style.cursor = `url(${activeCursor}) 25 25, auto`;
    
    let drawingFlag = false;
    let strokeStartX;
    let strokeStartY;
    let isDrawn = false;

    /*
    Below is responsible for the drawing of Counters, e.g. Cones, Player Positons, Pucks, etc,
    Nested functions here result in only 1 counter being able to be drawn at a time, preventing users from dragging the counters across the canvas, drawing plethoras of unwanted counters
    */

    function drawCounterWrapper(img){
        function drawSingleCounter(event) { 

            if (isDrawn) {
                return; 
            }
            
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            ctx.drawImage(img, (x - 25), (y - 25), 50, 50);  
            
            drawingsArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));    
            index += 1;

            isDrawn = true; 
        }

        canvas.addEventListener('click', drawSingleCounter);
    }
    
    /*
    The below function is responsible for the arrows that are appended to each line;
    The function works by tracking the user's drawing and then deducing if the line is both a 'legitimate' line, i.e. a genuine line involved in a hockey drill, not just a misclick,
    and then also the direction of movement the line is following, thus when it appends an arrow to the end of the line, it accurately signals the direction in which the player,pass,shot,etc
    is intended to travel
    */

    function drawArrow(event) {
        let drawDistanceChanged = 0;
        
        let x = event.clientX - canvas.offsetLeft;
        let y = event.clientY - canvas.offsetTop;
        
        let dx = x - strokeStartX;
        let dy = y - strokeStartY;

        drawDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (!appendArrowFlag && drawDistanceChanged >= 12) {    // Change in draw distance checked as it prevents users from being able to dot arrows all over, ensuring arrows are only drawn alongside 'legitimate' lines
            appendArrowFlag = true;                             // 12 is the chosen value as it is of a size where the user is not likely to accidentally satisfy the requirement
        }               

        if (appendArrowFlag === true){
            let directionX = dx / drawDistanceChanged;
            let directionY = dy / drawDistanceChanged;

            strokeStartX += 5 * directionX;
            strokeStartY += 5 * directionY;

            let fromX = strokeStartX;
            let fromY = strokeStartY;

            let toX = x;
            let toY = y;

            let size = 30;

            let angle = Math.atan2(toY - fromY, toX - fromX);

            let offset = -20;   // Offset at -20 causes the BASE of the triangle to be at the mouse position, instead of the centre point of the triangle, resulting in a neater arrow at the end of the line

            toX = toX - offset * Math.cos(angle);
            toY = toY - offset * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - size * Math.cos(angle - Math.PI / 6), toY - size * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(toX - size * Math.cos(angle + Math.PI / 6), toY - size * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fillStyle = globalArrowColour;
            ctx.fill();

            drawingFlag = false;
            ctx.beginPath();

            drawingsArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
            
            index += 1;
            
            if (drawDistanceChanged <=11){
                appendArrowFlag = false;
            }
        }
    }
    
    /*
    This function is set to call on the first part of the user's click i.e. 'mousedown', it tracks the initial position of the
    user's strokes and also tracks whether or not the line being drawn is a legitimate line or not
    */

    function startPos(event) {
        drawingFlag = true;

        let x = event.clientX - canvas.offsetLeft;
        let y = event.clientY - canvas.offsetTop;

        let drawDistanceChanged = 0;
        
        let dx = x - strokeStartX;
        let dy = y - strokeStartY;

        drawDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (drawDistanceChanged <=11){
            appendArrowFlag = false;
        }

        if (appendArrowFlag === true){   // Resetting the arrow flag here prevents more than 1 from being drawn
            appendArrowFlag = false;
        }
        
        strokeStartX = event.offsetX;
        strokeStartY = event.offsetY; 

        draw(event);
    }

    /*
    Called on the latter part of the click i.e. 'mouseup', this finishes the user's stroke and adds the drawn content to the drawingsArray
    allowing it to now be affected by undo and redo operations
    */

    function endPos(event) {
        drawingFlag = false;
        ctx.beginPath();

        drawingsArray = drawingsArray.slice(0, index + 1); // Truncate redo history after a new action - After the user adds to the Canvas, that addition is the most recent, preventing issues with redo logic

        drawingsArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        index += 1;
    }

    function draw(event) {
        if (!drawingFlag) return;

        let x = event.clientX - canvas.offsetLeft;
        let y = event.clientY - canvas.offsetTop;

        ctx.strokeStyle='transparent';  // Similar to tracking draw distance in the arrow function, setting the pen colour to transparent here prevents black dots from being able to be dotted all over
        let drawDistanceChanged = 0;
        
        let dx = x - strokeStartX;
        let dy = y - strokeStartY;
        let angle = Math.atan2(dy, dx);

        drawDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (drawDistanceChanged >= 12) {    // Similar to the arrow function, check to see if the line being drawn is a 'legitimate' one
            ctx.strokeStyle=strokeColour;   // Recognises enough distance drawn thus changes the pen colour back to the user-selected one

            appendArrowFlag = true;

            dx = x - strokeStartX;
            dy = y - strokeStartY;
            angle = Math.atan2(dy, dx);
            drawDistanceChanged = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));   
        }

        switch (activeBrush) {
            case brushTypes.SKATE:
                drawSkating(ctx, x, y);
                break;
            case brushTypes.ERASER:
                globalArrowColour = 'transparent';  // Still need to draw an arrow because of undo & redo operations and index values, thus it still draws an arrow, just an invisible one, uneffecting the index
                ctx.globalCompositeOperation = "destination-out";   // Set to Eraser
                drawEraser(ctx, x, y);
                ctx.globalCompositeOperation = "source-over";   // Revert back to Draw
                break;
            case brushTypes.PASS:
                drawPass(ctx, drawingsArray, index, strokeStartX, strokeStartY, x, y);
                break;
            case brushTypes.SHOT:
                drawShot(ctx, drawingsArray, index, strokeStartX, strokeStartY, x, y);
                break;
            case brushTypes.LATERAL_SKATING:
                drawLateralSkating(ctx, drawingsArray, index, strokeStartX, strokeStartY, x, y);
                break;
            case brushTypes.SKATING_PUCK:
                ctx.strokeStyle = 'transparent';    // Setting the pen colour to transparent in the following cases as the below draw functions use patterns to create the desired designs, not user-drawn lines
                ({ strokeStartX, strokeStartY } = drawSkatingPuck(ctx, x, y, strokeStartX, strokeStartY, strokeColour));
                break;
            case brushTypes.SKATING_BACKWARDS_PUCK:
                ctx.strokeStyle = 'transparent';
                ({ strokeStartX, strokeStartY } = drawBackwardsPuck(ctx, x, y, strokeStartX, strokeStartY, strokeColour));
                break;
            case brushTypes.SKATING_BACKWARDS:
                ctx.strokeStyle = 'transparent';
                ({ strokeStartX, strokeStartY } = drawBackwards(ctx, x, y, strokeStartX, strokeStartY, strokeColour));
                break;
            case brushTypes.COUNTER_CONE: 
                globalArrowColour = 'transparent';  // Counter content such as cone and puck counters do not require a directional arrow, therefore the arrow colour is set to transparent here,
                isDrawn = false;                    // Rather then removing the event listener entirely, doing it this way, similar to the eraser, prevents issues arising from changes in the index values when doing undos & redos
                canvas.addEventListener('click', drawCounterWrapper(imgCounterCone));
                break;
            case brushTypes.COUNTER_BLUE_DEFENSE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueDefense));
                break;
            case brushTypes.COUNTER_BLUE_FORWARD: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueForward));
                break;  
            case brushTypes.COUNTER_BLUE_CENTRE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueCentre));
                break;
            case brushTypes.COUNTER_BLUE_GOALIE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueGoalie));
                break;
            case brushTypes.COUNTER_BLUE_LEFT_DEFENSE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueLeftDefense));
                break;
            case brushTypes.COUNTER_BLUE_RIGHT_DEFENSE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueRightDefense));
                break;
            case brushTypes.COUNTER_BLUE_LEFT_WING: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueLeftWing));
                break;
            case brushTypes.COUNTER_BLUE_RIGHT_WING: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterBlueRightWing));
                break;
            case brushTypes.COUNTER_DEKER: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterDeker));
                break;
            case brushTypes.COUNTER_NET: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterNet));
                break;
            case brushTypes.COUNTER_PUCK: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterPuck));
                break;  
            case brushTypes.COUNTER_PUCK_BUNDLE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterPuckBundle));
                break;
            case brushTypes.COUNTER_RED_DEFENSE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedDefense));
                break;
            case brushTypes.COUNTER_RED_FORWARD: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedForward));
                break;
            case brushTypes.COUNTER_RED_CENTRE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedCentre));
                break;
            case brushTypes.COUNTER_RED_GOALIE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedGoalie));
                break;
            case brushTypes.COUNTER_RED_LEFT_DEFENSE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedLeftDefense));
                break;
            case brushTypes.COUNTER_RED_LEFT_WING: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedLeftWing));
                break;
            case brushTypes.COUNTER_RED_RIGHT_DEFENSE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedRightDefense));
                break;
            case brushTypes.COUNTER_RED_RIGHT_WING: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterRedRightWing));
                break;
            case brushTypes.COUNTER_TIRE: 
                globalArrowColour = 'transparent';
                isDrawn = false;
                canvas.addEventListener('click', drawCounterWrapper(imgCounterTire));
                break;
            default:
                break;
        }
    }

    /*
    The below functions are vital in ensuring that the application runs seamlessly when switching brushes and ensuring that only the intended event listeners are active
    */
    
    function addEventListeners() {
        canvas.addEventListener("mousedown", startPos);
        canvas.addEventListener("mouseup", endPos);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", drawArrow);
    }

    function removeEventListeners() {
        canvas.removeEventListener("mousedown", startPos);
        canvas.removeEventListener("mouseup", endPos);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", drawArrow);
    }

    /*
    Remove is called first in order to ensure that any previously attached event listeners are stripped,
    Add is then called and attaches the relevant event listeners ready for drawing
    */

    removeEventListeners();
    addEventListeners();

    return () => {
        removeEventListeners();
    };
}

const Canvas = (props) => {
    const canvasRef = useRef();

    let [activeCursor, setActiveCursor] = useState(ARROW_HEAD); // Default cursor set to a Blank Axis Crosshair
    let [strokeColour, setStrokeColour] = useState("black");    // Default pen colour set to Black
    const [activeBrush, setActiveBrush] = useState(brushTypes.SKATE);   // Default brush set to regular Forward Skating
    const [activeRink, setActiveRink] = useState(backgroundFullRink);   // Default Background image set to Full Rink
    

    const changeBackground = (activeRink) => {
        setActiveRink(activeRink);  
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(activeRink, 0, 0, canvas.width, canvas.height);   // Draws an image fit to the size of the Canvas, creating a background
    };    


    const changeColour = (event) => {
        setStrokeColour(event.target.value);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = 'transparent';
    }

    // Index adjustment at 2 to account for Lines AND Arrowheads, preventing the user from pressing undo and only having a line's arrow be undone rather than the whole line
    const undoStroke = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (index == 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            index = -2;
        }
        
        /*
        Although index is intended to be incremented and decremented by 2, there are still cases in which index can equal 1, therefore the below if statment is vital in preventing unintended behaviour,
        a particular example of this is the user undoing a drawn line only to have it be partially redrawn when they try and draw a new line that utilises getImageData, slicing the array after manipulating
        the index value by 1 is what fixes this error
        */

        if (index == 1) {                                      
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            index = -1; 
            drawingsArray = drawingsArray.slice(0, index + 1); 
            index = -1;     
        } 
        if (index < 0) {
            // Do Nothing
        }
        else {
            index -= 2;
            ctx.putImageData(drawingsArray[index], 0, 0);
        }
    };

    const redoStroke = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (index < drawingsArray.length - 1) {
            index += 2;
            ctx.putImageData(drawingsArray[index], 0, 0);
        }
    };

    const clearBoard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawingsArray = [];
        index = -1;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const cleanup = drawFunc(canvas, strokeColour, activeBrush, activeCursor);
        return cleanup;
    }, [strokeColour, activeBrush, activeCursor]);


    const canvasStyle = { 
        background: `url(${activeRink.src})`,  
    };

    const downloadAsImage = () => {
        const canvas = canvasRef.current;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
    
        tempCtx.drawImage(activeRink, 0, 0, canvas.width, canvas.height); 
        tempCtx.drawImage(canvas, 0, 0);
    
        const imageData = tempCanvas.toDataURL('image/png');
    
        const link = document.createElement('a');
        link.href = imageData;

        /*
        Always naming the file directly with the drillTitle variable caused issues if the variable hadnt been directly modified by the user, i.e. if the user didnt specifically type
        in a drill name; instead of downloading the file as Untitled Drill.png (the default value of the drillTitle var), it would just download as png.png, thus the below if and else if
        logic was introduced to circumvent this, opting to manually name the file if the user didn't specify a drill name
        */    

        if (drillTitle){     
            link.download = `${drillTitle}.png`; 
        }

        else if(!drillTitle){
            link.download = `Untitled Drill.png`; 
        }

        link.click();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        backgroundFullRink.onload = () => {
            ctx.drawImage(backgroundFullRink, 0, 0, canvas.width, canvas.height);   // Draw the image once its loaded
          };
      }, []);   // The empty array = effect only runs once when the component mounts


    // Dynamically update the drill title with the user input
    const handleInputChange = () => {
        const inputElement = document.getElementById("inputField");
        drillTitle = inputElement.value
    };

    return (
        <>
        <div className="container">

        <div className="topBar">
            <p id="outputText">Your Drill is Called: </p>
            <input
            id="inputField"
            type="text"
            placeholder="Untitled Drill"/>
            <div class="download-button">
                <button onClick={() => { handleInputChange(); downloadAsImage(); }}>Download Drill</button>
            </div>
        </div>

        <div className="brushesColumn">
            <h3>Brushes</h3>
        <button className="icon-eraser" onClick={() => {setActiveBrush(brushTypes.ERASER); setActiveCursor(COUNTER_ERASER)}}><h4>Eraser</h4></button>
        <button className="icon-skating" onClick={() => {setActiveBrush(brushTypes.SKATE); setActiveCursor(ARROW_HEAD)}}><h4>Skating</h4></button>
        <button className="icon-pass" onClick={() => {setActiveBrush(brushTypes.PASS); setActiveCursor(ARROW_HEAD)}}><h4>Pass</h4></button>
        <button className="icon-shoot" onClick={() => {setActiveBrush(brushTypes.SHOT); setActiveCursor(ARROW_HEAD)}}><h4>Shot</h4></button>
        <button className="icon-lateral-skating" onClick={() => {setActiveBrush(brushTypes.LATERAL_SKATING); setActiveCursor(ARROW_HEAD)}}><h4>Lateral Skating</h4></button>
        <button className="icon-skating-puck" onClick={() => {setActiveBrush(brushTypes.SKATING_PUCK); setActiveCursor(ARROW_HEAD)}}><h4>Skating with Puck</h4></button>
        <button className="icon-backwards-puck" onClick={() => {setActiveBrush(brushTypes.SKATING_BACKWARDS_PUCK); setActiveCursor(ARROW_HEAD)}}><h4>Backwards (Puck)</h4></button>
        <button className="icon-backwards" onClick={() => {setActiveBrush(brushTypes.SKATING_BACKWARDS); setActiveCursor(ARROW_HEAD)}}><h4>Backwards (No Puck)</h4></button>
        <button className="icon-undo" onClick={undoStroke}><h4>Undo</h4></button>
        <button className="icon-redo" onClick={redoStroke}><h4>Redo</h4></button>
            <h3>Change Brush Colour</h3>
        <input className="colour-picker" type="color" value={strokeColour} onChange={changeColour}/>
            <h3>Clear Board</h3>
        <button className="icon-clear" onClick={clearBoard}></button>
        </div>

        <div className="rink">
        <canvas ref={canvasRef} {...props} style={canvasStyle}/>
        </div>

        <div className="countersColumn">
            <h3>Utility</h3>
        <button className="counter-deker" onClick={() => {setActiveBrush(brushTypes.COUNTER_DEKER); setActiveCursor(COUNTER_DEKER)}}></button>
        <button className="counter-net" onClick={() => {setActiveBrush(brushTypes.COUNTER_NET); setActiveCursor(COUNTER_NET)}}></button>
        <button className="counter-cone" onClick={() => {setActiveBrush(brushTypes.COUNTER_CONE); setActiveCursor(COUNTER_CONE)}}></button>
        <button className="counter-puck" onClick={() => {setActiveBrush(brushTypes.COUNTER_PUCK); setActiveCursor(COUNTER_PUCK)}}></button>
        <button className="counter-puck-bundle" onClick={() => {setActiveBrush(brushTypes.COUNTER_PUCK_BUNDLE); setActiveCursor(COUNTER_PUCK_BUNDLE)}}></button>
        <button className="counter-tire" onClick={() => {setActiveBrush(brushTypes.COUNTER_TIRE); setActiveCursor(COUNTER_TIRE)}}></button>
            <h3>Players - Blue</h3>
        <button className="counter-blue-defense" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_DEFENSE); setActiveCursor(COUNTER_BLUE_DEFENSE)}}></button>
        <button className="counter-blue-forward" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_FORWARD); setActiveCursor(COUNTER_BLUE_FORWARD)}}></button>
        <button className="counter-blue-centre" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_CENTRE); setActiveCursor(COUNTER_BLUE_CENTRE)}}></button>
        <button className="counter-blue-goalie" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_GOALIE); setActiveCursor(COUNTER_BLUE_GOALIE)}}></button>
        <button className="counter-blue-left-defense" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_LEFT_DEFENSE); setActiveCursor(COUNTER_BLUE_LEFT_DEFENSE)}}></button>
        <button className="counter-blue-right-defense" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_RIGHT_DEFENSE); setActiveCursor(COUNTER_BLUE_RIGHT_DEFENSE)}}></button>
        <button className="counter-blue-left-wing" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_LEFT_WING); setActiveCursor(COUNTER_BLUE_LEFT_WING)}}></button>
        <button className="counter-blue-right-wing" onClick={() => {setActiveBrush(brushTypes.COUNTER_BLUE_RIGHT_WING); setActiveCursor(COUNTER_BLUE_RIGHT_WING)}}></button>
             <h3>Players - Red</h3>
        <button className="counter-red-defense" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_DEFENSE); setActiveCursor(COUNTER_RED_DEFENSE)}}></button>
        <button className="counter-red-forward" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_FORWARD); setActiveCursor(COUNTER_RED_FORWARD)}}></button>
        <button className="counter-red-centre" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_CENTRE); setActiveCursor(COUNTER_RED_CENTRE)}}></button>
        <button className="counter-red-goalie" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_GOALIE); setActiveCursor(COUNTER_RED_GOALIE)}}></button>
        <button className="counter-red-left-defense" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_LEFT_DEFENSE); setActiveCursor(COUNTER_RED_LEFT_DEFENSE)}}></button>
        <button className="counter-red-right-defense" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_RIGHT_DEFENSE); setActiveCursor(COUNTER_RED_RIGHT_DEFENSE)}}></button>
        <button className="counter-red-left-wing" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_LEFT_WING); setActiveCursor(COUNTER_RED_LEFT_WING)}}></button>
        <button className="counter-red-right-wing" onClick={() => {setActiveBrush(brushTypes.COUNTER_RED_RIGHT_WING); setActiveCursor(COUNTER_RED_RIGHT_WING)}}></button>
        </div>

        <div className="bottomBar">
        <button className="rink-full-rink" onClick={() => changeBackground(backgroundFullRink)}></button>
        <button className="rink-half-rink-left" onClick={() => changeBackground(backgroundHalfRinkLeft)}></button>
        <button className="rink-half-rink-right" onClick={() => changeBackground(backgroundHalfRinkRight)}></button>
        <button className="rink-end-zone" onClick={() => changeBackground(backgroundEndZone)}></button>
        <button className="rink-neutral-zone" onClick={() => changeBackground(backgroundNeutralZone)}></button>
        </div>
    
        </div>
        </>
    );
};

export default Canvas;