"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GLOBAL CONSTANTS                ////////////////////////////////////////////////////////////

    /**
     * app                      {Object}                    Object literal variables
     * @var                     {boolean}                   Debug settings
     * @var                     {Object} dom                Primary DOM elements
     * @var                     {Object} windows            Application window properties
     * @var                     {Object} mouse              Application data for the mouse
     * @var                     {Object} settings           Application default settings
     * @var                     {Object} tone               Default note & scale settings
     * @var                     {Object} post               Post processing data
     * @var                     {Object} colors             Application default color settings
     * @var                     {Object} about              Application details
     */
    ( ( window ) =>
    {
        let _colors =
        {
            main:
            [
                '0,     0,   0',    // BLACK                                    // 0
                '255, 255, 255',    // WHITE                                    // 1
                '52,   53,  52',    // JET                  BACKGROUND          // 2
                '184, 185, 187',    // GRAY                 FOREGROUND          // 3
            ],
            line:
            [
                '255,   0, 230',    // PURPLE                                   // 0
                '255,   0,  30',    // RED                                      // 1
                '255,  90,   0',    // ORANGE                                   // 2
                '255, 230,  60',    // YELLOW                                   // 3
                '60,  255,   0',    // GREEN                                    // 4
                '0,   150, 255',    // BLUELIGHT                                // 5
                '30,   60, 255'     // BLUEDARK                                 // 6
            ],
            interval:
            [
                '184, 185, 187',    // GRAY                 FOREGROUND          // 0
                '255,   0, 235',    // PURPLE               TONIC               // 1
                 undefined,                                                     // 2
                '53,  162, 255',    // BLUE                 3RD                 // 3
                 undefined,                                                     // 4
                '0,   255, 208',    // GREEN                5TH                 // 5
                 undefined,                                                     // 6
                '255,  94,   0',    // ORANGE               7TH                 // 8
            ],
            octave:
            [
                 undefined,                                                     // 0
                 undefined,                                                     // 1
                '243, 176,  62',    // YELLOW ORANGE        OCTAVE 2            // 2
                '113, 192, 250',    // MAYA BLUE            OCTAVE 3            // 3
                '165, 246, 106',    // INCHWORM             OCTAVE 4            // 4
                '241, 155, 200',    // PASTEL MAGENTA       OCTAVE 5            // 5
                '253, 239, 113'     // YELLO (CRAYOLA)      OCTAVE 6            // 6
            ],
            name:
            {
                black:  '0,     0,   0',                                        // 0
                white:  '255, 255, 255',                                        // 1
                jet:    '52,   53,  52',                                        // 2
                gray:   '184, 185, 187',                                        // 3
                red:    '199,  57,  54',                                        // 4
                yellow: '245, 233,  92',                                        // 5
                green:  '92,  167,  84',                                        // 6
                blue:   '0,   167, 211',                                        // 7
                pink:   '181,  70, 130'                                         // 8
            }
        }

        function configurations ( )
        {
            let _app =
            {
                debug: false,
                dom:
                {
                    canvases:  { },
                    contexts:  { },
                    window:
                    {
                        width:     window.innerWidth  - 18,
                        height:    window.innerHeight -  4,
                        xCenter: ( window.innerWidth  /  2 ),
                        yCenter: ( window.innerHeight /  2 )
                    },
                    main:
                    {
                        canvas:  undefined,
                        context: undefined
                    }
                },
                windows:
                {
                    about: false
                },
                mouse:
                {
                    start:  undefined,
                    end:    undefined,
                    down:   false,
                    extant: -1,
                    offset: { x: 0, y: 0 }
                },
                settings: undefined,
                tone:     undefined,
                post:     undefined,
                colors:   { },
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

                _app.colors = _colors;

            return _app;
        }

        if ( typeof ( window.app ) === 'undefined' )

            window.app = configurations ( );

    } ) ( window );

    app.about.Updated = 'November, 29 2022';
    app.about.Version = '0.7.97';

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DEBUG OUTPUT                    ////////////////////////////////////////////////////////////

    console.clear ( );

    console.log ( 'configuration: ', app );

    console.log ( 'Window Width:  ', app.dom.window.width, 'Height:', app.dom.window.height );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    BINDINGS                        ////////////////////////////////////////////////////////////

    document.addEventListener ( "DOMContentLoaded", setDom ( ) );

      window.addEventListener ( 'resize', main );

      window.addEventListener ( 'load',   main );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    PROTOTYPE FUNCTIONS             ////////////////////////////////////////////////////////////

    /**
     * toTitleCase()            {String:Method}             Returns a title case string
     * @return                  {string}                    Title case string
     */
    String.prototype.toTitleCase = function ( )
    {
        return this.toLowerCase ( ).split ( ' ' ).map ( function ( word )
        {
            return ( word.charAt ( 0 ).toUpperCase( ) + word.slice( 1 ) );
        }).join ( ' ' );
    }

    /**
     * countChar()              {String:Method}             Returns count of character passed via param
     * @param                   {string} value              Character to count
     * @return                  {number}                    Count of character within string
     */
    String.prototype.countChar   = function ( value )
    {
        let count = 0, i = this.length - 1;

        while ( i >= 0 )
        {
            if ( this.charAt ( i ) == value ) count++;

            i--;
        }

        return count;
    }

    /**
     * splitValue()             {String:Method}             Returns the original string split by the delimiter passed
     * @param                   {type} delimiter            Delimiter to split the string by
     * @return                  {Array}                     Array of the split string
     */
    String.prototype.splitValue  = function ( delimiter )
    {
        return ( this.includes ( delimiter ) )
                   ? this.split ( delimiter )
                   : undefined;
    }

    /**
     * convertToElements()      {String:Method}             Returns an element node list for the DOM
     * @return                  {Object}                    Element node list
     */
    String.prototype.convertToElements = function ( )
    {
        let temp = document.createElement ( 'div' );

            temp.innerHTML = this;

        return temp.childNodes;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    MAIN                            ////////////////////////////////////////////////////////////

    function main ( )
    {
        ////    INIT    ////////////////////////////////////////////////////////

        musicNote.setScale ( );

        musicNote.setFingeringNotes ( );

        ////    DRAW    ////////////////////////////////////////////////////////

        drawFretboard      ( );

        drawFretboardFrets ( );

        ////    DISPLAY     ////////////////////////////////////////////////////

        displayScaleNotes  ( );

        displayNoteMarkers ( );

        displayFretNumbers ( );

        ////    SAVE    ////////////////////////////////////////////////////////

        canvasSave ( 'canvas' );                                   // TODO: SEND TO musicNote.lib.js
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    SETTERS ( GENERIC )             ////////////////////////////////////////////////////////////

    /**
     * setStrokeType()          {Method}                    description
     * @param                   {number} type               description
     * @param                   {Array}  segments           description
     */
    const setStrokeType = ( type, segments = [ 15, 15 ], context = app.dom.main.context ) => ( type ) ? context.setLineDash ( segments ) : context.setLineDash ( [ ] );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    SETTERS ( CUSTOM )              ////////////////////////////////////////////////////////////

    /**
     * setDom()                 {Method}                    Set DOM elements properties prior to drawing
     */
    function setDom ( )
    {
        musicNote.init ( 'canvas' );

        let flyout =
        {
            width:  document.querySelector ( ".flyout-nav ul" ).clientWidth,
            height: document.querySelector ( ".flyout-nav ul" ).clientHeight
        }

        let canvas =
        {
            width:  fingering.size.width,
            height: fingering.size.height
        }

        let canvasScale =
        {
            width:  window.innerWidth - ( flyout.width * 1.25 ),
            height: fingering.partition.height * 2.15
        }

        let controlWrapper =
        {
            marginTop: ( canvasScale.height + canvas.height ),
            height:      window.innerHeight - canvas.height - canvasScale.height - 15
        }

        ////////////////////////////////////////////////////////////////////////
        ////    HEIGHT x WIDTH      ////////////////////////////////////////////

            document.getElementById ( "canvas" ).width          = canvas.width;
            document.getElementById ( "canvas" ).height         = canvas.height;

            document.getElementById ( "ui-overlay" ).width      = canvas.width;
            document.getElementById ( "ui-overlay" ).height     = canvas.height

            document.getElementById ( "canvas-scale" ).width    = canvasScale.width;
            document.getElementById ( "canvas-scale" ).height   = canvasScale.height;

            document.getElementById ( "controls" ).style.height = `${controlWrapper.height}px`;

        ////////////////////////////////////////////////////////////////////////
        ////    MARGINS     ////////////////////////////////////////////////////

            document.getElementById ( "canvas-scale" ).style.marginLeft   = `${flyout.width}px`;

            document.getElementById ( "fingering" ).style.marginTop       = `${canvasScale.height}px`;
            document.getElementById ( "fingering" ).style.marginLeft      = `40px`;

            document.getElementById ( "control-wrapper" ).style.marginTop = `${controlWrapper.marginTop}px`;

        ////////////////////////////////////////////////////////////////////////
        ////    ANCILLARY   ////////////////////////////////////////////////////

            document.title = app.about.Library + ' | ver: ' + app.about.Version;

            if ( app.debug ) requireJS ( "script/unitTests.js" );
    };

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GETTERS ( GENERIC )             ////////////////////////////////////////////////////////////

    const getRgb  = ( color )                         => `rgb(${color})`;

    const getRgba = ( color, alpha )                  => `rgba(${color}, ${alpha})`;

    const getFont = ( name, size, weight = 'normal' ) => `${weight} ${size}px ${name}`;

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GRAPHIC FUNCTIONS ( GENERIC )   ////////////////////////////////////////////////////////////

    /**
     * displayShadow()          {Method}                    Sets & displays shadow under shape
     * @param                   {string} color              RGB number set for fill; r, g, b
     * @param                   {number} alpha              Alpha (transparency) number value
     * @param                   {number} blur               Blur
     * @param                   {Object} offset             Blur offset
     * @param                   {number} offset.x           X shadow offset
     * @param                   {number} offset.y           Y shadow offset
     * @param                   {Object} context            2D canvas context
     */
    const displayShadow = ( color = '0, 0, 0', alpha = 1, blur = 3, offset = { x: 3, y: 3 }, context = app.dom.main.context ) => [ context.shadowColor, context.shadowBlur, context.shadowOffsetX, context.shadowOffsetY ] =  [ getRgba ( color, alpha ), blur, offset.x, offset.y ]

    /**
     * postLineProcessing ( )   {Method}                    description
     */
    function postLineProcessing ( )
    {
        let checks =
        {
            coordinates: undefined,
            stroke:      undefined,
            shadow:      undefined,
            context:     undefined
        }

        const line =
        {
            coordinates: { xStart: arguments [ 0 ] [ 0 ], xEnd: arguments [ 0 ] [ 1 ], yStart: arguments [ 0 ] [ 2 ], yEnd: arguments [ 0 ] [ 3 ] },
            stroke:      arguments [ 0 ] [ 4 ],
            shadow:      arguments [ 0 ] [ 5 ],
            context:     arguments [ 0 ] [ 6 ]
        }

        ////////////////////////////////////////////////////////////////////////

        app.post.line.prior = line;
    }

    /**
     * drawLine()               {Method}                    Draws a simple circle
     * @param                   {number}  xStart            X position start
     * @param                   {number}  xEnd              X position end
     * @param                   {number}  yStart            Y position start
     * @param                   {number}  yEnd              Y position end
     * @param                   {Object}  stroke            Stroke object containing stoke properties
     * @param                   {number}  stroke.type       Stroke type; 1 (solid) | 2 (dashed)
     * @param                   {string}  stroke.color      Stroke RGB number set for fill; r, g, b
     * @param                   {decimal} stroke.alpha      Stroke alpha (transparency) number value
     * @param                   {decimal} stroke.width      Strokes width
     * @param                   {Object}  context           2D canvas context
     */
    function drawLine ( xStart, xEnd, yStart, yEnd, stroke = { type: 0, color: '0, 0, 0', alpha: 1, width: 1 }, shadow = false, context = app.dom.main.context )
    {
        ( shadow ) ? displayShadow ( ) : null;

        context.strokeStyle = getRgb ( stroke.color );

        context.globalAlpha = stroke.alpha;

        context.lineCap     = 'round';

        context.lineWidth   = stroke.width;

        ////////////////////////////////////////////////////////////////////////

        setStrokeType     ( stroke.type, undefined );

        context.beginPath ( );

        context.moveTo    ( xStart, yStart );

        context.lineTo    ( xEnd, yEnd );

        context.stroke    ( );

        ////////////////////////////////////////////////////////////////////////

        ( shadow ) ? context.shadowColor = 'transparent' : null;

        context.globalAlpha = 1;

        postLineProcessing ( arguments );
    }

    /**
     * drawLines()              {Method}                    Draws multiple lines sequentially
     * @param                   {Array}  lines              Array of lines
     * @param                   {Object} context            2D canvas context
     */
    function drawLines ( lines, context = app.dom.main.context )
    {
        let lastColor = undefined;

        let limit     = lines.length - 1;

        ////////////////////////////////////////////////////////////////////////
        ////    FUNCTIONS   ////////////////////////////////////////////////////

            function closeStroke ( )
            {
                context.closePath ( );

                context.stroke ( );
            }

            function beginStroke ( line )
            {
                context.beginPath ( );

                context.moveTo ( line.x, line.y );
            }

        ////    FUNCTIONS   ////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

            context.lineCap = 'round';

        for ( let i in lines )
        {
            if ( lastColor != lines [ i ].stroke.color && lastColor != undefined )

                closeStroke ( );

            context.strokeStyle = getRgb ( lines [ i ].stroke.color );

            context.globalAlpha = lines [ i ].stroke.alpha;

            context.lineWidth   = lines [ i ].stroke.width;

            ////////////////////////////////////////////////////////////////////

            setStrokeType ( lines [ i ].stroke.type );

            if ( lastColor != lines [ i ].stroke.color )
            {
                if ( beginStroke ( lines [ i ] ) )
                {
                    if ( limit != i )
                    {
                        context.lineTo ( lines [ i ].x, lines [ i ].y );
                    }
                    else
                    {
                        closeStroke ( );
                    }
                }
            }

            lastColor = lines [ i ].stroke.color;
        }

        context.globalAlpha = 1;
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
     * @param                   {decimal} stroke.width      Strokes width
     * @param                   {Object}  fill              Fill object containing fill properties
     * @param                   {string}  fill.color        Fill RGB number set for fill; r, g, b
     * @param                   {decimal} fill.alpha        Fill alpha (transparency) number value
     * @param                   {Object}  context           2D canvas context
     */
    function drawRectangle ( x, y, width, height, stroke = { color: '255, 255, 255', alpha: 1, width: 4 }, fill = { color: '255, 255, 255', alpha: 0 }, context = app.dom.main.context )
    {
        context.strokeStyle = getRgba ( stroke.color, stroke.alpha );

        context.fillStyle   = getRgba (   fill.color,   fill.alpha );

        context.lineWidth   = stroke.width;

        ////////////////////////////////////////////////////////////////////////

        context.beginPath ( );

        context.rect      ( x, y, width, height );

        context.stroke    ( );

        context.fill      ( );
    }

    /**
     * drawCircle()             {Method}                    Draws a simple circle
     * @param                   {number}  x                 X - axis; center
     * @param                   {number}  y                 Y - axis; center
     * @param                   {number}  radius            Circle radius
     * @param                   {Object}  angle             Angle object containing angle properties
     * @param                   {number}  angle.start       Start angle
     * @param                   {number}  angle.end         End angle
     * @param                   {Object}  stroke            Stroke object containing stroke properties
     * @param                   {string}  stroke.color      Stroke RGB number set for fill; r, g, b
     * @param                   {decimal} stroke.alpha      Stroke alpha (transparency) number value
     * @param                   {decimal} stroke.width      Strokes width
     * @param                   {Object}  fill              Fill object containing fill properties
     * @param                   {string}  fill.color        Fill RGB number set for fill; r, g, b
     * @param                   {decimal} fill.alpha        Fill alpha (transparency) number value
     * @param                   {boolean} centerDot         Include a center dot
     * @param                   {Object}  context           2D canvas context
     */
    function drawCircle ( x, y, radius, angle = { start: 0, end: 2 * Math.PI }, stroke = { color: '255, 255, 255', alpha: 1, width: 6 }, fill = { color: '255, 255, 255', alpha: 0 }, context = app.dom.main.context )
    {
        context.strokeStyle = getRgba ( stroke.color, stroke.alpha );

        context.fillStyle   = getRgba (   fill.color,   fill.alpha );

        context.lineWidth   = stroke.width;

        ////////////////////////////////////////////////////////////////////////

        context.beginPath ( );

        context.arc       ( x, y, radius, angle.start, angle.end, false );

        context.stroke    ( );

        context.fill      ( );
    }

    /**
     * displayText()            {Method}                    Display text
     * @param                   {number}  x                 X - position
     * @param                   {number}  y                 Y - position
     * @param                   {string}  text              Test to display
     * @param                   {number}  fontSize          Font size
     * @param                   {number}  maxWidth          Maximum width of text area
     * @param                   {string}  color             Fill RGB number set for fill; r, g, b
     * @param                   {decimal} alpha             Fill alpha (transparency) number value
     * @param                   {Object}  context           2D canvas context
     */
    function displayText ( x, y, text, fontSize = 24, maxWidth, color = '0, 0, 0', alpha = 1, context = app.dom.main.context )
    {
        context.font        = getFont ( 'Roboto', fontSize );

        context.fillStyle   = getRgb  ( color );

        context.globalAlpha = alpha;

        x = x - ( context.measureText ( text ).width / 1.85 );

        y = y + ( fontSize / 3.5 );

        ////////////////////////////////////////////////////////////////////////

        context.fillText ( text, x, y, maxWidth );

        context.globalAlpha = 1;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GRAPHIC FUNCTIONS ( CUSTOM )    ////////////////////////////////////////////////////////////

    // TODO: SEND TO musicNote.lib.js

    /**
     * clearCanvas()            {Method}                    Clears the entire canvas element
     * @param                   {string} canvasId           Canvas element identifier
     */
    const clearCanvas = ( canvasId ) => app.dom.contexts [ canvasId ].clearRect ( 0, 0, app.dom.canvases [ canvasId ].width, app.dom.canvases [ canvasId ].height );

    /**
     * canvasSave()             {Method}                    Saves the canvas to the canvas state variable
     * @param                   {string} canvasId           Canvas element identifier
     */
    const canvasSave  = ( canvasId ) => { app.post.canvas.state = app.dom.canvases [ canvasId ].toDataURL ( ); }

    /**
     * showSavedState()         {Method}                    Clears the canvas, and replaces it with an image; from param
     * @param                   {string} canvasId           Canvas element identifier
     */
    function showSavedState ( canvasId )
    {
        clearCanvas ( canvasId );

        if ( document.getElementById ( 'saved-state' ) == null )
        {
            let element = document.createElement ( 'img' );

                [ element.src, element.id, element.style ] = [ app.post.canvas.state, 'saved-state', 'position: absolute' ];

                document.getElementById ( canvasId ).parentNode.insertBefore ( element, document.getElementById ( canvasId ).nextElementSibling );
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DRAWING FUNCTIONS               ////////////////////////////////////////////////////////////

    /**
     * drawFretboard()          {Method}                    Draws fretboard using HTML5 canvas API calls
     */
    function drawFretboard ( )
    {
        let cell    = 0;

        let strings = app.settings.maxStrings;

        let frets   = app.settings.maxFrets + 1;

        for ( let i = 0; i < strings; i++ )                 // Horizontal cells
        {
            for ( let j = 0; j < frets; j++ )               // Vertical cells
            {
                cell++;

                if ( cell % frets == true ) continue;

                drawRectangle ( fingering.partition.width  * j, fingering.partition.height * i, fingering.partition.width, fingering.partition.height );
            }
        }
    }

    /**
     * drawFretboardFrets()     {Method}                    Draws thicker frets across fretboard
     * @param                   {Array}  frets              Frets locations to add
     * @param                   {string} color              Color of the fret drawn
     * @param                   {number} lineWidth          Width of the fret drawn
     */
    function drawFretboardFrets ( frets = [ 1, 12, 24 ], color = '170, 170, 170', lineWidth = 5 )
    {
        for ( let fret of frets )
        {
            let x      = ( fingering.partition.width * fret );

            let y      = ( fingering.size.height   - fingering.partition.height ) - 3;

            let offset = ( lineWidth - 3 );

            ////////////////////////////////////////////////////////////////////

            drawLine (              // FRET
                x,                                          // xStart
                x,                                          // xEnd
                0,                                          // yStart
                y,                                          // yEnd
                {
                    type: 0,                                // stroke.type
                    color: color,                           // stroke.color
                    alpha: undefined,                       // stroke.alpha
                    width: lineWidth                        // stroke.width
                }
            );

            drawLine (              // Light
                x - offset,                                 // xStart
                x - offset,                                 // xEnd
                2,                                          // yStart
                y,                                          // yEnd
                {
                    type: 0,                                // stroke.type
                    color: app.colors.name.white,           // stroke.color
                    alpha: undefined,                       // stroke.alpha
                    width: offset                           // stroke.width
                }
            );

            drawLine (              // Shadow
                x + offset,                                 // xStart
                x + offset,                                 // xEnd
                2,                                          // yStart
                y,                                          // yEnd
                {
                    type: 0,                                // stroke.type
                    color: app.colors.name.black,           // stroke.color
                    alpha: undefined,                       // stroke.alpha
                    width: offset                           // stroke.width
                }
            );
        }
    }

    /**
     * drawFretboardShapes()    {Method}                    Draws fretboard shapes
     * @param                   {boolean} shadow            whether to display shadows under saved shapes
     */
    function drawFretboardShapes ( shadow = true )
    {
        let start = undefined;

        let end   = undefined;

        musicNote.setLineShadow ( shadow );

        for ( let line of fingering.lines )

            drawLine ( line.start.x, line.end.x, line.start.y, line.end.y, line.stroke, true );
    }

    // let redrawCanvas =
    // {
    //     'canvas':
    //     [
    //         drawFretboard,
    //         drawFretboardFrets,
    //         displayNoteMarkers,
    //         displayFretNumbers
    //     ],
    //     'canvas-scale':
    //     [
    //         displayScaleNotes
    //     ]
    // }

    // function redraw ( canvasId = 'canvas' )
    // {
    //     clearCanvas ( canvasId );

    //     for ( let func of app.post.redraw[ canvasId ] )

    //         func ( );

    //     canvasSave ( canvasId );
    // }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DISPLAY FUNCTIONS               ////////////////////////////////////////////////////////////

    /**
     * displayScaleNotes()      {Method}                    Displays the scale's notes on the instrument's board
     * @param                   {string} canvasId           Canvas element identifier to display scale notes
     */
    function displayScaleNotes ( scale = app.settings.scale.notes, canvasId = 'canvas-scale' )
    {
        let index  = app.tone.notes.indexOf ( scale[0] );

        let offset = 15;

        for ( let note in app.tone.notes )
        {
            let object = new Object ( );

                object.note        = app.tone.notes [ index ];

                object.interval    = musicNote.getIntervalFromNote ( object.note );

                object.display     = musicNote.getDisplayFromNote  ( object.note );

                object.partition   = app.dom.canvases [ canvasId ].width / app.tone.notes.length;

                object.radius      = ( object.partition / 2 ) - offset;

                object.fill        = musicNote.getIntervalColor ( object );

                object.alpha       = musicNote.getIntervalAlpha ( object );

                object.coordinates = {
                                        x: ( object.partition * note ) + object.radius + offset,
                                        y: ( object.partition - ( offset * 2 ) )
                                     };

                ////////////////////////////////////////////////////////////////

                drawCircle (
                    object.coordinates.x,                   // x
                    object.coordinates.y,                   // y
                    object.radius,                          // radius
                    undefined,
                    {
                        color: app.colors.name.black,       // stroke.color
                        alpha: object.alpha,                // stroke.alpha
                        width: 6                            // stroke.width
                    },
                    {
                        color: object.fill,                 // fill.color
                        alpha: object.alpha                 // fill.alpha
                    },
                    app.dom.contexts [ canvasId ]           // context
                );

                displayText (
                    object.coordinates.x,                   // x
                    object.coordinates.y,                   // y
                    object.note,                            // text
                    24,                                     // fontSize
                    object.partition,                       // maxWidth
                    undefined,                              // color
                    object.alpha,                           // alpha
                    app.dom.contexts [ canvasId ]           // context
                );

                index = ( index == ( app.tone.notes.length - 1 ) ) ? 0 : index + 1;
        }
    }

    /**
     * displayNoteMarkers()     {Method}                    Display note markers throughout the instrument's board
     */
    function displayNoteMarkers ( )
    {
        for ( let note of fingering.notes )
        {
            let color = musicNote.getIntervalColor ( note );
            let alpha = musicNote.getIntervalAlpha ( note );

            drawCircle (
                note.coordinates.x,                         // x
                note.coordinates.y,                         // y
                ( fingering.partition.height / 2 ) - 5,     // radius
                undefined,                                  // angle
                {
                    color: app.colors.name.black,           // stroke.color
                    alpha: alpha,                           // stroke.alpha
                    width: 5                                // stroke.width
                },
                {
                    color: color,                           // fill.color
                    alpha: alpha                            // fill.alpha
                }
            );

            displayText (
                note.coordinates.x,                         // x
                note.coordinates.y,                         // y
                note.note,                                  // text
                undefined,                                  // fontSize
                fingering.partition.width,                  // maxWidth
                undefined,                                  // color
                alpha                                       // alpha
            );
        }
    }

    /**
     * displayFretNumbers()     {Method}                    Displays fret numbers at the bottom of the instrument's board
     */
    function displayFretNumbers ( )
    {
        for ( let i = 0; i < ( app.settings.maxFrets + 1 ); i++ )
        {
            displayText (
                fingering.partition.width * i + ( fingering.partition.width  / 2 ),                 // x
                fingering.size.height         - ( fingering.partition.height / 2 ),                 // y
                i,                                                                                  // text
                undefined,                                                                          // fontSize
                fingering.partition.width,                                                          // maxWidth
                '255, 255, 255'                                                                     // color
            );
        }
    }
