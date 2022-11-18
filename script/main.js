"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GLOBAL CONSTANTS                ////////////////////////////////////////////////////////////

    /**
     * config                   {Object}                    Object literal variables
     * @var                     {boolean}                   Debug settings
     * @var                     {Object} dom                Primary DOM elements
     * @var                     {Object} windows            Application window properties
     * @var                     {Object} mouse              Application data for the mouse
     * @var                     {Object} settings           Application default settings  [DEPRECATING]
     * @var                     {Object} tone               Default note & scale settings [DEPRECATING]
     * @var                     {Object} colors             Application default color settings
     * @var                     {Object} about              Application details
     */
    const config = 
    {
        debug: false,
        dom:
        {
            canvases:  [ ],
            contexts:  [ ],
            saveState: undefined,
            window: 
            {
                width:     window.innerWidth  - 18,
                height:    window.innerHeight -  4,
                xCenter: ( window.innerWidth  /  2 ),
                yCenter: ( window.innerHeight /  2 )
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
        settings:
        {
            tuning: { },
            scale:
            {
                type:  { },
                tonic: undefined,
                notes: [ ]
            },
            maxFrets:   24,
            maxStrings: 6,
        },
        tone:
        {
            notes: [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ],
            tuning:
            {
                standard:
                [ 
                    { note: 'E', octave: 4 },
                    { note: 'B', octave: 3 },
                    { note: 'G', octave: 3 },
                    { note: 'D', octave: 3 },
                    { note: 'A', octave: 2 },
                    { note: 'E', octave: 2 }
                ],
                dropD:
                [ 
                    { note: 'E', octave: 4 },
                    { note: 'B', octave: 3 },
                    { note: 'G', octave: 3 },
                    { note: 'D', octave: 3 },
                    { note: 'A', octave: 2 },
                    { note: 'D', octave: 2 }
                ],
                dStandard:
                [ 
                    { note: 'D', octave: 4 },
                    { note: 'A', octave: 3 },
                    { note: 'F', octave: 3 },
                    { note: 'C', octave: 3 },
                    { note: 'G', octave: 2 },
                    { note: 'D', octave: 2 }
                ],
                dropC:
                [ 
                    { note: 'D', octave: 4 },
                    { note: 'A', octave: 3 },
                    { note: 'F', octave: 3 },
                    { note: 'C', octave: 3 },
                    { note: 'G', octave: 2 },
                    { note: 'C', octave: 2 }
                ]
            },
            scale: 
            {
                common:
                {
                    major:                          [ 2, 2, 1, 2, 2, 2 ],
                    harmonic_minor:                 [ 2, 1, 2, 2, 1, 3 ],
                    melodic_minor:                  [ 2, 1, 2, 2, 2, 2 ],
                    natural_minor:                  [ 2, 1, 2, 2, 1, 2 ],
                    pentatonic_major:               [ 2, 2, 3, 2 ],
                    pentatonic_minor:               [ 3, 2, 2, 3 ],
                    pentatonic_blues:               [ 3, 2, 1, 1, 3 ],
                    pentatonic_neutral:             [ 2, 3, 2, 3, 2 ],
                    ionian:                         [ 2, 2, 1, 2, 2, 2 ],
                    dorian:                         [ 2, 1, 2, 2, 2, 1 ],
                    phrygian:                       [ 1, 2, 2, 2, 1, 2 ],
                    lydian:                         [ 2, 2, 1, 2 ],
                    mixolydian:                     [ 2, 2, 1, 2, 2, 1 ],
                    aeolian:                        [ 2, 1, 2, 2, 1, 2 ],
                    locrian:                        [ 1, 2, 2, 1, 2, 2 ],
                    diatonic:                       [ 2, 2, 3, 2 ],
                    diminished:                     [ 2, 1, 2, 1, 2, 1, 2 ],
                    diminished_half:                [ 1, 2, 1, 2, 1, 2, 1 ],
                    diminished_whole:               [ 2, 1, 2, 1, 2, 1, 2 ],
                    diminished_whole_tone:          [ 1, 2, 1, 2, 2, 2 ],
                    dominant_seventh:               [ 2, 2, 1, 2, 2, 1 ],
                    lydian_augmented:               [ 2, 2, 2, 2, 1, 2 ],
                    lydian_minor:                   [ 2, 2, 2, 1, 1, 2 ],
                    lydian_diminished:              [ 2, 1, 3, 1, 2, 2 ]
                },
                rare: 
                {
                    chromatic:                      [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                    whole_tone:                     [ 2, 2, 2, 2, 2 ],
                    octatonic_hw:                   [ 1, 2, 1, 2, 1, 2, 1 ],
                    octatonic_wh:                   [ 2, 1, 2, 1, 2, 1, 2 ],
                    augmented:                      [ 3, 1, 2, 2, 3 ],
                    auxiliary_diminished:           [ 2, 1, 2, 1, 2, 1, 2 ],
                    auxiliary_augmented:            [ 2, 2, 2, 2, 2 ],
                    auxiliary_diminished_blues:     [ 1, 2, 1, 2, 1, 2, 1 ],
                    blues:                          [ 3, 2, 1, 1, 3 ],
                    double_harmonic:                [ 1, 3, 1, 2, 1, 3 ],
                    enigmatic:                      [ 1, 3, 2, 2, 2, 1 ],
                    half_diminished:                [ 1, 2, 2, 1, 2, 2 ],
                    half_diminished_2:              [ 2, 1, 2, 1, 2, 2 ],
                    leading_whole_tone:             [ 2, 2, 2, 2, 2, 1 ],
                    major_locrian:                  [ 2, 2, 1, 1, 2, 2 ],
                    nine_tone_scale:                [ 2, 1, 1, 2, 1, 1, 1, 2 ],
                    overtone:                       [ 2, 2, 2, 1, 2, 1 ],
                    six_tone_symmetrical:           [ 1, 3, 1, 3, 1 ],
                    altered:                        [ 1, 2, 1, 2, 1, 1 ],
                    bebop_major:                    [ 2, 2, 1, 2, 1, 1, 2 ],
                    bebop_minor:                    [ 2, 1, 1, 1, 2, 2, 1 ],
                    bebop_dominant:                 [ 2, 2, 1, 2, 2, 1, 1 ],
                    bebop_half_diminished:          [ 1, 2, 2, 1, 1, 1, 3 ],
                    blues_1:                        [ 3, 2, 1, 1, 3, 1 ],
                    blues_2:                        [ 3, 1, 1, 1, 1, 3, 1 ],
                    blues_3:                        [ 3, 1, 1, 1, 1, 2, 1, 1 ],
                    major_blues_scale:              [ 2, 1, 1, 3, 2 ],
                    dominant_pentatonic:            [ 2, 2, 3, 3 ],
                    locrian_6:                      [ 1, 2, 2, 1, 3, 1 ],
                    ionian_5:                       [ 2, 2, 1, 3, 1, 2 ],
                    dorian_4:                       [ 2, 1, 3, 1, 2, 1 ],
                    phrygian_major:                 [ 1, 3, 1, 2, 1, 2 ],
                    lydian_2:                       [ 3, 1, 2, 1, 2, 2 ],
                    ultralocrian:                   [ 1, 2, 1, 2, 2, 1 ],
                    mixo_blues:                     [ 3, 1, 1, 1, 1, 3 ]
                },
                exotic: 
                {
                    algerian:                       [ 2, 1, 2, 1, 1, 1, 3 ],
                    arabian_1:                      [ 2, 1, 2, 1, 2, 1, 2 ],
                    arabian_2:                      [ 2, 2, 1, 1, 2, 2 ],
                    balinese:                       [ 1, 2, 4, 1 ],
                    byzantine:                      [ 1, 3, 1, 2, 1, 3 ],
                    chinese:                        [ 4, 2, 1, 4 ],
                    chinese_mongolian:              [ 2, 2, 3, 2, 3 ],
                    egyptian:                       [ 2, 3, 2, 3 ],
                    eight_tone_spanish:             [ 1, 2, 1, 1, 1, 2, 2 ],
                    ethiopian_araray:               [ 2, 2, 1, 2, 2, 2 ],
                    ethiopian_geeznezel:            [ 2, 1, 2, 2, 1, 2 ],
                    hawaiian:                       [ 2, 1, 2, 2, 2, 2 ],
                    hindu:                          [ 2, 2, 1, 2, 1, 2 ],
                    hirajoshi:                      [ 2, 1, 4, 1 ],
                    hungarian_major:                [ 2, 1, 2, 1, 2, 1 ],
                    hungarian_gypsy:                [ 2, 1, 3, 1, 1, 3 ],
                    hungarian_gypsy_persian:        [ 1, 3, 1, 2, 1, 3 ],
                    hungarian_minor:                [ 2, 1, 3, 1, 1, 3 ],
                    japanese_1:                     [ 1, 4, 2, 1 ],
                    japanese_2:                     [ 2, 3, 2, 1 ],
                    japanese_ichikosucho:           [ 2, 2, 1, 1, 1, 2, 2 ],
                    japanese_taishikicho:           [ 2, 2, 1, 1, 1, 2, 1, 1 ],
                    javaneese:                      [ 1, 2, 2, 2, 2, 1 ],
                    jewish_adonai_malakh:           [ 1, 1, 1, 2, 2, 2, 1 ],
                    jewish_ahaba_rabba:             [ 1, 3, 1, 2, 1, 2 ],
                    jewish_magen_abot:              [ 1, 2, 1, 2, 2, 2, 1 ],
                    kumoi:                          [ 2, 1, 4, 2 ],
                    mohammedan:                     [ 2, 1, 2, 2, 1, 3 ],
                    neopolitan:                     [ 1, 2, 2, 2, 1, 3 ],
                    neoploitan_major:               [ 1, 2, 2, 2, 2, 2 ],
                    neopolitan_minor:               [ 1, 2, 2, 2, 1, 2 ],
                    oriental_1:                     [ 1, 3, 1, 1, 2, 2 ],
                    oriental_2:                     [ 1, 3, 1, 1, 2, 1 ],
                    pelog:                          [ 1, 2, 4, 1 ],
                    persian:                        [ 1, 3, 1, 1, 2, 3 ],
                    prometheus:                     [ 2, 2, 2, 3, 1 ],
                    prometheus_neopolitan:          [ 1, 3, 2, 3, 1 ],
                    roumanian_minor:                [ 2, 1, 3, 1, 2, 1 ],
                    spanish_gypsy:                  [ 1, 3, 1, 2, 1, 2 ],
                    super_locrian:                  [ 1, 2, 1, 2, 2, 2 ],
                    chinese_2:                      [ 2, 3, 2, 2 ],
                    hirajoshi_2:                    [ 4, 1, 4, 2 ],
                    iwato:                          [ 1, 4, 1, 4 ],
                    japanese_in_sen:                [ 1, 4, 2, 3 ],
                    kumoi_2:                        [ 1, 4, 2, 1 ],
                    pelog_2:                        [ 1, 2, 4, 3 ],
                    moorish_phrygian:               [ 1, 2, 1, 1, 2, 1, 2, 1 ]
                }
            }   
        },
        colors:
        {
            main:
            [
                '0,     0,   0',        // BLACK                                    // 0
                '255, 255, 255',        // WHITE                                    // 1
                '52,   53,  52',        // JET                  BACKGROUND          // 2
                '184, 185, 187',        // GRAY                 FOREGROUND          // 3
            ],
            boxes:
            [
                '199,  57,  54',        // RED                  BOX COLOR (1)       // 0
                '245, 233,  92',        // YELLOW               BOX COLOR (2)       // 1
                '92,  167,  84',        // GREEN                BOX COLOR (3)       // 2
                '0,   167, 211',        // BLUE                 BOX COLOR (4)       // 3
                '181,  70, 130',        // PINK                 BOX COLOR (5)       // 4
            ],
            interval:
            [
                '184, 185, 187',        // GRAY                 FOREGROUND          // 0
                '255,   0, 235',        // PURPLE               TONIC               // 1
                 undefined,                                                         // 2
                '53,  162, 255',        // BLUE                 3RD                 // 3
                 undefined,                                                         // 4
                '0,   255, 208',        // GREEN                5TH                 // 5
                 undefined,                                                         // 6
                '255,  94,   0',        // ORANGE               7TH                 // 8
            ],
            octave:
            [
                 undefined,                                                         // 0
                 undefined,                                                         // 1
                '243, 176,  62',        // YELLOW ORANGE        OCTAVE 2            // 2
                '113, 192, 250',        // MAYA BLUE            OCTAVE 3            // 3
                '165, 246, 106',        // INCHWORM             OCTAVE 4            // 4
                '241, 155, 200',        // PASTEL MAGENTA       OCTAVE 5            // 5
                '253, 239, 113'         // YELLO (CRAYOLA)      OCTAVE 6            // 6
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

    config.settings.tuning      = config.tone.tuning.standard;
    config.settings.scale.type  = config.tone.scale.common.major;
    config.settings.scale.tonic = 'E';

    config.about.Updated        = 'November, 17 2022';
    config.about.Version        = '1.7.93';

    ////////////////////////////////////////////////////////////////////////////

    /**
     * fretboard                {Object}                    Object literal variables
     * @var                     {Object} element            Instrument board
     * @var                     {Array}  notes              All available notes for the instrument
     * @var                     {Array}  lines              Drawn lines
     * @var                     {Object} size               DOM size properties
     * @var                     {Object} partition          DOM partition size properties
     */
    const fretboard =
    {
        element: document.getElementById ( 'fretboard' ),
        notes:   [ ],
        lines:   [ ],
        size:
        {
            width:  document.getElementById ( 'fretboard' ).clientWidth,
            height: document.getElementById ( 'fretboard' ).clientHeight
        },
        partition:
        {
            width:  document.getElementById ( 'fretboard' ).clientWidth  / ( config.settings.maxFrets   + 1 ),
            height: document.getElementById ( 'fretboard' ).clientHeight / ( config.settings.maxStrings + 1 )
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DEBUG OUTPUT                    ////////////////////////////////////////////////////////////

    console.clear ( );

    console.log ( 'configuration: ', config );

    console.log ( 'Window Width:  ', config.dom.window.width, 'Height:', config.dom.window.height );

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

        config.settings.scale.notes = getScale ( );

        fretboard.notes             = getFretboardNotes ( );

        ////    DRAW    ////////////////////////////////////////////////////////

        drawFretboard      ( );

        drawFretboardFrets ( );

        ////    DISPLAY     ////////////////////////////////////////////////////

        displayScaleNotes  ( );

        displayNoteMarkers ( );

        displayFretNumbers ( );

        ////    SAVE    ////////////////////////////////////////////////////////

        canvasSave ( 1 );
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    SETTERS ( GENERIC )             ////////////////////////////////////////////////////////////

    /**
     * setDom()                 {Method}                    Set DOM elements properties prior to drawing
     * @var                     {Object} dom                DOM configuration settings 
     */
    function setDom ( dom = config.dom ) 
    {
        let canvases = document.getElementsByTagName ( 'canvas' );

        for ( let canvas of canvases )
        {
            dom.canvases.push ( document.getElementById ( canvas.id ) );
            dom.contexts.push ( document.getElementById ( canvas.id ).getContext ( "2d" ) );
        }

        let flyout =
        {
            width:  document.querySelector ( ".flyout-nav ul" ).clientWidth,
            height: document.querySelector ( ".flyout-nav ul" ).clientHeight
        }

        let canvas =
        {
            width:  fretboard.size.width,
            height: fretboard.size.height
        }

        let canvasScale =
        {
            width:  window.innerWidth - ( flyout.width * 1.25 ),
            height: fretboard.partition.height * 2.15
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
        
        document.getElementById ( "fretboard" ).style.marginTop       = `${canvasScale.height}px`;
        document.getElementById ( "fretboard" ).style.marginLeft      = `40px`;

        document.getElementById ( "control-wrapper" ).style.marginTop = `${controlWrapper.marginTop}px`;
        
        ////////////////////////////////////////////////////////////////////////
        ////    ANCILLARY   ////////////////////////////////////////////////////
        
            document.title = config.about.Library + ' | ver: ' + config.about.Version;

            musicNote.setCanvas ( 'fretboard' );

        if ( config.debug ) requireJS ( "script/unitTests.js" );
    };

////////////////////////////////////////////////////////////////////////////////////////////////////
////    SETTERS ( CUSTOM )              ////////////////////////////////////////////////////////////

    /**
     * linePushPop()            {Array:Method}              Pushes or pops line objects specifically for the fretboard
     * @param                   {Object} object             Line object to evaluate
     */
    function linePushPop ( object )
    {
        let index = undefined;

        if ( object.line [ 0 ] == object.line [ 1 ] ) return;                   // Ensure lines don't connect to themselves

        if ( fretboard.lines.length != 0 )                                      // Identify whether Array contains existing elements
        {
            for ( let line in fretboard.lines )                                 // Evaluate whether 'object' param is a new value or not

                    if ( object.line.sort ( ).toString ( ) === fretboard.lines [ line ].line.sort ( ).toString ( ) )

                        index = line;

            ( index > -1 ) ? fretboard.lines.splice ( index, 1 ) : fretboard.lines.push ( object );
        }
        else

            fretboard.lines.push ( object );

        // TODO: Check whether new line intersects with an existing line
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GETTERS ( GENERIC )             ////////////////////////////////////////////////////////////

    const getRgb  = ( color )                         => `rgb(${color})`;

    const getRgba = ( color, alpha )                  => `rgba(${color}, ${alpha})`;

    const getFont = ( name, size, weight = 'normal' ) => `${weight} ${size}px ${name}`;

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GETTERS ( CUSTOM )              ////////////////////////////////////////////////////////////

    /**
     * getScale()               {Method}                    Generates a musical scale based on params
     * @param                   {string} tonic              Tonic for the scale
     * @param                   {Array}  type               Array denoting the steps throughout the scale
     * @return                  {Array}                     Scale
     */
    function getScale ( tonic = config.settings.scale.tonic, type = config.settings.scale.type )
    {
        let result = Array ( );

        let index  = config.tone.notes.indexOf ( tonic );   // Get: index of tonic within the notes array

            result.push ( config.tone.notes[index] );       // Set: tonic
        
        for ( let step of type )
        {
            index = ( index + step >= config.tone.notes.length )
                        ? config.tone.notes.length % ( index + step )
                        : index + step;

            result.push ( config.tone.notes[index] );
        }

        return result;
    }

    /**
     * getFretboardNotes()      {Method}                    Generates all notes available throughout the instrument
     * @param                   {Object} tuning             Tuning for the musical instrument
     * @return                  {Array}                     All available notes throughout the instrument
     */
    function getFretboardNotes ( tuning = config.settings.tuning )
    {
        let result = new Array ( );

            config.settings.tuning.reverse ( );             // Invert tuning to ensure low notes match with lower array index values

        for ( let note in tuning )                          // Set: open notes
        {
            note = Number.parseInt ( note );

            result [ ( note + ( note * config.settings.maxFrets ) ) ] = tuning [ note ];
        }

        for ( let i = 0; i < ( config.settings.maxStrings * ( config.settings.maxFrets + 1 ) ); i++ )
        {
            let object = new Object ( );

                object.note        = ( typeof result [ i ] === 'object' ) 
                                         ? result [ i ].note   
                                         : musicNote.getNoteFromPreviousNote ( result [ i - 1 ] );

                object.octave      = ( typeof result [ i ] === 'object' ) 
                                         ? result [ i ].octave 
                                         : musicNote.getOctaveFromPreviousNote ( result [ i - 1 ] );

                object.interval    = musicNote.getIntervalFromNote    ( object.note );

                object.cell        = i;

                object.string      = musicNote.getStringFromCell      ( i );

                object.fret        = musicNote.getFretFromCell        ( i );

                object.display     = musicNote.getDisplayFromNote     ( object.note );

                object.coordinates = musicNote.getCoordinatesFromNote ( object );

                ////////////////////////////////////////////////////////////////

                result [ i ] = object;
        }

        return result;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    SPECIAL FUNCTIONS   ////////////////////////////////////////////////////////////////////////

    /**
     * canvasSave()             {Method}                    Saves the canvas to the saveState variable
     * @param                   {number} number             Number denoting the canvas
     */
    const canvasSave = ( number ) => { config.dom.saveState = config.dom.canvases [ number ].toDataURL ( ); }

    /**
     * showSavedState()         {Method}                    Clears the canvas, and replaces it with an image; from param
     * @param                   {number} number             Number denoting the canvas
     */
    function showSavedState ( number )
    {
        clearCanvas ( number );

        if ( document.getElementById ( 'saved-state' ) == null )
        {
            let element = document.createElement  ( 'img' );

            [ element.src, element.id, element.style ] = [ config.dom.saveState, 'saved-state', 'position: absolute' ];

                document.getElementById ( config.dom.canvases [ number ].id ).parentNode.insertBefore ( element, document.getElementById ( config.dom.canvases [ number ].id ).nextElementSibling );    
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GRAPHIC FUNCTIONS ( GENERIC )   ////////////////////////////////////////////////////////////

    /**
     * clearCanvas()            {Method}                    Clears the entire canvas element
     * @param                   {number} number             Number denoting the canvas to clear
     */
    const clearCanvas = ( number ) => config.dom.contexts[number].clearRect ( 0, 0, config.dom.canvases[number].width, config.dom.canvases[number].height );

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
    function drawLine ( xStart, xEnd, yStart, yEnd, stroke = { type: 0, color: '0, 0, 0', alpha: 1, width: 1 }, context = config.dom.contexts[1] )
    {
        context.strokeStyle = getRgb ( stroke.color );

        context.globalAlpha = stroke.alpha;

        context.lineCap     = 'round';

        context.lineWidth   = stroke.width;

        switch ( stroke.type )
        {
            case 1:   context.setLineDash ( [ 15, 15 ] );  break;

            default:  context.setLineDash ( [ ] );         break;            
        }

        ////////////////////////////////////////////////////////////////////////

        context.beginPath ( );

        context.moveTo    ( xStart, yStart );
        
        context.lineTo    ( xEnd, yEnd );

        context.stroke    ( );

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
    function drawRectangle ( x, y, width, height, stroke = { color: '255, 255, 255', alpha: 1, width: 4 }, fill = { color: '255, 255, 255', alpha: 0 }, context = config.dom.contexts[1] )
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
     * @param                   {number}  x                 x - axis; center
     * @param                   {number}  y                 y - axis; center
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
     * @param                   {Object}  context           2d canvas context
     */
    function drawCircle ( x, y, radius, angle = { start: 0, end: 2 * Math.PI }, stroke = { color: '255, 255, 255', alpha: 1, width: 6 }, fill = { color: '255, 255, 255', alpha: 0 }, context = config.dom.contexts[1] ) 
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
     * @param                   {number}  x                 x - position
     * @param                   {number}  y                 y - position
     * @param                   {string}  text              Test to display
     * @param                   {number}  fontSize          Font size
     * @param                   {number}  maxWidth          Maximum width of text area
     * @param                   {string}  color             Fill RGB number set for fill; r, g, b
     * @param                   {decimal} alpha             Fill alpha (transparency) number value
     * @param                   {Object}  context           2d canvas context
     */
    function displayText ( x, y, text, fontSize = 24, maxWidth, color = '0, 0, 0', alpha = 1, context = config.dom.contexts[1] )
    {
        context.font        = getFont ( 'Roboto', fontSize );

        context.fillStyle   = getRgb  ( color );

        context.globalAlpha = alpha;

        x = x - ( config.dom.contexts[0].measureText ( text ).width / 1.85 );

        y = y + ( fontSize / 3.5 );

        ////////////////////////////////////////////////////////////////////////

        context.fillText ( text, x, y, maxWidth );    

        context.globalAlpha = 1;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DRAWING FUNCTIONS               ////////////////////////////////////////////////////////////

    /**
     * drawFretboard()          {Method}                    Draws fretboard using HTML5 canvas API calls
     */
    function drawFretboard ( )
    {
        let cell    = 0;

        let strings = config.settings.maxStrings;

        let frets   = config.settings.maxFrets + 1; 

        for ( let i = 0; i < strings; i++ )                 // Horizontal cells
        {
            for ( let j = 0; j < frets; j++ )               // Vertical cells
            {
                cell++;

                if ( cell % frets == true ) continue;

                drawRectangle ( fretboard.partition.width  * j, fretboard.partition.height * i, fretboard.partition.width, fretboard.partition.height );
            }
        }
    }

    /**
     * drawFretboardFrets()     {Method}                    Draws thicker frets across fretboard
     * @param                   {Array}  frets              Frets to add
     * @param                   {string} color              Color of the fret drawn
     * @param                   {number} lineWidth          Width of the fret drawn
     */
    function drawFretboardFrets ( frets = [ 1, 12, 24 ], color = '170, 170, 170', lineWidth = 5 )
    {  
        for ( let fret of frets )
        {
            let x      = fretboard.partition.width * fret;
            
            let y      = ( fretboard.size.height   - fretboard.partition.height ) - 3;
            
            let offset = ( lineWidth - 3 );

            ////////////////////////////////////////////////////////////////////

            drawLine ( x,          x,          0, y, { type: 0, color: color,                    alpha: undefined, width: lineWidth } );   // Fret

            drawLine ( x - offset, x - offset, 2, y, { type: 0, color: config.colors.name.white, alpha: undefined, width: offset    } );   // Light
            
            drawLine ( x + offset, x + offset, 2, y, { type: 0, color: config.colors.name.black, alpha: undefined, width: offset    } );   // Shadow
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DISPLAY FUNCTIONS               ////////////////////////////////////////////////////////////

    /**
     * displayScaleNotes()      {Method}                    Displays the scale's notes on the instrument's board
     * @param                   {Array} scale               Array of notes for the scale to display
     */
    function displayScaleNotes ( scale = config.settings.scale.notes )
    {
        let index  = config.tone.notes.indexOf ( scale[0] );

        let offset = 15;

        for ( let note in config.tone.notes )
        {
            let object = new Object ( );

                object.note        = config.tone.notes [ index ];

                object.interval    = musicNote.getIntervalFromNote ( object.note );

                object.display     = musicNote.getDisplayFromNote  ( object.note );

                object.partition   = config.dom.canvases[0].width / config.tone.notes.length;

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
                        color: config.colors.name.black,    // stroke.color
                        alpha: object.alpha,                // stroke.alpha
                        width: 6                            // stroke.width
                    },
                    { 
                        color: object.fill,                 // fill.color
                        alpha: object.alpha                 // fill.alpha
                    },
                    config.dom.contexts[0]                  // context
                );

                displayText ( 
                    object.coordinates.x,                   // x
                    object.coordinates.y,                   // y
                    object.note,                            // text
                    24,                                     // fontSize
                    object.partition,                       // maxWidth
                    undefined,                              // color
                    object.alpha,                           // alpha
                    config.dom.contexts[0]                  // context
                );

                index = ( index == ( config.tone.notes.length - 1 ) ) ? 0 : index + 1;
        }
    }

    /**
     * displayNoteMarkers()     {Method}                    Display note markers throughout the instrument's board
     */
    function displayNoteMarkers ( )
    {
        for ( let note of fretboard.notes )
        {
            let alpha = musicNote.getIntervalAlpha ( note );

            drawCircle (
                note.coordinates.x,                         // x
                note.coordinates.y,                         // y
                ( fretboard.partition.height / 2 ) - 5,     // radius
                undefined,                                  // angle
                {
                    color: config.colors.name.black,        // stroke.color
                    alpha: alpha,                           // stroke.alpha
                    width: 5                                // stroke.width
                },
                {
                    color: musicNote.getIntervalColor ( note ),       // fill.color
                    alpha: alpha                            // fill.alpha
                }
            );

            displayText (
                note.coordinates.x,                         // x
                note.coordinates.y,                         // y
                note.note,                                  // text
                undefined,                                  // fontSize
                fretboard.partition.width,                  // maxWidth
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
        for ( let i = 0; i < ( config.settings.maxFrets + 1 ); i++ )
        {
            displayText (
                fretboard.partition.width * i + ( fretboard.partition.width  / 2 ),                 // x
                fretboard.size.height         - ( fretboard.partition.height / 2 ),                 // y
                i,                                                                                  // text
                undefined,                                                                          // fontSize
                fretboard.partition.width,                                                          // maxWidth
                '255, 255, 255'                                                                     // color
            );
        }
    }
