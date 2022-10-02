"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL CONSTANTS                                        ////////
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
    canvas:   document.getElementById("canvas"),
    context:  document.getElementById("canvas").getContext("2d"),
    canvas2:  document.getElementById("canvas-underlay"),
    context2: document.getElementById("canvas-underlay").getContext("2d"),
    domWindow: 
    {
        width:     window.innerWidth  - 18,
        height:    window.innerHeight -  4,
        xCenter: ( window.innerWidth  /  2 ),
        yCenter: ( window.innerHeight /  2 )
    },
    debug:          false,
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
                width: 5            //  1 - .... - 5
            },
            fill:
            {
                type:  4,           // [1] empty, [2] solid
                color: 0            //  1 - ............................. - 11
            }
        },
        rectangle:
        {
            line:
            {
                type:  1,           // [1] solid, [2] dashed
                width: 1            //  1 - .... - 5
            }
        }
    },
    about: 
    {
        Author:    'Justin Don Byrne',
        Created:   'January, 5 2022',
        Library:   'Guitar Scale Mapper',
        Updated:    undefined,
        Version:    undefined,
        Copyright: 'Copyright (c) 2022 Justin Don Byrne'
    }
}

config.about.Updated = 'October, 26 2022';
config.about.Version = '1.4.43';

const colors =
{
    main:
    [
        '0,     0,   0',            // BLACK                                    // 0
        '255, 255, 255',            // WHITE                                    // 1
        '52,   53,  52',            // JET                  BACKGROUND          // 2
        '184, 185, 187',            // GRAY                 FOREGROUND          // 3
    ],
    boxes:
    [
        '199,  57,  54',            // RED                  BOX COLOR (1)       // 0
        '245, 233,  92',            // YELLOW               BOX COLOR (2)       // 1
        '92,  167,  84',            // GREEN                BOX COLOR (3)       // 2
        '0,   167, 211',            // BLUE                 BOX COLOR (4)       // 3
        '181,  70, 130',            // PINK                 BOX COLOR (5)       // 4
    ],
    tone:
    [
        '184, 185, 187',            // GRAY                 FOREGROUND          // 0
        '108, 179, 223',            // CAROLINA BLUE        TONIC               // 1
         undefined,                                                             // 2
        '168, 150, 197',            // LAVENDER PURPLE      3RD                 // 3
         undefined,                                                             // 4
        '223, 140, 155',            // PALE RED VIOLET      5TH                 // 5
         undefined,                                                             // 6
         undefined                                                              // 7
    ],
    octave:
    [
         undefined,                                                             // 0
         undefined,                                                             // 1
        '243, 176,  62',            // YELLOW ORANGE        OCTAVE 2            // 2
        '113, 192, 250',            // MAYA BLUE            OCTAVE 3            // 3
        '165, 246, 106',            // INCHWORM             OCTAVE 4            // 4
        '241, 155, 200',            // PASTEL MAGENTA       OCTAVE 5            // 5
        '253, 239, 113'             // YELLO (CRAYOLA)      OCTAVE 6            // 6
    ],
    name:
    {
        black:  '0,     0,   0',
        white:  '255, 255, 255',
        jet:    '52,   53,  52',
        gray:   '184, 185, 187',
        red:    '199,  57,  54',            
        yellow: '245, 233,  92',            
        green:  '92,  167,  84',            
        blue:   '0,   167, 211',            
        pink:   '181,  70, 130'
    }
}

const mouse = 
{
    coord:   { start: null, end: null },
    current: { x: null, y: null },
    down:    false,
    existingLineIndex: -1
}

////////                            GLOBAL CONSTANTS (INSTRUMENT SPECIFIC)                  ////////

const settings = 
{
    tuning: { },
    scale:
    {
        type:  { },
        tonic: null,
        notes: [ ]
    },
    middleNote:    'B',
    maxFrets:      24,
    maxStrings:    6,
    maxFingerspan: 4
};

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
        width:  document.getElementById('fretboard').clientWidth  / ( settings.maxFrets   + 1 ),
        height: document.getElementById('fretboard').clientHeight / ( settings.maxStrings + 1 )
    },
    fingering: 
    {
        notes:  [ ]
    },
    maxFrets:      settings.maxFrets,
    maxStrings:    settings.maxStrings,
    maxFingerspan: settings.maxFingerspan,
    notes:         
    {
        full:    [ ],
        clean:   [ ],
        strings: [ ],
        modes:   [ ]
    }
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
            {   // 6
                note :   'E',            
                octave :  4
            },
            {   // 5
                note :   'B',            
                octave :  3
            },
            {   // 4
                note :   'G',            
                octave :  3
            },
            {   // 3
                note :   'D',            
                octave :  3
            },
            {   // 2
                note :   'A',            
                octave :  2
            },
            {   // 1
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
        ],
        blues : 
        {
            pentatonic :
            [
                3,  // 0
                2,  // 1
                2,  // 2
                3,  // 3
            ]
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL VARIABLES                                        ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

settings.tuning      = tone.tuning.standard;
settings.scale.type  = tone.scale.major;
// settings.scale.type  = tone.scale.blues.pentatonic;
settings.scale.tonic = 'E';

////////                            Debug Output                                            ////////

console.clear ( );

console.log ( 'configuration: ', config );
console.log ( 'Window Width:  ', config.domWindow.width, 'Height:', config.domWindow.height );

//---   binding of resize()   ---//
window.addEventListener ( 'resize', main );
window.addEventListener ( 'load',   main );

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            PROTOTYPE FUNCTIONS                                     ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * indexOfArray()           {Array:Method}              Returns the index of the array values (e.g.: [1, 2]) passed
 * @param                   {array} val                 Array sequence to validate
 * @return                  {number}                    Integer representing the index where the passed array matches 
 */
Array.prototype.indexOfArray    = function(val) 
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
 * convert2digStr()         {Number:Method}             Converts the casted value into a two digit string
 * @return                  {string}                    Two digit string
 */
Number.prototype.convert2digStr = function()
{
    return (this < 10) ? `0${this}` : `${this}`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            MAIN                                                    ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function main ( )
{
    ////    INIT       /////////////////////////////////////

    setupEnvironment ( );

    settings.scale.notes = generateScale ( );

    ////    MAP        /////////////////////////////////////

    mapOpenNotes      ( );

    mapFretboardNotes ( );

    fretboard.notes.modes = mapModes ( );

    ////    DRAW       /////////////////////////////////////

    drawFretboard      ( 'cells' );

    drawFretboardFrets ( );

    ////    DISPLAY    /////////////////////////////////////

    displayNoteMarkers ( );

    let display = 
    { 
        octave:   false, 
        interval: false, 
        string:   false, 
        fret:     false 
    };

    displayFretboardNotes ( display );

    displayFretNumbers    ( );

    ////    DRAW       /////////////////////////////////////

    drawModeOutlines  ( 1 );

    // insertUIElements();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            INITIALIZING FUNCTIONS                                  ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * setupEnvironment()       {Method}                    Sets up the initial UI environment
 */
function setupEnvironment ( )
{
    document.getElementById ( "canvas" ).width           = `${fretboard.size.width}`;
    document.getElementById ( "canvas" ).height          = `${fretboard.size.height}`;

    document.getElementById ( "canvas-underlay" ).width  = `${fretboard.size.width}`;
    document.getElementById ( "canvas-underlay" ).height = `${fretboard.size.height}`;

    document.getElementById ( "ui-overlay" ).style.setProperty ( 'width',  `${fretboard.size.width}px`  );
    document.getElementById ( "ui-overlay" ).style.setProperty ( 'height', `${fretboard.size.height}px` );

    document.title = config.about.Library + ' | ver: ' + config.about.Version;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERIC GRAPHIC FUNCTIONS                               ////////
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
function drawRectangle ( x, y, width, height, stroke = { color: '255, 255, 255', alpha: 1, width: 4 }, fill = { color: '255, 255, 255', alpha: 0 } )
{
    config.context.beginPath();

    config.context.rect(x, y, width, height);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    config.context.strokeStyle = `rgba(${stroke.color}, ${stroke.alpha})`;

    config.context.lineWidth   = stroke.width;

    config.context.stroke();

    config.context.fillStyle   = `rgba(${fill.color}, ${fill.alpha})`;

    config.context.fill();
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
function drawCircle ( x, y, radius, angle = { start: 0, end: 2 * Math.PI }, stroke = { color: '255, 255, 255', alpha: 1 }, fill = { color: '255, 255, 255', alpha: 0 } ) 
{
    config.context.beginPath ( );
    
    config.context.arc (
        x, 
        y, 
        radius, 
        angle.start, 
        angle.end, 
        false                       // Counter Clockwise
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    config.context.strokeStyle = `rgba(${stroke.color}, ${stroke.alpha})`;

    config.context.lineWidth   = config.settings.circle.line.width;

    config.context.stroke ( );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    config.context.fillStyle   = `rgba(${fill.color}, ${fill.alpha})`;

    config.context.fill ( );
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
function displayText ( x, y, text, fontSize = 24, maxWidth, color = '0, 0, 0' )
{
    let textWidth = config.context.measureText ( text ).width;

        config.context.fillStyle = `rgb(${color})`;

        config.context.font      = `normal ${fontSize}px Roboto`;

        config.context.fillText ( text, x - ( textWidth / 1.85 ), y + ( fontSize / 3.5 ), maxWidth );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            INTERFACE FUNCTIONS                                     ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * toggleCheckbox()         {Method}                    Toggles whether the passed input[type='checkbox'] is checked; or not
 * @param                   {string}  id                The input element's id
 * @param                   {boolean} check             Overrides toggle to either 'on' or 'off'
 */
function toggleCheckbox ( id, check = null )
{
    (check == null)
        ? document.getElementById(id).checked = (document.getElementById(id).checked) 
            ? false 
            : true
        : document.getElementById(id).checked = check;    
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            CREATION FUNCTIONS                                      ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * generateNextNote()       {Method}                    Generates the next note 
 * @param                   {boolean} cell              Cell value for the initial note; used to generate secondary note
 * @return                  {Object}                    Note with additional property values
 */
function generateNextNote ( index )
{
    let result = 
    { 
        note:     undefined,
        octave:   undefined,
        interval: undefined,
        details: 
        {
            cell:     undefined,
            string:   undefined,
            fret:     undefined,
            display:  undefined,
            coordinates: 
            {
                x: undefined,
                y: undefined
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    ///     FUNCTIONS   ////////////////////////////////////////////////////////

    function getInterval ( note )
    {
        let noteIndex = settings.scale.notes.indexOf ( note.note );
    
        return ( noteIndex != -1 )                                             
                   ? settings.scale.notes.indexOf ( note.note ) + 1
                   : null;
    }

    function getDisplay ( note )
    {
        let noteIndex = settings.scale.notes.indexOf ( note.note );
        
        return ( noteIndex != -1 ) ? true : false;
    }

    function getString ( note )
    {
        let value = index / ( fretboard.maxFrets + 1 );

        for ( let i = 1; i < fretboard.maxStrings + 1; i++ )                                        
        {
            if ( value < i ) 
            { 
                return i;
            }
        }
    }

    function getCoordinates ( note )
    {
        let x = fretboard.partition.width  * ( note.details.fret ) + ( fretboard.partition.width  / 2 );                    // Horizontal
        let y = fretboard.partition.height * ( note.details.string - 1 ) - ( fretboard.size.height - fretboard.partition.height * 1.5 );    // Vertical
            y = - ( y );

        return { x, y };
    }

    ///     FUNCTIONS   ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    if ( fretboard.notes.full[index] != undefined )
    {
        let note = fretboard.notes.full[index];

            note.details.coordinates = getCoordinates ( note );

        result = note;
    }
    else
    {
        let notePrevious = fretboard.notes.full[ ( index - 1 ) ];

        let noteIndex    = ( tone.notes.indexOf ( notePrevious.note ) == tone.notes.length - 1 )       
                               ? 0
                               : tone.notes.indexOf ( notePrevious.note ) + 1;
        
        ///  CORE  /////////////////////////////////////////

            result.note     = tone.notes[noteIndex];

            result.interval = getInterval ( result );

            result.octave   = ( notePrevious == settings.middleNote )
                                  ? notePrevious.octave + 1
                                  : notePrevious.octave;

        ///  DETAILS  //////////////////////////////////////

            result.details.cell        = index;

            result.details.string      = getString ( result );

            result.details.fret        = index - ( ( fretboard.maxFrets + 1 ) * ( result.details.string - 1 ) );

            result.details.display     = getDisplay ( result );

            result.details.coordinates = getCoordinates ( result );
    }

    return result;
}

/**
 * generateNote()           {Method}                    Get a single (open) note, with regards to the instruments current tuning
 * @param                   {Object} tuning             Tuning for the specific note being defined
 * @return                  {Object}                    Note with additional property values
 */
function generateNote ( tuning )
{
    let noteIndex = settings.scale.notes.indexOf ( tuning.note );

    let result =
    { 
        note:     undefined, 
        octave:   undefined,
        interval: undefined,
        details:
        {
            cell:     undefined,
            string:   undefined,
            fret:     undefined,
            display:  undefined
        }
    };

        result.note            = tuning.note;                                   // NOTE

        result.octave          = tuning.octave;                                 // OCTAVE

        result.interval        = ( noteIndex != -1 )                            // INTERVAL
                                     ? noteIndex + 1
                                     : null;

        result.details.display = ( noteIndex != -1 )                            // DISPLAY
                                     ? true 
                                     : false;

    return result;
}

/**
 * generateScale()          {Method}                    Set scale notes, to be used through desired scale
 * @param                   {Array}  type               Scale array from 'tone' Object
 * @param                   {[type]} tonic              Generated scale
 */
function generateScale ( tonic = settings.scale.tonic, type = settings.scale.type )
{
    let index    = tone.notes.indexOfArray ( tonic );

    let scale    = Array ( );

        scale[0] = tone.notes[index];                       // Set: tonic note
    
    for ( let i = 1, j = 0; i <= type.length; i++, j++ )    // Circle around scale array if at the end
    {
        switch ( index + type[j] )
        {
            case 12:  index = 0;  break;  // 1
            case 13:  index = 1;  break;  // 2
            case 14:  index = 2;  break;  // 3
            case 15:  index = 3;  break;  // 3

            default:
                
                index = index + type[j];  

                break;
        }

        scale[i] = tone.notes[index];                       // Set: each subsequent note
    }

    return scale;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            MAPPING FUNCTIONS                                       ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * mapOpenNotes()           {Method}                    Generate open notes for fretboard
 * @param                   {Array} tuning              Tuning array from 'tone' Object
 */
function mapOpenNotes ( )
{
    let note  = undefined;
    let cell  = undefined;
    let index = undefined;

    settings.tuning.reverse ( );    // Invert tuning to ensure low notes match with lower array index values

    for ( let i = 0; i < fretboard.maxStrings; i++ )
    {
        cell = ( i * fretboard.maxFrets ) + i;

        note                 = generateNote ( settings.tuning[i] );
        note.details.cell    = cell;
        note.details.string  = ( i + 1 );
        note.details.fret    = 0;
        note.details.display = ( settings.scale.notes.indexOf ( note.note ) != -1 )
                                   ? true
                                   : false;

        fretboard.notes.full[cell] = note;
    }
}

/**
 * mapFretboardNotes()      {Method}                    Generate fret notes for fretboard
 */
function mapFretboardNotes ( )
{
    let note = undefined;
    let cell = 0;

    ////////////////////////////////////////////////////////////////////////////
    ///     FUNCTIONS   ////////////////////////////////////////////////////////

    function parseFull2Clean ( )
    {
        let cell = 0;

        do
        {
            let note = fretboard.notes.full[cell];

            if ( note.details.display )
            {
                fretboard.notes.clean.push ( note );
            }

            cell++;
        }
        while ( cell < fretboard.notes.full.length );
    }

    function parseFull2Strings ( )
    {
        let cell = 0;

        for ( let i = 0; i < fretboard.maxStrings; i++ )
        {
            fretboard.notes.strings.push ( new Array ( ) );
        }    

        do
        {
            let note = fretboard.notes.clean[cell];

            fretboard.notes.strings[note.details.string - 1].push ( note );

            cell++;
        }
        while ( cell < fretboard.notes.clean.length );
    }

    ///     FUNCTIONS   ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    let max = fretboard.maxStrings * ( fretboard.maxFrets + 1 )

    do
    {
        fretboard.notes.full[cell] = generateNextNote ( cell );

        cell++;
    }
    while ( cell < max );

    ////////////////////////////////
    ///  CLEAN UP //////////////////

    parseFull2Clean   ( );
    parseFull2Strings ( );
}

/**
 * mapModes()               {Method}                Map all available modes
 * @return                  {Object}                Mapped modes
 */
function mapModes ( )
{
    let result    = Array ( );
    let mode      = Array ( );
    let strings   = fretboard.notes.strings;
    let modeIndex = 0;
    let modeMax   = settings.scale.notes.length;
    
    let finalFret = undefined;

    ////////////////////////////////////////////////////////////////////////////
    ///     FUNCTIONS   ////////////////////////////////////////////////////////
    
    function setStartingNotes ( modeIndex )
    {
        let index   = 0;

        do
        {  
            mode.push ( new Array ( strings[index][modeIndex] ) );

            index++;
        }
        while ( index < fretboard.maxStrings );
    }

    function bundleMode ( )
    {
        let result = Array ( );

        mode.forEach ( ( element ) => 
        {
            element.forEach ( ( element ) => 
            {
                result.push ( element );
            });
        } );

        mode.length = 0;            // Reset: mode array

        return result;
    }

    function getBoundingBox ( )
    {
        let result = [ mode[0][0].details.fret - 1, 0 ];

        for ( let i = 0; i < mode.length; i++ )
        {
            for ( let j = 0; j < mode[i].length; j++ )
            {
                if ( mode[i][j].details.fret > result[1] )
                {
                    result[1] = mode[i][j].details.fret;
                }
            }
        }

        return result;
    }

    function getNoteIndexFromString ( note, string )
    {
        let result = undefined;

        for ( let j = 0; j < string.length; j++ )
        {
            if ( string[j].note == note.note )
            {
                result = j;

                break;
            }
        }

        return result;
    }

    ///     FUNCTIONS   ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    let cycle = 0;
    let run   = true;

    do
    {
        setStartingNotes ( modeIndex );

        do
        {
            modeGeneration:
            for ( let i = 0; i < mode.length; i++ )
            {
                let root       = mode[i][mode[i].length - 1];

                let nextIndex  = strings[i].indexOf ( root ) + 1;

                let next       = strings[i][nextIndex];

                let nextString = ( root.details.string < fretboard.maxStrings ) 
                                     ? root.details.string
                                     : 0;

                let nextNext   = mode[nextString][0];

                ////////////////////////////////////////////////////////////////////////////////////

                if ( root.details.string == fretboard.maxStrings )
                {
                    finalFret = mode[0][mode[0].length - 1].details.fret;
                }

                if ( next.note != nextNext.note && root.details.fret != fretboard.maxStrings )
                {
                    if ( root.details.fret == finalFret && root.details.string == fretboard.maxStrings )    // END OF MODE !!!
                    {
                        run = false;

                        break;
                    }

                    let searchIndex = getNoteIndexFromString ( next, strings[nextString] );

                    for ( let j = searchIndex; j >= 0; j-- )
                    {
                        let note = strings[nextString][j];
                        let box  = getBoundingBox ( );

                        if ( note.note == next.note && note.details.fret >= box[0] && note.details.fret <= box[1] - 1 )
                        {
                            mode[nextString].unshift ( note );
                            
                            continue modeGeneration;
                        }
                    }

                    mode[i].push ( next );
                }
                else
                {
                    continue;
                }
            }

            cycle++;
        }
        while ( run && cycle < 4 );

        result.push ( bundleMode ( ) );

        // RESET
        finalFret = undefined;
        cycle     = 0;
        run       = true;
        
        modeIndex++;    
    }
    while ( modeIndex < 3 );        // modeMax goes here once complete

    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            DISPLAY FUNCTIONS                                       ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * displayNoteMarkers()     {Method}                    Display note markers
 * @param                   {string} type               Type of note marker to display
 */
function displayNoteMarkers ( type = 'circle' )
{
    let index = 0; 

    let color = 
    { 
        stroke: colors.main[3], 
        fill:   null 
    }

    let conditions = [ 2, 4, 6, 7 ];                        // notes without color indexes

    do
    {
        for ( let i = 0; i < conditions.length; i++ )
        {
            if ( fretboard.notes.clean[index].interval == conditions[i] ) 
            { 
                color.fill = '255, 255, 255';  

                break; 
            }

            color.fill = colors.tone[fretboard.notes.clean[index].interval];
        }

        let radius = ( fretboard.partition.height / 2 ) - 5;

        drawCircle (
            fretboard.notes.clean[index].details.coordinates.x,                 // x
            fretboard.notes.clean[index].details.coordinates.y,                 // y
            radius,                                                             // radius
            undefined,                                                          // angle
            {
                color: color.stroke,                                            // stroke.color
                alpha: 1                                                        // stroke.alpha
            },
            {
                color: color.fill,                                              // fill.color
                alpha: 1                                                        // fill.alpha
            }
        );

        index++;
    }
    while ( index < fretboard.notes.clean.length );
}

/**
 * displayFretboardNotes()  {Method}                    Displays notes on the fretboard
 * @param                   {boolean} showOctave        Determine whether to display octaves on the fretboard
 */
function displayFretboardNotes ( show = { octave: false, interval: false, string: false, fret: false } )
{
    let index = 0;

    do
    {
        let offset = 4;

        let text   = fretboard.notes.clean[index].note;

        if ( show.octave )
        {
            text  += `${fretboard.notes.clean[index].octave}`;
        }

        if ( show.interval )
        {
            text  += ` (${fretboard.notes.clean[index].interval})`;
        }

        if ( show.string )
        {
            text  += `{${fretboard.notes.clean[index].details.string}}`;
        }

        if ( show.fret )
        {
            text  += ` - ${fretboard.notes.clean[index].details.fret}`;
        }

            offset = ( index == 0 ) ? offset : 0;

        displayText (
            fretboard.notes.clean[index].details.coordinates.x - offset,        // x
            fretboard.notes.clean[index].details.coordinates.y,                 // y
            `${text}`,                                                          // text
            undefined,
            fretboard.partition.width,                                          // width
            // colors.octave[fretboard.notes.clean[index].octave]                   // color
        );

            index++;
    }
    while ( index < fretboard.notes.clean.length );
}

/**
 * displayFretNumbers()     {Method}                    Displays fret numbers at the bottom of the fretboard
 */
function displayFretNumbers ( )
{
    for ( let i = 0; i < ( fretboard.maxFrets + 1 ); i++ )
    {
        displayText (
            fretboard.partition.width * i + ( fretboard.partition.width  / 2 ),                     // x
            fretboard.size.height         - ( fretboard.partition.height / 2 ),                     // y
            i,                                                                                      // text
            undefined,                                                                              // fontSize
            fretboard.partition.width,                                                              // maxWidth
            '255, 255, 255'                                                                         // color
        );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            DRAWING FUNCTIONS                                       ////////
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

            for ( let i = 0; i < fretboard.maxStrings; i++ )                                        // Horizontal lines
            {
                drawLine ( 
                    0,                                      // xStart
                    fretboard.size.width,                   // xEnd
                    fretboard.partition.height * i,         // yStart
                    fretboard.partition.height * i,         // yEnd
                    undefined,                              // stroke
                    undefined                               // fill
                );
            }

            for ( let i = 0; i < ( fretboard.maxFrets + 1 ); i++ )                                  // Vertical lines
            {
                drawLine ( 
                    fretboard.partition.width * i,          // xStart
                    fretboard.partition.width * i,          // xEnd
                    0,                                      // yStart
                    fretboard.size.height,                  // xStart
                    undefined,                              // stroke
                    undefined                               // fill
                );
            }

            break;

        case 'cells':

            let cell = 0;

            for ( let i = 0; i < fretboard.maxStrings; i++ )                                        // Horizontal cells
            {
                for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ )                              // Vertical cells
                {
                    if ( cell % ( fretboard.maxFrets + 1 ) == 0 )
                    {
                        cell++;

                        continue;
                    }

                    drawRectangle ( 
                        fretboard.partition.width  * j,     // x
                        fretboard.partition.height * i,     // y
                        fretboard.partition.width,          // width
                        fretboard.partition.height,         // height
                        undefined,                          // stroke
                        undefined                           // fill
                    );

                    cell++;
                }
            }

            break;
    }
}

/**
 * drawFretboardFrets()     {Method}                    Draws thicker frets across fretboard
 * @param                   {Array}  frets              Frets to add thicker frets
 * @param                   {String} color              Color of the fret drawn
 */
function drawFretboardFrets ( frets = [ 12 ], color = '170, 170, 170' )
{
    let nut       = 1;
    let thickness = 5;

    for ( let i = 1; i < ( fretboard.maxFrets + 1 ); i++ )                                          // Vertical lines
    {
        for ( let j = 0; j < frets.length; j++ )                                                    // Horizontal Lines
        {
            if ( i == frets[j] || i == nut )
            {
                drawLine ( 
                    fretboard.partition.width * i,                              // xStart
                    fretboard.partition.width * i,                              // xEnd
                    0,                                                          // yStart
                    fretboard.size.height - fretboard.partition.height,         // yEnd
                    thickness,                                                  // lineWidth
                    color,                                                      // stroke
                    undefined                                                   // fill
                );

                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

                drawLine ( 
                    fretboard.partition.width * i - ( thickness - 2 ),          // xStart
                    fretboard.partition.width * i - ( thickness - 2 ),          // xEnd
                    3,                                                          // yStart
                    fretboard.size.height - fretboard.partition.height - 2,     // yEnd
                    2,                                                          // lineWidth
                    colors.main[1],                                             // stroke
                    undefined                                                   // fill
                );

                drawLine ( 
                    fretboard.partition.width * i + ( thickness - 2 ),          // xStart
                    fretboard.partition.width * i + ( thickness - 2 ),          // xEnd
                    3,                                                          // yStart
                    fretboard.size.height - fretboard.partition.height - 2,     // yEnd
                    1,                                                          // lineWidth
                    colors.main[0],                                             // stroke
                    undefined                                                   // fill
                );
            }
        }
    }
}

/**
 * drawFingerBoundingBox()  {Method}                    Draws a bounding box for fingering optimization
 * @param                   {number} start              Fret to start at
 */
function drawFingerBoundingBox ( start )
{
    let alpha = 0.1;

    for ( let i = start; i < fretboard.maxFingerspan; i++ )
    {        
        drawRectangle ( 
            fretboard.partition.width  * i,                                     // x
            0,                                                                  // y
            fretboard.partition.width,                                          // width
            fretboard.partition.height * fretboard.maxStrings,                  // height
            {
                color: colors.name.yellow,                                      // stroke.color
                alpha: 1,                                                       // stroke.alpha
                width: 3                                                        // stroke.width
            },                               
            {
                color: colors.name.yellow,                                      // fill.color
                alpha: alpha,                                                   // fill.alpha
            }
        );

        alpha += 0.1;
    }
}

/**
 * drawFingering()          {Method}                Draws lines between each mode's fingering
 * @param                   {number} modeNo         Mode(s) to display
 */
function drawFingering ( modeNo )
{
    let modeOutline = fretboard.fingering.notes;
    let start       = modeNo - 1;

    if ( modeNo == 0 )
    {
        start  = 0;
        modeNo = modeOutline.length;
    }

    for ( let i = start; i < modeNo; i++ )
    {
        for ( let j = 0; j < ( modeOutline[i].length - 1 ); j++ )
        {
            drawLine ( 
                modeOutline[i][  j  ].details.x,                                // xStart
                modeOutline[i][j + 1].details.x,                                // xEnd
                modeOutline[i][  j  ].details.y,                                // yStart
                modeOutline[i][j + 1].details.y,                                // yEnd
                10,                                                             // lineWidth
                colors.boxes[i],                                                // strokeColor
                1                                                               // strokeAlpha
            );
        }
    }
}

/**
 * drawModeOutlines()       {Method}                Draws lines around each mode's fingering
 * @param                   {number} modeNo         Mode(s) to display
 */
function drawModeOutlines ( modeNo )
{
    let modeOutline = fretboard.notes.modes;
    let increment   = 1;
    let start       = modeNo - 1;

    if ( modeNo == 0 )
    {
        start  = 0;
        modeNo = modeOutline.length;
    }

    let temp = 
    [ 
        [],     // Left  side
        []      // Right side
    ];

    let index =
    {
        left:  undefined,
        right: undefined
    }

        temp[0].push ( modeOutline[start][0] );             // Set: initial starting note
        temp[1].push ( modeOutline[start][0] );             // Set: initial starting note

    for ( let i = start; i < modeNo; i++ )                                                          // Identify parameter
    {
        for ( let j = 1; j < modeOutline[i].length; j++ )
        {
                index.left  = temp[0].length - 1;
                index.right = temp[1].length - 1;

            if ( modeOutline[i][j].details.string > temp[0][index.left].details.string )
            {
                temp[0].push ( modeOutline[i][  j  ] );
                temp[1].push ( modeOutline[i][j - 1] );
            }
            
            if ( j == modeOutline[i].length - 1 )
            {
                temp[0].push ( modeOutline[i][j] );
                temp[1].push ( modeOutline[i][j] );
            }
        }      
    }

    for ( let i = 0; i < temp.length; i++ )                                                         // Draw parameter
    {
        for ( let j = 0; j < ( temp[i].length - 1 ); j++ )
        {
            drawLine ( 
                temp[i][  j  ].details.coordinates.x,                           // xStart
                temp[i][j + 1].details.coordinates.x,                           // xEnd
                temp[i][  j  ].details.coordinates.y,                           // yStart
                temp[i][j + 1].details.coordinates.y,                           // yEnd
                10,                                                             // lineWidth
                colors.boxes[start],                                            // strokeColor
                1                                                               // strokeAlpha
            );
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERIC UI ALGORITHMS                                   ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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