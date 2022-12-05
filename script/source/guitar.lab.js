( ( window ) =>
{
    'use strict';

    /**
     * _dataTypes                                                   User defined data-types
     * @type                        {Object}
     */
    let _dataTypes =
    [
        function Note ( )
        {
            return class Note
            {
                #_note      = undefined;
                #_octave    = undefined;
                #_interval  = undefined;
                #_cell      = undefined;
                #_string    = undefined;
                #_fret      = undefined;
                #_display   = undefined;

                #_point     = new Point ( );

                constructor ( ) { }

                ////    SETTERS     ////////////////////////

                    set note ( value )
                    {
                        for ( let note of _tone.notes )
                        {
                            this.#_note = value.toUpperCase ( );

                            if ( this.#_note == note )

                                return;

                            this.#_note = undefined;
                        }
                    }

                    set octave ( value )
                    {
                        this.#_octave   = this.#_setNumber ( value, -100, 100 );
                    }

                    set interval ( value )
                    {
                        this.#_interval = this.#_setNumber ( value, 0, _settings.scale.notes.length );
                    }

                    set cell ( value )
                    {
                        this.#_cell     = this.#_setNumber ( value, 0, ( fingering.notes.length - 1 ) );
                    }

                    set string ( value )
                    {
                        this.#_string   = this.#_setNumber ( value, 0, _settings.max.strings );
                    }

                    set fret ( value )
                    {
                        this.#_fret     = this.#_setNumber ( value, 0, _settings.max.frets );
                    }

                    set display ( value )
                    {
                        this.#_display = ( typeof value == 'boolean' )

                                       ? value

                                       : ( typeof value == 'number' && this.#_isInRange ( value, 0, 1 ) == true )

                                             ? Boolean ( value )

                                             : undefined;
                    }

                    set point ( point = { x, y } )
                    {
                        this.#_point.x = point.x;

                        this.#_point.y = point.y;
                    }

                ////    GETTERS     ////////////////////////

                    get note     ( ) { return this.#_note;     }

                    get octave   ( ) { return this.#_octave;   }

                    get interval ( ) { return this.#_interval; }

                    get cell     ( ) { return this.#_cell;     }

                    get string   ( ) { return this.#_string;   }

                    get fret     ( ) { return this.#_fret;     }

                    get display  ( ) { return this.#_display;  }

                    get point    ( ) { return this.#_point;    }

                ////    UTILITIES   ////////////////////////

                    toggleDisplay = ( )                 => this.#_display = ( this.display ) ? false : true;

                    #_isInRange   = ( value, min, max ) => ( value >= min && value <= max )  ? true  : false;

                    #_setNumber   = ( value, min, max ) =>
                    {
                        let type  = ( typeof value == 'number' );

                        let range = this.#_isInRange ( value, min, max );

                        return ( type && range ) ? value : undefined;
                    }

                    isThere ( note ) { }
            }
        },
        function Notes ( )
        {
            return class Notes extends Array
            {
                constructor ( )
                {
                    super ( );
                }

                pushPop ( note )
                {

                }
            }
        }
    ]

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    GENERIC DATA    ////////////////////////////////////////////////////////////////////////

        /**
         * _tone                                                        Default note & scale settings
         * @type                        {Object}
         */
        let _tone =
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
        }

        /**
         * _settings                                                    Default canvas settings
         * @type                        {Object}
         */
        let _settings =
        {
            tuning: _tone.tuning.standard,
            scale:
            {
                type:  _tone.scale.common.major,
                tonic: 'E',
                notes: [ ]
            },
            max:
            {
                frets:   24,
                strings: 6
            }
        }

        /**
         * _fingering                                                   Default fingering settings
         * @type                        {Object}
         */
        let _fingering =
        {
            element: 'fingering',
            notes:   undefined,
            lines:   undefined,
            size:
            {
                width:  undefined,
                height: undefined
            },
            partition:
            {
                width:  undefined,
                height: undefined
            }
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    SETTERS     ////////////////////////////////////////////////////////////////////////////

        /**
         * _setDataTypes()              {Method}                        Set user defined data-types
         */
        function _setDataTypes ( )
        {
            for ( let type of _dataTypes )
            {
                ( type.name === undefined )

                    ? window.alert ( `window.${type.name} is already defined !` )

                    : window [ type.name ] = type ( );
            }
        }

        /**
         * _setSettings()               {Method}                        Set settings within global context
         */
        function _setSettings ( )
        {
            if ( window.app.settings === undefined )

                window.app = _settings;

            else

                for ( let element in _settings )

                    window.app.settings [ element ] = _settings [ element ];
        }

        /**
         * _setDefaults()               {Method}                        Set default variables
         */
        function _setDefaults ( )
        {
            _fingering.element          = document.getElementById ( _fingering.element );

            _fingering.lines            = new Lines ( );

            _fingering.notes            = new Notes ( );

            _fingering.size.width       = _fingering.element.clientWidth;

            _fingering.size.height      = _fingering.element.clientHeight;

            _fingering.partition.width  = _fingering.element.clientWidth  / ( _settings.max.frets   + 1 );

            _fingering.partition.height = _fingering.element.clientHeight / ( _settings.max.strings + 1 );
        }

        /**
         * _setFingering()              {Method}                        Adds fingering object to global context
         * @param                       {string} elementId              Element's ID for fingering element
         */
        function _setFingering ( elementId = 'fingering' )
        {
            ( document.getElementById ( elementId ) === undefined )

                ? window.alert ( `#${elementId} is not defined !` )

                : window.fingering = _fingering;
        }

        /**
         * _setScale()                  {Method}                        Set's the present scale being used by application
         * @param                       {string} tonic                  Tonic for the scale
         * @param                       {Array}  type                   Type of scale
         */
        function _setScale ( tonic = _settings.scale.tonic, type = _tone.scale.common.major )
        {
            let result = Array ( );

            let index  = app.tone.notes.indexOf ( tonic );  // Get: index of tonic within the notes array

                result.push ( app.tone.notes[index] );      // Set: tonic

            for ( let step of type )
            {
                index = ( index + step >= app.tone.notes.length )

                            ? app.tone.notes.length % ( index + step )

                            : index + step;

                result.push ( app.tone.notes [ index ] );
            }

            app.settings.scale.notes = result;
        }

        /**
         * _setFingeringNotes()         {Method}                        Set's fingering notes
         * @param                       {Object} tuning                 Tuning for the instrument
         */
        function _setFingeringNotes ( tuning = app.settings.tuning )
        {
            let result = new Array ( );

                app.settings.tuning.reverse ( );            // Invert: tuning to ensure low notes match with lower array index values

            for ( let note in tuning )                      // Set: open notes
            {
                note = Number.parseInt ( note );

                result [ ( note + ( note * app.settings.max.frets ) ) ] = tuning [ note ];
            }

            for ( let i = 0; i < ( app.settings.max.strings * ( app.settings.max.frets + 1 ) ); i++ )
            {
                let object = new Object ( );

                    object.note        = ( typeof result [ i ] === 'object' )

                                             ? result [ i ].note

                                             : _getNoteFromPreviousNote ( result [ i - 1 ] );

                    object.octave      = ( typeof result [ i ] === 'object' )

                                             ? result [ i ].octave

                                             : _getOctaveFromPreviousNote ( result [ i - 1 ] );

                    object.interval    = _getIntervalFromNote ( object.note );

                    object.cell        = i;

                    object.string      = _getStringFromCell      ( i );

                    object.fret        = _getFretFromCell        ( i );

                    object.display     = _getDisplayFromNote     ( object.note );

                    object.coordinates = _getCoordinatesFromNote ( object );

                    ////////////////////////////////////////////////////////////////

                    result [ i ] = object;
            }

            fingering.notes = result;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    GETTERS     ////////////////////////////////////////////////////////////////////////////

        const _getIntervalFromNote          = ( note )                                  => ( app.settings.scale.notes.indexOf ( note ) != -1 ) ? app.settings.scale.notes.indexOf ( note ) + 1 : undefined;

        const _getDisplayFromNote           = ( note )                                  => ( app.settings.scale.notes.indexOf ( note ) != -1 );

        const _getIntervalColor             = ( note )                                  => ( app.colors.interval [ note.interval ] != undefined ) ? app.colors.interval [ note.interval ] : app.colors.name.white;

        const _getIntervalAlpha             = ( note, alpha = { max: 0.8, min: 0.2 } )  => ( note.display ) ? alpha.max : alpha.min;

        const _getNoteFromPreviousNote      = ( note )                                  => app.tone.notes [ ( app.tone.notes.indexOf ( note.note ) + 1 >= app.tone.notes.length ) ? app.tone.notes.length % ( app.tone.notes.indexOf ( note.note ) + 1 ) : app.tone.notes.indexOf ( note.note ) + 1 ];

        const _getOctaveFromPreviousNote    = ( note, octave )                          => ( note == _getMiddleNote ( ) ) ? octave + 1 : octave;

        const _getStringFromCell            = ( cell )                                  => Number.parseInt ( ( cell / ( app.settings.max.frets + 1 ) ).toString ( )[0] ) + 1;

        const _getFretFromCell              = ( cell )                                  => cell % ( app.settings.max.frets + 1 );

        const _getCoordinatesFromNote       = ( note )                                  => ( { x: ( fingering.partition.width * ( note.fret ) + ( fingering.partition.width / 2 ) ), y: - ( fingering.partition.height * ( note.string - 1 ) - ( fingering.size.height - fingering.partition.height * 1.5 ) ) } );

        const _getMiddleNote                = ( note = app.settings.scale.tonic )       => _getPreviousNoteFromNote ( note );

        const _getPreviousNoteFromNote      = ( note )                                  => app.tone.notes [ ( app.tone.notes.indexOf ( note.note ) - 1 < 0 ) ? app.tone.notes.length - 1 : app.tone.notes.indexOf ( note.note ) - 1 ];

        function _getNoteFromCell ( cell )
        {
            let temp = fingering.notes;

                temp.sort ( ( a, b ) =>
                {
                    return ( a.string > b.string )

                               ? 1

                               : ( a.string < b.string )

                                     ? -1

                                     : 0;
                } ) [ cell ];

            return temp [ cell ];
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    UTILITIES   ////////////////////////////////////////////////////////////////////////////

        /**
         * _add2GlobalContext()         {Method}                        Adds object to the global context for various settings
         * @param                       {string} newElement             Name of object
         * @param                       {Object} contents               Contents of object
         * @param                       {string} rootId                 Root object under the 'window' object
         */
        function _add2GlobalContext ( newElement, contents, rootId = 'app' )
        {
            ( window [ rootId ] === undefined )

                ? window.alert ( `window.${rootId} is already defined !` )

                : window [ rootId ] [ newElement ] = contents;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    DRAWING     ////////////////////////////////////////////////////////////////////////////

        /**
         * _drawFretboard()             {Method}                        Draws fretboard
         */
        function _drawFretboard ( )
        {
            let cell    = 0;

            let strings = app.settings.max.strings;

            let frets   = app.settings.max.frets + 1;

            for ( let i = 0; i < strings; i++ )             // Horizontal cells
            {
                for ( let j = 0; j < frets; j++ )           // Vertical cells
                {
                    cell++;

                    if ( cell % frets == true ) continue;

                    canvasLab.drawRectangle (
                        fingering.partition.width  * j,     // x
                        fingering.partition.height * i,     // y
                        fingering.partition.width,          // width
                        fingering.partition.height          // height
                    );
                }
            }
        }

        /**
         * _drawFretboardFrets()        {Method}                        Draws thicker frets across fretboard
         * @param                       {Array}  frets                  Frets locations to add
         * @param                       {string} color                  Color of the fret drawn
         * @param                       {number} lineWidth              Width of the fret drawn
         */
        function _drawFretboardFrets ( frets = [ 1, 12, 24 ], color = '170, 170, 170', lineWidth = 5 )
        {
            for ( let fret of frets )
            {
                let x      = ( fingering.partition.width * fret );

                let y      = ( fingering.size.height     - fingering.partition.height ) - 3;

                let offset = ( lineWidth - 3 );

                ////////////////////////////////////////////////////////////////

                // FRET
                canvasLab.drawLine (
                    x,                                      // xStart
                    x,                                      // xEnd
                    0,                                      // yStart
                    y,                                      // yEnd
                    {
                        type:  0,                           // stroke.type
                        color: color,                       // stroke.color
                        alpha: undefined,                   // stroke.alpha
                        width: lineWidth                    // stroke.width
                    }
                );

                // Light
                canvasLab.drawLine (
                    x - offset,                             // xStart
                    x - offset,                             // xEnd
                    2,                                      // yStart
                    y,                                      // yEnd
                    {
                        type:  0,                           // stroke.type
                        color: app.colors.name.white,       // stroke.color
                        alpha: undefined,                   // stroke.alpha
                        width: offset                       // stroke.width
                    }
                );

                // Shadow
                canvasLab.drawLine (
                    x + offset,                             // xStart
                    x + offset,                             // xEnd
                    2,                                      // yStart
                    y,                                      // yEnd
                    {
                        type:  0,                           // stroke.type
                        color: app.colors.name.black,       // stroke.color
                        alpha: undefined,                   // stroke.alpha
                        width: offset                       // stroke.width
                    }
                );
            }
        }

        /**
         * _drawFretboardShapes()       {Method}                        Draws fretboard shapes
         * @param                       {boolean} shadow                Whether to display shadows under saved shapes
         */
        function _drawFretboardShapes ( shadow = true )
        {
            let start = undefined;

            let end   = undefined;

            canvasLab.setLineShadow ( shadow );

            for ( let line of fingering.lines )

                canvasLab.drawLine (
                    line.start.x,   // xStart
                    line.end.x,     // xEnd
                    line.start.y,   // yStart
                    line.end.y,     // yEnd
                    line.stroke,    // stroke
                    true            // shadow
                );
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    DISPLAY     ////////////////////////////////////////////////////////////////////////////

        /**
         * _displayScaleNotes()         {Method}                        Displays the scale's notes on the instrument's board
         * @param                       {string} canvasId               Canvas element identifier to display scale notes
         */
        function _displayScaleNotes ( scale = app.settings.scale.notes, canvasId = 'canvas-scale' )
        {
            let index  = app.tone.notes.indexOf ( scale [ 0 ] );

            let offset = 15;

            for ( let note in app.tone.notes )
            {
                let object = new Object ( );

                    object.note        = app.tone.notes [ index ];

                    object.interval    = _getIntervalFromNote ( object.note );

                    object.display     = _getDisplayFromNote  ( object.note );

                    object.partition   = app.dom.canvases [ canvasId ].width / app.tone.notes.length;

                    object.radius      = ( object.partition / 2 ) - offset;

                    object.fill        = _getIntervalColor ( object );

                    object.alpha       = _getIntervalAlpha ( object );

                    object.coordinates = {
                                            x: ( object.partition * note ) + object.radius + offset,
                                            y: ( object.partition - ( offset * 2 ) )
                                         };

                    ////////////////////////////////////////////////////////////

                    canvasLab.drawCircle (
                        object.coordinates.x,               // x
                        object.coordinates.y,               // y
                        object.radius,                      // radius
                        undefined,
                        {
                            color: app.colors.name.black,   // stroke.color
                            alpha: object.alpha,            // stroke.alpha
                            width: 6                        // stroke.width
                        },
                        {
                            color: object.fill,             // fill.color
                            alpha: object.alpha             // fill.alpha
                        },
                        app.dom.contexts [ canvasId ]       // context
                    );

                    canvasLab.displayText (
                        object.coordinates.x,               // x
                        object.coordinates.y,               // y
                        object.note,                        // text
                        24,                                 // fontSize
                        object.partition,                   // maxWidth
                        undefined,                          // color
                        object.alpha,                       // alpha
                        app.dom.contexts [ canvasId ]       // context
                    );

                    index = ( index == ( app.tone.notes.length - 1 ) ) ? 0 : index + 1;
            }
        }

        /**
         * _displayNoteMarkers()        {Method}                        Display note markers throughout the instrument's board
         */
        function _displayNoteMarkers ( )
        {
            for ( let note of fingering.notes )
            {
                let color = _getIntervalColor ( note );
                let alpha = _getIntervalAlpha ( note );

                canvasLab.drawCircle (
                    note.coordinates.x,                     // x
                    note.coordinates.y,                     // y
                    ( fingering.partition.height / 2 ) - 5, // radius
                    undefined,                              // angle
                    {
                        color: app.colors.name.black,       // stroke.color
                        alpha: alpha,                       // stroke.alpha
                        width: 5                            // stroke.width
                    },
                    {
                        color: color,                       // fill.color
                        alpha: alpha                        // fill.alpha
                    }
                );

                canvasLab.displayText (
                    note.coordinates.x,                     // x
                    note.coordinates.y,                     // y
                    note.note,                              // text
                    undefined,                              // fontSize
                    fingering.partition.width,              // maxWidth
                    undefined,                              // color
                    alpha                                   // alpha
                );
            }
        }

        /**
         * _displayFretNumbers()        {Method}                        Displays fret numbers at the bottom of the instrument's board
         */
        function _displayFretNumbers ( )
        {
            for ( let i = 0; i < ( app.settings.max.frets + 1 ); i++ )
            {
                canvasLab.displayText (
                    fingering.partition.width * i + ( fingering.partition.width  / 2 ),             // x
                    fingering.size.height         - ( fingering.partition.height / 2 ),             // y
                    i,                                                                              // text
                    undefined,                                                                      // fontSize
                    fingering.partition.width,                                                      // maxWidth
                    '255, 255, 255'                                                                 // color
                );
            }
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    LIBRARY     ////////////////////////////////////////////////////////////////////////////

        function library ( )
        {
            let _lib = { };

            ////    SETTERS     ////////////////////////////////////////////////

                _lib.setFingering           = ( elementId, value )              => _setFingering ( elementId, value );

                _lib.setScale               = ( tonic, type )                   => _setScale ( tonic, type );

                _lib.setFingeringNotes      = ( tuning )                        => _setFingeringNotes ( tuning );

            ////    GETTERS     ////////////////////////////////////////////////

                _lib.getNoteFromCell        = ( cell )                          => _getNoteFromCell ( cell );

            ////    DRAWING     ////////////////////////////////////////////////

                _lib.drawFretboard          = ( )                               => _drawFretboard ( );

                _lib.drawFretboardFrets     = ( frets, color, lineWidth )       => _drawFretboardFrets ( frets, color, lineWidth );

                _lib.displayScaleNotes      = ( scale, canvasId )               => _displayScaleNotes ( scale, canvasId );

                _lib.displayNoteMarkers     = ( )                               => _displayNoteMarkers ( );

                _lib.displayFretNumbers     = ( )                               => _displayFretNumbers ( );

                _lib.drawFretboardShapes    = ( shadow )                        => _drawFretboardShapes ( shadow );

            ////    INITIALIZER     ////////////////////////////////////////////

                _lib.init = function ( defaults )
                {
                    _setDataTypes      ( );

                    _setSettings       ( );

                    _add2GlobalContext ( 'tone', _tone );

                    _lib.setFingering  (  );

                    _setDefaults       ( defaults );
                }

            return _lib;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    INITIALIZE       ///////////////////////////////////////////////////////////////////////

        if ( typeof ( window.guitarLab ) === 'undefined' )

            window.guitarLab = library ( );

} ) ( window );
