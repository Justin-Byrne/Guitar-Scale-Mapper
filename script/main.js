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
        width:    window.innerWidth  - 18,
        height:   window.innerHeight -  4,
        xCenter: (window.innerWidth  /  2),
        yCenter: (window.innerHeight /  2),
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
        Updated:   'September, 17 2022',
        Version:   '1.3.23',
        Copyright: 'Copyright (c) 2022 Justin Don Byrne'
    }
}

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
    ]
}

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
    maxFrets:       12,
    maxStrings:      6,
    maxFingerspan:   4,
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

let settings = 
{
    tuning: { },
    scale:
    {
        type:  { },
        tonic: null,
        notes: [ ]
    },
    middleNote: 'B',
    mode: 
    {
        no:   0,
        root: undefined,
        fret: 
        {
            start: undefined,
            end:   undefined
        },
        nextMode: undefined,
        notes:    [ [], [], [], [], [] ]
    }
};

settings.tuning      = tone.tuning.standard;
// settings.scale.type  = tone.scale.major;
settings.scale.type  = tone.scale.blues.pentatonic;
settings.scale.tonic = 'E';

////////                            Debug Output                                            ////////

// font.load ( ).then ( function ( ) { document.fonts.add ( font ); } );

console.clear ( );

console.log ( 'configuration: ', config );
console.log ( 'Window Width:',   config.domWindow.width, 'Height:', config.domWindow.height );

//---   binding of resize()   ---//
window.addEventListener ( 'resize', setupEnvironment );
window.addEventListener ( 'load',   setupEnvironment );

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            PROTOTYPE FUNCTIONS                                     ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * containsArray()          {Array:Method}              Validates whether the tonic array contains the passed array passed.
 * @param                   {array} val                 Array sequence to validate
 * @return                  {boolean}                   True | False
 */
Array.prototype.containsArray   = function(val) 
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
 * pushPop()                {Array:Method}              Pushes or splices the value passed via the val param
 * @param                   {number} val                Value to be pushed or spliced
 */
Array.prototype.pushPop         = function(val)
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
Number.prototype.convert2digStr = function()
{
    return (this < 10) ? `0${this}` : `${this}`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERAL FUNCTIONS                                       ////////
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

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    drawFretboard ( 'cells' );

        settings.scale.notes = setScale ( );

    mapOpenNotes ( );

    mapFretboardNotes ( );

        console.dir ( fretboard.notes );

    drawFretboardFrets ( );

    displayNoteMarkers ( );

    displayFretboardNotes ( { octave: false, interval: false, string: false, fret: false } );

    displayFretNumbers ( );

        settings.mode = mapModes ( );

    // drawModeFingering ( 0 );
    
    drawModeOutlines ( 0 );

    // insertUIElements();
}

/**
 * getNote()                {Method}                    Get a single (open) note, with regards to the instruments current tuning
 * @param                   {Object} tuning             Tuning for the specific note being defined
 * @return                  {Object}                    Note with additional property values
 */
function getNote ( tuning )
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
 * getNextNote()            {Method}                    Returns the next note 
 * @param                   {boolean} cell              Cell value for the initial note; used to generate secondary note
 * @return                  {Object}                    Note with additional property values
 */
function getNextNote ( cell )
{
    let indexes =
    {
        note:  undefined,
        scale: undefined
    }
    
    let result = 
    { 
        note:     undefined, 
        octave:   undefined,
        interval: undefined,
        details: 
        {
            cell:     undefined,
            display:  undefined
        }
    };

    let initialNote   = fretboard.notes[ ( cell - 1 ) ].note;

        indexes.note  = ( tone.notes.indexOf ( initialNote ) == 11 )       
                            ? 0
                            : tone.notes.indexOf ( initialNote ) + 1;

        indexes.scale = settings.scale.notes.indexOf ( tone.notes[indexes.note] );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        result.note            = tone.notes[indexes.note];                      // NOTE

        result.octave          = ( initialNote == settings.middleNote )         // OCTAVE
                                     ? fretboard.notes[ ( cell - 1 ) ].octave + 1
                                     : fretboard.notes[ ( cell - 1 ) ].octave;

        result.interval        = ( indexes.scale != -1 )                        // INTERVAL
                                     ? settings.scale.notes.indexOf ( result.note ) + 1
                                     : null;
    
        result.details.cell    = cell;                                          // CELL

        result.details.display = ( indexes.scale != -1 )                        // DISPLAY
                                     ? true
                                     : false;

    return result;
}

/**
 * setScale()               {Method}                    Set scale notes, to be used through desired scale
 * @param                   {Array}  type               Scale array from 'tone' Object
 * @param                   {[type]} tonic              Generated scale
 */
function setScale ( tonic = settings.scale.tonic, type = settings.scale.type )
{
    let index   = tone.notes.indexOfArray ( tonic );

    let scale    = Array();

        scale[0] = tone.notes[index];                       // Set: tonic note

    // Circle around scale array if at the end
    for ( let i = 1, j = 0; i <= type.length; i++, j++ )
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

/**
 * mapOpenNotes()      {Method}                    Generate open notes for fretboard
 * @param                   {Array} tuning              Tuning array from 'tone' Object
 */
function mapOpenNotes ( )
{
    let cell = undefined;

    settings.tuning.reverse ( );    // Invert tuning to ensure low notes match with lower array index values

    for ( let i = 0; i < fretboard.maxStrings; i++ )
    {
        cell = ( i * fretboard.maxFrets ) + i;

        fretboard.notes[cell]                = getNote ( settings.tuning[i] );
        fretboard.notes[cell].details.cell   = cell;
        fretboard.notes[cell].details.fret   = 0;
        fretboard.notes[cell].details.string = ( i + 1 );
    }
}

/**
 * mapFretboardNotes() {Method}                    Generate fret notes for fretboard
 */
function mapFretboardNotes ( )
{
    let cell = 0;

    for ( let i = 0; i < fretboard.maxStrings; i++ )                            // Horizontal cells
    {
        for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ )                  // Vertical cells
        {
            let x = fretboard.partition.width * j + ( fretboard.partition.width  / 2 );                                // Horizontal
            let y = ( fretboard.size.height   - fretboard.partition.height * 1.5 ) - fretboard.partition.height * i;   // Vertical

            if ( cell % ( fretboard.maxFrets + 1 ) == 0 )
            {
                fretboard.notes[cell].details.x = x;
                fretboard.notes[cell].details.y = y;

                cell++;

                continue;
            }

            fretboard.notes[cell]                = getNextNote ( cell );
            fretboard.notes[cell].details.fret   = j;
            fretboard.notes[cell].details.string = ( i + 1 );
            fretboard.notes[cell].details.x      = x;
            fretboard.notes[cell].details.y      = y;

            cell++;
        }
    }
}

/**
 * mapModes()               {Method}                Map all available modes
 * @return                  {Object}                Mapped modes
 */
function mapModes ( )
{
    let mode          = settings.mode;
        mode.no       = 0;
        mode.nextMode = ( settings.scale.notes.length * 2 ) + 2;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    FUNCTIONS    ///////////////////////////////////////////////////////////////////////////

    /**
     * getNextModeNote()        {Method}                Generates the next note via the interval param
     * @param                   {number} interval       Current interval, used to identify the next note; in the mode
     * @return                  {Object}                Next not and interval
     */
    function getNextModeNote ( interval )
    {
        let result = 
        {
            note:     undefined,
            interval: undefined
        }

            result.interval = ( ( interval + 1 ) > settings.scale.notes.length )
                                  ? 1
                                  : ( interval + 1 );

            result.note     = settings.scale.notes[ ( result.interval - 1 ) ];

        return result;
    }

    /**
     * getDistance()            {Method}                Get the graphical distance between two notes
     * @param                   {Object} root           Root note to compare to the next note
     * @param                   {Object} next           Next note to compare to the root note
     * @return                  {number}                Distance
     */
    function getDistance ( root, next )
    {
        return ( root.details.x - next.details.x ) * ( root.details.x - next.details.x ) +
               ( root.details.y - next.details.y ) * ( root.details.y - next.details.y );
    }

    /**
     * getShortestDistance()    {Method}                Return which value is closest to the root note
     * @param                   {Object} root           Root note to compare against
     * @param                   {Object} noteA          First Note to compare to the root note
     * @param                   {Object} noteB          Second note to compare to the root note
     * @return                  {number}                Value representing which note ( noteA || noteB ) is closest; to the root note
     */
    function getShortestDistance ( root, noteA, noteB )
    {
        let distanceA = getDistance ( root, noteA );
        let distanceB = getDistance ( root, noteB );

        return ( distanceA < distanceB ) ? 1 : 2;
    }

    /**
     * getLastNote()            {Method}                Gets the last active note within the current scale; on the fretboard
     * @return                  {Object}                Last active note on the fretboard
     */
    function getLastNote ( )
    {
        let result   = undefined;

        let lastCell = fretboard.notes.length - 1;

        do                                                                                              // Set: last note
        {
            if ( fretboard.notes[lastCell].details.display )
            {
                result = fretboard.notes[lastCell];
            }

            lastCell--;
        }
        while ( result == undefined );

        return result;
    }

    ////    FUNCTIONS    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    let lastNote = getLastNote ( );

    for ( let i = 0; i < fretboard.notes.length; i++ )
    {
        let noteCurrent = fretboard.notes[i];

        if ( noteCurrent.details.cell == lastNote.details.cell )                                    // If: current note is the last note, break !
        {
            mode.notes[mode.no].push ( noteCurrent );                                               // Set: last available note

            break;
        }

        if ( mode.root == undefined && noteCurrent.note == settings.scale.notes[mode.no] )          // Set: current 'root' of mode
        {
            mode.root       = noteCurrent;
            mode.fret.start = noteCurrent.details.fret;
            mode.fret.end   = noteCurrent.details.fret + fretboard.maxFingerspan;
        }
        
        let noteNext = getNextModeNote ( noteCurrent.interval );                                    // Get: next note
        let index    = noteCurrent.details.cell + 1;
        let search   = Array ( );

        do                                                                                          // Get: closest note
        {
            if ( noteNext.note == fretboard.notes[index].note && noteNext.interval == fretboard.notes[index].interval )
            {
                let note = fretboard.notes[index];

                if ( note.details.string <= ( noteCurrent.details.string + 1 ) && ( note.details.fret + 1 ) >= mode.fret.start )
                {
                    search.push ( note );
                }
            }

            if ( search.length > 1 )                                                                // If: more than 1 in 'search', find closest note
            {
                ( getShortestDistance ( mode.root, search[0], search[1] ) == 1 )
                    ? search.pop   ( )
                    : search.shift ( );
            }

            index++;
        } 
        while ( index < fretboard.notes.length );

            mode.notes[mode.no].push ( noteCurrent );                                               // Set: next mode note, within current mode

            i = search[0].details.cell - 1;

        if ( mode.notes[mode.no].length == mode.nextMode )                                          // If: current mode is full with its notes
        {
            i = mode.notes[mode.no][1].details.cell - 1;                                            // Set: index to next root for next mode

            mode.root = undefined;
            mode.no++;
        }
    }

    return mode;
}

/**
 * drawModeFingering()      {Method}                Draws lines between each mode's fingering
 * @param                   {number} modeNo         Mode(s) to display
 */
function drawModeFingering ( modeNo )
{
    let modeOutline = settings.mode.notes;
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
    let modeOutline = settings.mode.notes;
    let increment   = 1;
    let start       = modeNo - 1;

    if ( modeNo == 0 )
    {
        start  = 0;
        modeNo = modeOutline.length;
    }

    if ( true )                                                                                     // Right side
    {
        for ( let i = start; i < modeNo; i++ )                  
        {
            for ( let j = 0, increment = 1; j < ( modeOutline[i].length - 1 ); j = j + increment )
            {
                if ( j > 0 )
                {
                    increment = 2;
                }

                drawLine ( 
                    modeOutline[i][      j      ].details.x,                    // xStart
                    modeOutline[i][j + increment].details.x,                    // xEnd
                    modeOutline[i][      j      ].details.y,                    // yStart
                    modeOutline[i][j + increment].details.y,                    // yEnd
                    10,                                                         // lineWidth
                    colors.boxes[i],                                            // strokeColor
                    1                                                           // strokeAlpha
                );
            }
        }
    }

    if ( true )                                                                                     // Left side
    {
        for ( let i = start; i < modeNo; i++ )                  
        {
            for ( let j = 0, increment = 2; j < ( modeOutline[i].length - 1 ); j = j + 2 )
            {
               drawLine ( 
                    modeOutline[i][      j      ].details.x,                    // xStart
                    modeOutline[i][j + increment].details.x,                    // xEnd
                    modeOutline[i][      j      ].details.y,                    // yStart
                    modeOutline[i][j + increment].details.y,                    // yEnd
                    10,                                                         // lineWidth
                    colors.boxes[i],                                            // strokeColor
                    1                                                           // strokeAlpha
                );
    
                if ( j >= ( modeOutline[i].length - 4 ) )
                {
                     increment = 1;
                }
            }
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
function toggleCheckbox ( id, check = null )
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
function drawRectangle ( x, y, width, height, stroke = { color: '255, 255, 255', alpha: 1, width: 3 }, fill = { color: '255, 255, 255', alpha: 0 } )
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
                    fretboard.partition.height * i,         // yEnd
                    undefined,                              // stroke
                    undefined                               // fill
                );
            }

            // Vertical lines
            for ( let i = 0; i < ( fretboard.maxFrets + 1 ); i++ )                 
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

            // Horizontal cells
            for ( let i = 0; i < fretboard.maxStrings; i++ )
            {
                // Vertical cells
                for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ ) 
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

    for ( let i = 0; i < fretboard.maxStrings; i++ )                            // Horizontal cells
    {
        for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ )                  // Vertical cells
        {
            if ( fretboard.notes[index].note == undefined ) 
            { 
                continue;
            }

            for ( let i = 0; i < conditions.length; i++ )
            {
                if ( fretboard.notes[index].interval == conditions[i] ) 
                { 
                    color.fill = '255, 255, 255';  

                    break; 
                }

                color.fill = colors.tone[fretboard.notes[index].interval];
            }

            if ( fretboard.notes[index].details.display )                       // Check: display property
            {   
                let radius = ( fretboard.partition.height / 2 ) - 5;

                drawCircle (
                    fretboard.notes[index].details.x,       // x
                    fretboard.notes[index].details.y,       // y
                    radius,                                 // radius
                    undefined,                              // angle
                    {
                        color: color.stroke,                // stroke.color
                        alpha: 1                            // stroke.alpha
                    },
                    {
                        color: color.fill,                  // fill.color
                        alpha: 1                            // fill.alpha
                    }
                );
            }

                index++;
        }
    }
}

/**
 * displayFretboardNotes()  {Method}                    Displays notes on the fretboard
 * @param                   {boolean} showOctave        Determine whether to display octaves on the fretboard
 */
function displayFretboardNotes ( show = { octave: false, interval: false, string: false, fret: false } )
{
    let index = 0;

    for ( let i = 0; i < fretboard.maxStrings; i++ )                            // Horizontal cells
    {
        for ( let j = 0; j < ( fretboard.maxFrets + 1 ); j++ )                  // Vertical cells
        {
            let offset = 4;

            if ( fretboard.notes[index].note == undefined ) { continue; }

            let text   = fretboard.notes[index].note;

            if ( show.octave )
            {
                text  += `${fretboard.notes[index].octave}`;
            }

            if ( show.interval )
            {
                text  += ` (${fretboard.notes[index].interval})`;
            }

            if ( show.string )
            {
                text  += `{${fretboard.notes[index].details.string}}`;
            }

            if ( show.fret )
            {
                text  += ` - ${fretboard.notes[index].details.fret}`;
            }

                offset = ( index == 0 ) ? offset : 0;

            if ( fretboard.notes[index].details.display )
            {
                displayText (
                    fretboard.notes[index].details.x - offset,                  // x
                    fretboard.notes[index].details.y,                           // y
                    `${text}`,                                                  // text
                    undefined,
                    fretboard.partition.width,                                  // width
                    // colors.octave[fretboard.notes[index].octave]                // color
                );

                
            }

                index++;
        }
    }
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
            `${i}`,                                                                                 // text
            fretboard.partition.width,                                                              // width
            '255, 255, 255'                                                                         // color
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