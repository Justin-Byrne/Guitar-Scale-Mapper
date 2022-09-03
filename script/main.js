"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL CONSTANTS                                        ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

const font = new FontFace ( 'OpenSans', 'url(./fonts/OpenSans-Regular.ttf)' );

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
    debug :         false,
    windows:
    {
        about:      false,
        properties: false
    },
    settings:
    {
        line:
        {
            type:  1,               // [1] solid, [2] dashed
            width: 1,               //  1 - .... - 5
            alpha: 1
        },
        circle:   
        {
            line: 
            {
                type:  1,           // [1] solid, [2] dashed
                width: 1            //  1 - .... - 5
            },
            fill:
            {
                type:  4,           // [1] empty, [2] solid
                color: 0            //  1 - ............................. - 11
            }
        },
        rectangle:
        {

        }
    },
    about : 
    {
        Author:    'Justin Don Byrne',
        Created:   'January, 5 2022',
        Library:   'Guitar Scale Mapper',
        Updated:   'September, 3 2022',
        Version:   '1.1.14',
        Copyright: 'Copyright (c) 2022 Justin Don Byrne'
    }
}

const colorArray = 
[
    '68, 69, 68',                   // JET                  BACKGROUND
    '249, 249, 249',                // WHITE SMOKE          FOREGROUND
    '108, 179, 223',                // CAROLINA BLUE        ROOT
    '168, 150, 197',                // LAVENDER PURPLE      3RD
    '223, 140, 155',                // PALE RED VIOLET      5TH
    '189, 188, 188',                // SILVER CHALICE       BRIDGE/ACCENT
    '243, 50, 45',                  // RED                  BOX COLOR (1)
    '255, 241, 0',                  // YELLOW ROSE          BOX COLOR (2)
    '62, 190, 91',                  // LIME GREEN           BOX COLOR (3)
    '19, 138, 200',                 // DENIM                BOX COLOR (4)
    '225, 87, 167',                 // PINK                 BOX COLOR (5)
];

const mouse = 
{
    coord:   { start: null, end: null },
    current: { x: null, y: null },
    down:    false,
    existingLineIndex: -1
}

////////                            GLOBAL CONSTANTS (INSTRUMENT SPECIFIC)                  ////////

const fretboard =
{
    element: document.getElementById('fretboard'),
    size:
    {
        width:  document.getElementById('fretboard').clientWidth,
        height: document.getElementById('fretboard').clientHeight
    },
    partition:
    {
        width:  document.getElementById('fretboard').clientWidth  / 13,
        height: document.getElementById('fretboard').clientHeight / 7
    },
    maxFrets:   12,
    maxStrings: 6,
    notes:      [ { } ]
}

const tone =
{
    notes :
    [
        'A',    // 0
        'A#',   // 1
        'B',    // 2
        'C',    // 3
        'C#',   // 4
        'D',    // 5
        'D#',   // 6
        'E',    // 7
        'F',    // 8
        'F#',   // 9
        'G',    // 10
        'G#'    // 11
    ],
    tuning :
    {
        standard :
        [ 
            {   // 1
                note :   'E',            
                octave :  4
            },
            {   // 2
                note :   'B',            
                octave :  3
            },
            {   // 3
                note :   'G',            
                octave :  3
            },
            {   // 4
                note :   'D',            
                octave :  3
            },
            {   // 5
                note :   'A',            
                octave :  2
            },
            {   // 6
                note :   'E',            
                octave :  2
            }
        ]
    },
    scale :
    {
        major :
        [
            2,  // 0
            2,  // 1
            1,  // 2
            2,  // 3
            2,  // 4
            2,  // 5
            1   // 6
        ]
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL VARIABLES                                        ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

let fretboardNotes;

let scale = [];

////////                            Debug Output                                            ////////

font.load ( ).then ( function ( ) { document.fonts.add ( font ); } );

console.clear ( );
console.log ( 'configuration: ', config );
console.log ( 'Window Width:', config.domWindow.width, 'Height:', config.domWindow.height );

//---   binding of resize()   ---//
window.addEventListener ( 'resize', setupEnvironment );
window.addEventListener ( 'load',   setupEnvironment );

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
    document.getElementById("canvas").width                         = `${fretboard.size.width}`;
    document.getElementById("canvas").height                        = `${fretboard.size.height}`;

    document.getElementById("canvas-underlay").width                = `${fretboard.size.width}`;
    document.getElementById("canvas-underlay").height               = `${fretboard.size.height}`;

    document.getElementById("ui-overlay").style.setProperty('width',  `${fretboard.size.width}px`);
    document.getElementById("ui-overlay").style.setProperty('height', `${fretboard.size.height}px`);

    document.title = config.about.Library + ' | ver: ' + config.about.Version;

    drawFretboard ( 'cells' );

    scale = setScale ( tone.scale.major, 'E'  );
    
    generateOpenNotes ( tone.tuning.standard );

    generateFretboardNotes ( );

    displayFretboardNotes ( true );

    // insertUIElements();
}

/**
 * getNextNote()            {Method}                    Returns the next note 
 * @param                   {boolean} cell              Cell value for the initial note; used to generate secondary note
 * @return                  {Object}                    Note and octave value of next note
 */
function getNextNote ( cell )
{
    let note   = fretboard.notes[ ( cell - 1 ) ].note;
    let octave = fretboard.notes[ ( cell - 1 ) ].octave;

    // Set: note index
    let index = ( tone.notes.indexOf ( note ) == 11 )       
        ? 0
        : tone.notes.indexOf ( note ) + 1;

    // Cycle: octave switch | 'B' = middle 'C'
    ( note == 'B' )                                         
        ? octave++
        : null;

    return { note: `${tone.notes[index]}`, octave: octave };
}

/**
 * setScale()               {Method}                    Set scale notes, to be used through desired scale
 * @param                   {Array}  type               Scale array from 'tone' Object
 * @param                   {[type]} root               Generated scale
 */
function setScale ( type, root )
{
    let index   = tone.notes.indexOfArray ( root );

    let scale    = Array();

        scale[0] = tone.notes[index];                       // Set: root note

    // Circle around scale array if at the end
    for ( let i = 1; i <= type.length - 1; i++ )
    {
        switch ( index + type[i - 1] )
        {
            case 12:  index = 0;  break;
            case 13:  index = 1;  break;
            case 14:  index = 2;  break;
            case 15:  index = 3;  break;

            default:
                
                index = index + type[i - 1];  

                break;
        }

        scale[i] = tone.notes[index];                       // Set: each subsequent note
    }

    return scale;
}

/**
 * generateOpenNotes()      {Method}                    Generate open notes for fretboard
 * @param                   {Array} tuning              Tuning array from 'tone' Object
 */
function generateOpenNotes ( tuning )
{
    // Generate: open notes
    for ( let i = 0; i < fretboard.maxStrings; i++ )
    {
        let index   = ( i * fretboard.maxFrets ) + i;

        let display = ( scale.indexOf ( tuning[i].note ) != -1 ) ? true : false;

        fretboard.notes[index] =
        {
            ...tuning[i],
            ...{ cell:    index   },
            ...{ display: display }
        }
    }
}

/**
 * generateFretboardNotes() {Method}                    Generate fret notes for fretboard
 */
function generateFretboardNotes ( )
{
    let cell = 0;

    // Generate: fretboard notes
    for ( let i = 0; i < fretboard.maxStrings; i++ )                            // Horizontal cells
    {            
        for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ )                  // Vertical cells
        {
            if ( cell % ( fretboard.maxFrets + 1 ) == 0 )
            {
                cell++;

                continue;
            }

            let noteData = getNextNote ( cell );

            let display  = ( scale.indexOf ( noteData.note ) != -1 ) ? true : false;

            fretboard.notes[cell] = 
            {
                ...{ note:    `${noteData.note}` },
                ...{ octave:   noteData.octave   },
                ...{ cell:     cell              },
                ...{ display:  display           }
            }

            cell++;
        }
    }
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
function clearCanvas ( )
{
    config.context.clearRect ( 0, 0, config.canvas.width, config.canvas.height );
}

/**
 * drawRectangle()          {Method}                    Draws a simple rectangle
 * @param                   {number}  x                 x - position
 * @param                   {number}  y                 y - position
 * @param                   {number}  width             Width of rectangle
 * @param                   {number}  height            Height of rectangle
 * @param                   {Object}  stroke            Stroke object containing stoke properties
 * @param                   {string}  stroke.color      Stroke RGB number set for fill; r, g, b
 * @param                   {decimal} stroke.alpha      Stroke alpha (transparency) number value
 * @param                   {Object}  fill              Fill object containing fill properties
 * @param                   {string}  fill.color        Fill RGB number set for fill; r, g, b
 * @param                   {decimal} fill.alpha        Fill alpha (transparency) number value
 */
function drawRectangle ( x, y, width, height, stroke = { color: '0, 0, 0', alpha: 1 }, fill = { color: '255, 255, 255', alpha: 0 } )
{
    config.context.strokeStyle = `rgba(${stroke.color}, ${stroke.alpha})`;

    // config.context.fillStyle   = `rgba(${fill.color}, ${fill.alpha})`;

    config.context.lineWidth   = 1;

    config.context.beginPath();

    config.context.rect(x, y, width, height);

    config.context.stroke();

    // config.context.fill();
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
function drawCircle ( x, y, radius, angle = { start: 0, end: 2 * Math.PI }, stroke = { color: '0, 0, 0', alpha: 0.5 }, fill = { color: '255, 255, 255', alpha: 0.3 } ) 
{
    const circle = 
    { 
        start: 
        {
            x: centerX ( x ), 
            y: centerY ( y ), 
            radius: 10,  
            color: 'white'
        },
        end:
        {
            x: centerX ( x ), 
            y: centerY ( y ), 
            radius: 100, 
            color: `rgba(${fill.color}, ${fill.alpha})`            
        }
    }

    config.context.strokeStyle = `rgba(${stroke.color}, ${stroke.alpha})`;
    
    config.context.lineWidth   = 1;

    config.context.fillStyle   = getRadialGradient ( circle.start, circle.end );

    config.context.beginPath ( );
    
    config.context.arc (
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
function drawLine ( xStart, xEnd, yStart, yEnd, lineWidth = 1, strokeColor = '0, 0, 0', strokeAlpha = 1 )
{
    config.context.strokeStyle = `rgba(${strokeColor}, ${strokeAlpha})`;
    config.context.lineCap     = 'round';

    config.context.beginPath ( );                           // Resets the current path

    config.context.moveTo ( xStart, yStart );               // Creates a new sub-path with the given point
    config.context.lineTo ( xEnd, yEnd );                   // Adds the given point to the sub-path

    config.context.lineWidth = lineWidth;                   // Sets the width the the line to be rendered
    config.context.stroke ( );                              // Strokes the sub-paths with the current stroke style
}

/**
 * displayText()            {Method}                    Display text
 * @param                   {number} x                  x - position
 * @param                   {number} y                  y - position
 * @param                   {string} text               Test to display
 * @param                   {number} maxWidth           Maximum width of text area
 */
function displayText ( x, y, text, maxWidth )
{
    let fontSize = 24;

    let textWidth = config.context.measureText ( text ).width;

    config.context.font = `${fontSize}px OpenSans`;

    config.context.fillText ( text, x - ( textWidth / 1.85 ), y + ( fontSize / 3.5 ), maxWidth );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERIC UI ALGORITHMS                                   ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * drawFretboard()          {Method}                    Draws fretboard using HTML5 canvas API calls
 * @param                   {string} type               Determines whether lines or cells are drawn
 */
function drawFretboard ( type = 'lines' )
{
    switch ( type )
    {
        case 'lines':

            // Horizontal lines
            for ( let i = 0; i < fretboard.maxStrings; i++ )                  
            {
                drawLine ( 
                    0,                                      // xStart
                    fretboard.size.width,                   // xEnd
                    fretboard.partition.height * i,         // yStart
                    fretboard.partition.height * i          // yEnd
                );
            }

            // Vertical lines
            for ( let i = 0; i < ( fretboard.maxFrets + 1 ); i++ )                 
            {
                drawLine ( 
                    fretboard.partition.width * i,          // xStart
                    fretboard.partition.width * i,          // xEnd
                    0,                                      // yStart
                    fretboard.size.height                   // xStart
                );
            }

            break;

        case 'cells':

            // Horizontal cells
            for ( let i = 0; i < fretboard.maxStrings; i++ )
            {
                // Vertical cells
                for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ ) 
                {
                    drawRectangle ( 
                        fretboard.partition.width  * j,     // x
                        fretboard.partition.height * i,     // y
                        fretboard.partition.width,          // width
                        fretboard.partition.height          // height
                    );
                }
            }

            break;
    }
}

/**
 * displayFretboardNotes()  {Method}                    Displays notes on the fretboard
 * @param                   {boolean} showOctave        Determine whether to display octaves on the fretboard
 */
function displayFretboardNotes ( showOctave = false )
{
    let index = 0;

    // Display: notes
    for ( let i = 0; i < fretboard.maxStrings; i++ )            // Horizontal cells
    {
        for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ )  // Vertical cells
        {
            let note    = fretboard.notes[index].note;
            let octave  = fretboard.notes[index].octave;
            let display = fretboard.notes[index].display;

            if ( note == undefined ) { continue; }

            let offset = ( index == 0 )
                ? 8
                : 0;

            let text = ( showOctave )
                ? `${note}${octave}`
                : `${note}`;

            if ( display )
            {
                displayText (
                    fretboard.partition.width  * j + ( fretboard.partition.width  / 2 ) - offset,   // x
                    fretboard.partition.height * i + ( fretboard.partition.height / 2 ),            // y
                    `${text}`,                                                                      // text
                    fretboard.partition.width,                                                      // width
                );
            }

            index++;
        }
    }

    // Display: fret numbers
    for ( let i = 0; i < ( fretboard.maxFrets + 1 ); i++ )
    {
        displayText (
            fretboard.partition.width  * i + ( fretboard.partition.width  / 2 ),                    // x
            fretboard.size.height - ( fretboard.partition.height / 2 ),                             // y
            `${i}`,                                                                                 // text
            fretboard.partition.width,                                                              // width
        );
    }
}

/**
 * insertHtmlContent()      {Method}                    Insert HTML content in accordance with the window ID passed
 * @param                   {string} windowId           Window to populate HTML content
 */
function insertHtmlContent ( windowId )
{
    switch ( windowId )
    {
        case 'about':

            if ( !config.windows.about )
            {
                document.getElementById ( 'content' ).innerHTML +=
                    `<div id="program-name"><b>Program:</b> ${config.about.Library}</div>`
                    + `<div id="version-number"><b>Version:</b> ${config.about.Version}</div>`
                    + `<div id="updated-last"><b>Updated:</b> ${config.about.Updated}</div>`
                    + `<div id="about-copyright">${config.about.Copyright}, all rights reserved</div>`;

                config.windows.about = true; 
            }

            break;

        case 'properties':

            if ( !config.windows.properties )
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
function showWindow ( windowId, align = 'center' )
{
    let element = document.getElementById(`${windowId}-window`);

    ( element.style.display == 'none' )
        ? setElementsPosition ( )
        : element.style.setProperty ( 'display', 'none' );

    function setElementsPosition ( )
    {
        element.style.setProperty ( 'display', 'block' );

        switch ( align )
        {
            case 'top':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) ) / 2}px` );
                element.style.setProperty ( 'margin-top',  '0px' );

                break;

            case 'right':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) )}px` );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) ) / 2}px` );

                break;

            case 'bottom':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) ) / 2}px` );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) )}px` );

                break;

            case 'left':

                element.style.setProperty ( 'margin-left', '0px' );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) ) / 2}px` );

                break;

            case 'center':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) ) / 2}px` );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) ) / 2}px` );

                break;
        }
    }

    insertHtmlContent ( windowId );
}

////////        UI Listeners        ////////

document.getElementById ( 'clear-canvas' ).addEventListener ( "click", function ( )
{
    clearCanvas ( );
});

document.getElementById ( 'about' ).addEventListener ( "click", function ( )
{
    showWindow ( 'about' );
});