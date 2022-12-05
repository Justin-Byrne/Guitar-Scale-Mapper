"use strict";

( ( window ) =>
{
    /**
     * _colors                                                  Application default color settings
     * @type                        {Object}
     */
    let _colors =
    {
        main:
        [
            '0,     0,   0',        // BLACK                                    // 0
            '255, 255, 255',        // WHITE                                    // 1
            '52,   53,  52',        // JET                  BACKGROUND          // 2
            '184, 185, 187',        // GRAY                 FOREGROUND          // 3
        ],
        line:
        [
            '255,   0, 230',        // PURPLE                                   // 0
            '255,   0,  30',        // RED                                      // 1
            '255,  90,   0',        // ORANGE                                   // 2
            '255, 230,  60',        // YELLOW                                   // 3
            '60,  255,   0',        // GREEN                                    // 4
            '0,   150, 255',        // BLUELIGHT                                // 5
            '30,   60, 255'         // BLUEDARK                                 // 6
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
            black:  '0,     0,   0',                                            // 0
            white:  '255, 255, 255',                                            // 1
            jet:    '52,   53,  52',                                            // 2
            gray:   '184, 185, 187',                                            // 3
            red:    '199,  57,  54',                                            // 4
            yellow: '245, 233,  92',                                            // 5
            green:  '92,  167,  84',                                            // 6
            blue:   '0,   167, 211',                                            // 7
            pink:   '181,  70, 130'                                             // 8
        }
    }

    function configurations ( )
    {
        /**
         * _app                                                     Base object for all application variables
         * @type                        {Object}
         */
        let _app =
        {
            debug: false,
            windows:
            {
                about: false
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

            _app.colors = _colors;

        return _app;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////    INITIALIZE       ///////////////////////////////////////////////////////////////////

        if ( typeof ( window.app ) === 'undefined' )

            window.app = configurations ( );

} ) ( window );

app.about.Updated = 'December, 5 2022';
app.about.Version = '0.8.100';

////////////////////////////////////////////////////////////////////////////////////////////////////
////    DEBUG OUTPUT    ////////////////////////////////////////////////////////////////////////////

    console.clear ( );

    console.log ( 'configuration: ', app );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    BINDINGS    ////////////////////////////////////////////////////////////////////////////////

    document.addEventListener ( 'DOMContentLoaded', setDom ( ) );

      window.addEventListener ( 'resize', main );

      window.addEventListener ( 'load',   main );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    MAIN    ////////////////////////////////////////////////////////////////////////////////////

    /**
     * main()                       {Method}                        Main thread
     */
    function main ( )
    {
        ////    SETTERS    /////////////////////////////////////////////////////

            guitarLab.setScale          ( );

            guitarLab.setFingeringNotes ( );

        ////    DRAW    ////////////////////////////////////////////////////////

            guitarLab.drawFretboard      ( );

            guitarLab.drawFretboardFrets ( );

        ////    DISPLAY     ////////////////////////////////////////////////////

            guitarLab.displayScaleNotes  ( );

            guitarLab.displayNoteMarkers ( );

            guitarLab.displayFretNumbers ( );

        ////    SAVE    ////////////////////////////////////////////////////////

            canvasLab.setSavedState ( 'canvas' );

        ////    UI      ////////////////////////////////////////////////////////

            uiLab.populateMenu   ( 'Scale',  app.tone.scale  );

            uiLab.populateMenu   ( 'Tuning', app.tone.tuning );

            uiLab.createComboBox ( 'root',   app.tone.notes, 'notes' );

            uiLab.createComboBox ( 'type',   [ 'solid', 'dashed' ],  'lines' );

            uiLab.createComboBox ( 'color',  [ 'purple', 'red', 'orange', 'yellow', 'green', 'blue (light)', 'blue (dark)' ], 'lines' );

            uiLab.createComboBox ( 'alpha',  [ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1 ], 'lines' );

            uiLab.createComboBox ( 'width',  [ 1, 2, 3, 4, 5, 6, 7, 8 ], 'lines' );
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    SETTERS ( CUSTOM )      ////////////////////////////////////////////////////////////////////

    /**
     * setDom()                     {Method}                        Set DOM elements properties prior to drawing
     */
    function setDom ( )
    {
        ////    INIT    ////////////////////////////////////////////////////////

            canvasLab.init ( 'canvas' );

            guitarLab.init ( );

            uiLab.init ( );

        ////    SET UI ELEMENT POSITIONING    //////////////////////////////////

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

        ////    HEIGHT x WIDTH      ////////////////////////////////////////////

            document.getElementById ( "canvas" ).width          = canvas.width;
            document.getElementById ( "canvas" ).height         = canvas.height;

            document.getElementById ( "ui-overlay" ).width      = canvas.width;
            document.getElementById ( "ui-overlay" ).height     = canvas.height

            document.getElementById ( "canvas-scale" ).width    = canvasScale.width;
            document.getElementById ( "canvas-scale" ).height   = canvasScale.height;

            document.getElementById ( "controls" ).style.height = `${controlWrapper.height}px`;

        ////    MARGINS     ////////////////////////////////////////////////////

            document.getElementById ( "canvas-scale" ).style.marginLeft   = `${flyout.width}px`;

            document.getElementById ( "fingering" ).style.marginTop       = `${canvasScale.height}px`;
            document.getElementById ( "fingering" ).style.marginLeft      = `40px`;

            document.getElementById ( "control-wrapper" ).style.marginTop = `${controlWrapper.marginTop}px`;

        ////    ANCILLARY   ////////////////////////////////////////////////////

            document.title = app.about.Library + ' | ver: ' + app.about.Version;

            if ( app.debug ) requireJS ( "script/unitTests.js" );
    };
