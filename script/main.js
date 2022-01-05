"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL VARIABLES                                        ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * config                   {Object}                    Object literal variables
 * @var                     {DOM Element} canvas        DOM element
 * @var                     {DOM Element} context       CanvasRenderingContext2D for drawing surface on the <canvas> element
 * @var                     {Object} domWindow          DOM window width, height, center x-coordinate, and center y-coordinate
 * @var                     {Object} about              General Information concerning  
 */
const config = 
{
    canvas    : document.getElementById("canvas"),
    context   : document.getElementById("canvas").getContext("2d"),
    canvas2   : document.getElementById("canvas-underlay"),
    context2  : document.getElementById("canvas-underlay").getContext("2d"),
    domWindow : 
    {
        width:    window.innerWidth  - 18,
        height:   window.innerHeight - 4,
        xCenter: (window.innerWidth  / 2),
        yCenter: (window.innerHeight / 2),
    },
    debug : true,
    windows:
    {
        about:      false,
        properties: false
    },
    about : 
    {
        Author:  'Justin Don Byrne',
        Created: 'January, 5 2022',
        Library: 'Guitar Scale Mapper',
        Updated: 'January, 5 2022',
        Version: '1.0.0',
        Copyright: 'Copyright (c) 2022 Justin Don Byrne'
    }
}

const matrix = new Array();

const colorArray = 
[
    '74, 42, 115',                  // PURPLE           SECONDARY
    '26, 46, 128',                  // BLUE-PURPLE      TERTIARY
    '40, 74, 144',                  // BLUE             PRIMARY
    '63, 146, 167',                 // BLUE-GREEN       TERTIARY
    '73, 146, 80',                  // GREEN            SECONDARY
    '150, 181, 62',                 // YELLOW-GREEN     TERTIARY
    '242, 227, 76',                 // YELLOW           PRIMARY
    '239, 181, 65',                 // YELLOW-ORANGE    TERTIARY
    '224, 130, 57',                 // ORANGE           SECONDARY
    '215, 84, 50',                  // RED-ORANGE       TERTIARY
    '200, 44, 41',                  // RED              PRIMARY
    '146, 35, 121'                  // RED-PURPLE       TERTIARY
];

const mouse = 
{
    coord:   { start: null, end: null },
    current: { x: null, y: null },
    down: false,
    existingLineIndex: -1
}

////////                            Debug Output                                            ////////

console.log('configuration: ', config);
console.log('matrix: ',        matrix);

//---   binding of resize()   ---//
window.addEventListener('resize', setupEnvironment);
window.addEventListener('load',   setupEnvironment);

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            PROTOTYPE FUNCTIONS                                     ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * containsArray()          {Array:Method}              Validates whether the root array contains the passed array passed.
 * @param                   {array} val                 Array sequence to validate
 * @return                  {boolean}                   True | False
 */
Array.prototype.containsArray      = function(val) 
{
    var hash = {};

    for (var i = 0; i < this.length; i++) 
    {
        hash[this[i]] = i;
    }

    return hash.hasOwnProperty(val);
}

/**
 * indexOfArray()           {Array:Method}              Returns the index of the array values (e.g.: [1, 2]) passed
 * @param                   {array} val                 Array sequence to validate
 * @return                  {number}                    Integer representing the index where the passed array matches 
 */
Array.prototype.indexOfArray       = function(val) 
{
    var index = -1;

    for (var i = 0; i < this.length; i++) 
    {
        var pointInversion = [val[2], val[3], val[0], val[1]];                  // For lines draw in an inverted fashion

        if (JSON.stringify(this[i]) === JSON.stringify(val) || JSON.stringify(this[i]) === JSON.stringify(pointInversion))
        {
            index = i;
        }
    }

    return index;
}

/**
 * pushPop()                {Array:Method}              Pushes or splices the value passed via the val param
 * @param                   {number} val                Value to be pushed or spliced
 */
Array.prototype.pushPop            = function(val)
{
    const index = (typeof(val) == 'number')
        ? this.indexOf(val)
        : this.indexOfArray(val);

    (index > -1) 
        ? this.splice(index, 1) 
        : this.push(val);

    this.sort((a, b) => a - b);
}

/**
 * convert2digStr()         {Number:Method}             Converts the casted value into a two digit string
 * @return                  {string}                    Two digit string
 */
Number.prototype.convert2digStr    = function()
{
    return (this < 10) ? `0${this}` : `${this}`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERAL FUNCTIONS                                       ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * setupEnvironment()       {Method}                    Sets up the initial UI environment
 */
function setupEnvironment()
{
    document.getElementById("canvas").width           = `${config.domWindow.width}`;
    document.getElementById("canvas").height          = `${config.domWindow.height}`;

    document.getElementById("canvas-underlay").width  = `${config.domWindow.width}`;
    document.getElementById("canvas-underlay").height = `${config.domWindow.height}`;

    document.getElementById("ui-overlay").style.setProperty('width',  `${config.domWindow.width}px`);
    document.getElementById("ui-overlay").style.setProperty('height', `${config.domWindow.height}px`);

    document.title = config.about.Library + ' | ver: ' + config.about.Version;

    // insertUIElements();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            INTERFACE FUNCTIONS                                     ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * toggleCheckbox()         {Method}                    Toggles whether the passed input[type='checkbox'] is checked; or not
 * @param                   {string}  id                The input element's id
 * @param                   {boolean} check             Overrides toggle to either 'on' or 'off'
 */
function toggleCheckbox(id, check = null)
{
    (check == null)
        ? document.getElementById(id).checked = (document.getElementById(id).checked) 
            ? false 
            : true
        : document.getElementById(id).checked = check;    
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GRAPHIC ALGORITHMS                                      ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * clearCanvas()            {Method}                    Clears the entire canvas element       
 */
function clearCanvas()
{
    config.context.clearRect(0, 0, config.canvas.width, config.canvas.height);
}

/**
 * drawCircle()             {Method}                    Draws a simple circle
 * @param                   {number}  x                 x - axis; center
 * @param                   {number}  y                 y - axis; center
 * @param                   {number}  radius            Circle radius
 * @param                   {Object}  angle             Angle object containing angle properties
 * @param                   {number}  angle.start       Start angle
 * @param                   {number}  angle.end         End angle
 * @param                   {Object}  stroke            Stroke object containing stroke properties
 * @param                   {string}  stroke.color      Stroke RGB number set for fill; r, g, b
 * @param                   {decimal} stroke.alpha      Stroke alpha (transparency) number value
 * @param                   {Object}  fill              Fill object containing fill properties
 * @param                   {string}  fill.color        Fill RGB number set for fill; r, g, b
 * @param                   {decimal} fill.alpha        Fill alpha (transparency) number value
 * @param                   {boolean} centerDot         Include a center dot
 */
function drawCircle(x, y, radius, angle = { start: 0, end: 2 * Math.PI }, stroke = { color: '0, 0, 0', alpha: 0.5 }, fill = { color: '255, 255, 255', alpha: 0.3}) 
{
    const circle = 
    { 
        start: 
        {
            x: centerX(x), 
            y: centerY(y), 
            radius: 10,  
            color: 'white'
        },
        end:
        {
            x: centerX(x), 
            y: centerY(y), 
            radius: 100, 
            color: `rgba(${fill.color}, ${fill.alpha})`            
        }
    }

    config.context.strokeStyle = `rgba(${stroke.color}, ${stroke.alpha})`;
    config.context.lineWidth   = 1;

    config.context.fillStyle = getRadialGradient(circle.start, circle.end);

    config.context.beginPath();
    
    config.context.arc(
        circle.start.x, 
        circle.start.y, 
        radius, 
        angle.start, 
        angle.end, 
        false                       // Counter Clockwise
    );
    
    (config.circle.stroke)
        ? config.context.stroke()
        : null;

    config.context.fill();

    (config.circle.centerDot)
        ? drawCircle(x, y, (radius / 4) * 0.18, angle.start, angle.end, stroke.color, stroke.alpha, fill.color, fill.alpha, false)
        : null;
}

/**
 * drawLine()               {Method}                    Draws a simple circle
 * @param                   {number} startX             X coordinate position to begin drawing at
 * @param                   {number} StartY             Y coordinate position to begin drawing at
 * @param                   {number} endX               X coordinate position to finish drawing at
 * @param                   {number} endY               Y coordinate position to finish drawing at
 */
function drawLine(startX, startY, endX, endY, lineWidth = 1, strokeColor = '0, 0, 0', strokeAlpha = 0.5) 
{
    config.context.strokeStyle = `rgba(${strokeColor}, ${strokeAlpha})`;
    config.context.lineCap     = 'round';

    config.context.beginPath();                             // Resets the current path

    config.context.moveTo(startX, startY);                  // Creates a new subpath with the given point
    config.context.lineTo(endX, endY);                      // Adds the given point to the subpath

    config.context.lineWidth = lineWidth;                   // Sets the width the the line to be rendered
    config.context.stroke();                                // Strokes the subpaths with the current stroke style
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERIC UI ALGORITHMS                                   ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * insertHtmlContent()      {Method}                    Insert HTML content in accordance with the window ID passed
 * @param                   {string} windowId           Window to populate HTML content
 */
function insertHtmlContent(windowId)
{
    switch (windowId)
    {
        case 'about':

            if (!config.windows.about)
            {
                document.getElementById('content').innerHTML +=
                    `<div id="program-name"><b>Program:</b> ${config.about.Library}</div>`
                    + `<div id="version-number"><b>Version:</b> ${config.about.Version}</div>`
                    + `<div id="updated-last"><b>Updated:</b> ${config.about.Updated}</div>`
                    + `<div id="about-copyright">${config.about.Copyright}, all rights reserved</div>`;

                config.windows.about = true; 
            }

            break;

        case 'properties':

            if (!config.windows.properties)
            {
                config.windows.properties = true; 
            }

            break;

        default:

            console.log(`${windowId} is not supported by the insertHtmlContent() function!`);
            
            break;
    }
}

/**
 * showWindow()             {Method}                    Display the window that's passed via it's windowId param
 * @param                   {string} windowId           Window to populate HTML content
 * @param                   {string} align              How the window should be aligned against the main window
 */
function showWindow(windowId, align = 'center')
{
    let element = document.getElementById(`${windowId}-window`);

    (element.style.display == 'none')
        ? setElementsPosition()
        : element.style.setProperty('display', 'none');

    function setElementsPosition()
    {
        element.style.setProperty('display', 'block');

        switch (align)
        {
            case 'top':

                element.style.setProperty('margin-left', `${(config.domWindow.width  - parseInt(element.style.width))  / 2}px`);
                element.style.setProperty('margin-top',  '0px');

                break;

            case 'right':

                element.style.setProperty('margin-left', `${(config.domWindow.width  - parseInt(element.style.width))}px`);
                element.style.setProperty('margin-top',  `${(config.domWindow.height - parseInt(element.style.height)) / 2}px`);

                break;

            case 'bottom':

                element.style.setProperty('margin-left', `${(config.domWindow.width  - parseInt(element.style.width))  / 2}px`);
                element.style.setProperty('margin-top',  `${(config.domWindow.height - parseInt(element.style.height))}px`);

                break;

            case 'left':

                element.style.setProperty('margin-left', '0px');
                element.style.setProperty('margin-top',  `${(config.domWindow.height - parseInt(element.style.height)) / 2}px`);

                break;

            case 'center':

                element.style.setProperty('margin-left', `${(config.domWindow.width  - parseInt(element.style.width))  / 2}px`);
                element.style.setProperty('margin-top',  `${(config.domWindow.height - parseInt(element.style.height)) / 2}px`);

                break;
        }
    }

    insertHtmlContent(windowId);
}

////////        UI Listeners        ////////

document.getElementById('clear-canvas').addEventListener("click", function()
{
    clearCanvas();
});

document.getElementById('about').addEventListener("click", function()
{
    showWindow('about');
});