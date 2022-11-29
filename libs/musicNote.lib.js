( ( window ) =>
{
    'use strict';

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    SETTINGS    ////////////////////////////////////////////////////////////////////////////

        let _settings =
        {
            tuning: { },
            scale:
            {
                type:  { },
                tonic: undefined,
                notes: [ ]
            },
            maxFrets:   undefined,
            maxStrings: undefined,
            visual:
            {
                line:
                {
                    type:   undefined,
                    color:  undefined,
                    alpha:  undefined,
                    width:  undefined,
                    shadow: undefined
                },

            }
        }

        let _dataTypes =
        [
            function Point ( )
            {
                return class Point
                {
                    x = undefined;
                    y = undefined;
                }
            },
            function Note  ( )
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

                    // #_radius    = undefined;             // N/A
                    // #_fill      = undefined;             // N/A
                    // #_alpha     = undefined;             // N/A

                    constructor ( ) { }

                    ////////////////////////////////////////////////////////////////////////////////
                    ////    SETTERS     ////////////////////////////////////////////////////////////

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
                            this.#_string   = this.#_setNumber ( value, 0, _settings.maxStrings );
                        }

                        set fret ( value )
                        {
                            this.#_fret     = this.#_setNumber ( value, 0, _settings.maxFrets );
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

                            this.#_point.y = point.yy;
                        }

                    ////////////////////////////////////////////////////////////////////////////////
                    ////    GETTERS     ////////////////////////////////////////////////////////////

                        get note     ( ) { return this.#_note;     }

                        get octave   ( ) { return this.#_octave;   }

                        get interval ( ) { return this.#_interval; }

                        get cell     ( ) { return this.#_cell;     }

                        get string   ( ) { return this.#_string;   }

                        get fret     ( ) { return this.#_fret;     }

                        get display  ( ) { return this.#_display;  }

                        get point    ( ) { return this.#_point;    }

                    ////////////////////////////////////////////////////////////////////////////////
                    ////    UTILITIES     //////////////////////////////////////////////////////////

                        toggleDisplay = ( )                 => this.#_display = ( this.display ) ? false : true;

                        #_isInRange   = ( value, min, max ) => ( value >= min && value <= max )  ? true  : false;

                        #_setNumber   = ( value, min, max ) =>
                        {
                            let type  = ( typeof value == 'number' );

                            let range = this.#_isInRange ( value, min, max );

                            return ( type && range ) ? value : undefined;
                        }
                }
            },
            function Line  ( )
            {
                return class Line
                {
                    start   = new Point;
                    end     = new Point;

                    stroke  = undefined;
                    shadow  = undefined;
                    context = undefined;

                    isThere ( line )
                    {
                        let toString  = ( valueA, valueB ) => `${valueA} ${valueB}`;

                        let thisStart = toString ( this.start.x, this.start.y ), thisEnd = toString ( this.end.x, this.end.y );

                        let lineStart = toString ( line.start.x, line.start.y ), lineEnd = toString ( line.end.x, line.end.y );

                        return ( thisStart == lineStart && thisEnd == lineEnd )

                                   ? true

                                   : ( thisStart == lineEnd && thisEnd == lineStart )
                    }
                }
            },
            function Lines ( )
            {
                return class Lines extends Array
                {
                    constructor ( )                         // Create constructor
                    {
                        super ( );
                    }

                    pushPop ( line )
                    {
                        let index = undefined;

                        if ( this.length != 0 )
                        {
                            for ( let value in this )

                                if ( this [ value ].isThere ( line ) )

                                    index = value;

                            ( index > -1 )

                                ? this.splice ( index, 1 )

                                : this.push   ( line );
                        }
                        else

                            this [ 0 ] = line;
                    }
                }
            }
        ]

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

        let _fingering =
        {
            element: undefined,
            notes:   [ ],
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

        let _post =
        {
            canvas:
            {
                state: undefined
            },
            line:
            {
                prior: { },
                cache: { }
            },
            redraw: { }
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    SETTERS ( CUSTOM )    //////////////////////////////////////////////////////////////////

        function _setDefaults ( )
        {
            ////////////////////////////////////////////////////////////////////
            ////    SETTINGS    ////////////////////////////////////////////////

                _settings.maxFrets              = 24;

                _settings.maxStrings            = 6;

            ////////////////////////////////////////////////////////////////////
            ////    LINE    ////////////////////////////////////////////////////

                _settings.visual.line.type      = 0;                            // SOLID

                _settings.visual.line.color     = app.colors.line [ 0 ];        // PURPLE

                _settings.visual.line.alpha     = 1;

                _settings.visual.line.width     = 8;

                _settings.visual.line.shadow    = false;

            ////////////////////////////////////////////////////////////////////
            ////    TONE    ////////////////////////////////////////////////////

                _settings.tuning                = _tone.tuning.standard;

                _settings.scale.type            = _tone.scale.common.major;

                _settings.scale.tonic           = 'E';

            ////////////////////////////////////////////////////////////////////
            ////    FINGERING   ////////////////////////////////////////////////

                _fingering.element             = document.getElementById ( 'fingering' );

                _fingering.lines               = new Lines ( );

                _fingering.size.width          = _fingering.element.clientWidth;

                _fingering.size.height         = _fingering.element.clientHeight;

                _fingering.partition.width     = _fingering.element.clientWidth  / ( _settings.maxFrets   + 1 );

                _fingering.partition.height    = _fingering.element.clientHeight / ( _settings.maxStrings + 1 );
        }

    ////////////////////////////////////////////////////////////////////////////

        function _setCanvases ( canvasId )
        {
            let canvases = document.getElementsByTagName ( 'canvas' );

            for ( let canvas of canvases )
            {
                app.dom.canvases [ canvas.id ] = document.getElementById ( canvas.id );

                app.dom.contexts [ canvas.id ] = document.getElementById ( canvas.id ).getContext ( "2d" );
            }

            app.dom.main.canvas  = app.dom.canvases [ canvasId ];

            app.dom.main.context = app.dom.contexts [ canvasId ];
        }

        function _setFingeringNotes ( tuning = app.settings.tuning )
        {
            let result = new Array ( );

                app.settings.tuning.reverse ( );            // Invert: tuning to ensure low notes match with lower array index values

            for ( let note in tuning )                      // Set: open notes
            {
                note = Number.parseInt ( note );

                result [ ( note + ( note * app.settings.maxFrets ) ) ] = tuning [ note ];
            }

            for ( let i = 0; i < ( app.settings.maxStrings * ( app.settings.maxFrets + 1 ) ); i++ )
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

        function _setScale ( tonic = app.settings.scale.tonic, type = app.settings.scale.type )
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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    LIBRARY     ////////////////////////////////////////////////////////////////////////////

        function musicNoteLib ( )
        {
            let _lib = { };

            ////////////////////////////////////////////////////////////////////
            ////    SETTERS     ////////////////////////////////////////////////

                _lib.setMaxFrets      = ( value )           => app.settings.maxFrets           = value;

                _lib.setMaxStrings    = ( value )           => app.settings.maxStrings         = value;

                _lib.setLineType      = ( value )           => app.settings.visual.line.type   = value;

                _lib.setLineColor     = ( value )           => app.settings.visual.line.color  = value;

                _lib.setLineAlpha     = ( value )           => app.settings.visual.line.alpha  = value;

                _lib.setLineWidth     = ( value )           => app.settings.visual.line.width  = value;

                _lib.setLineShadow    = ( value )           => app.settings.visual.line.shadow = value;

                _lib.setTuning        = ( array )           => app.settings.tuning             = array;

                _lib.setScaleType     = ( array )           => app.settings.scale.type         = array;

                _lib.setScaleTonic    = ( value )           => app.settings.scale.tonic        = value;

            ////////////////////////////////////////////

                _lib.setCanvases      = ( value )           => _setCanvases ( value );

                _lib.setSettings      = ( )                 => ( typeof ( window.app.settings ) === undefined ) ? window.alert ( 'window.app.settings is already defined !' ) : window.app.settings = _settings;

                _lib.setDatatypes     = ( )                 => { for ( let type of _dataTypes ) { ( typeof ( window[`${type.name}`] ) === undefined ) ? window.alert ( `${type.name} is already defined !` ) : window [`${type.name}`] = type ( ); } }

                _lib.setTone          = ( )                 => ( typeof ( window.app.tone ) === undefined ) ? window.alert ( `window.app.tone is already defined !` ) : window.app.tone = _tone;

                _lib.setFingering     = ( )                 => ( document.getElementById ( 'fingering' ) === undefined ) ? window.alert ( `div#fingering element doesn't exist !` ) : window.fingering = _fingering;

                _lib.setPost          = ( )                 => ( typeof ( window.app.post ) === undefined ) ? window.alert ( 'window.app.post is already defined !' ) : window.app.post = _post;

                _lib.setScale         = ( tonic, type )     => _setScale ( tonic, type );

            ////////////////////////////////////////////////////////////////////
            ////    GETTERS     ////////////////////////////////////////////////

                _lib.getMaxFrets                = ( )       => app.settings.maxFrets;

                _lib.getMaxStrings              = ( )       => app.settings.maxStrings;

                _lib.getLineType                = ( )       => app.settings.visual.line.type;

                _lib.getLineColor               = ( )       => app.settings.visual.line.color;

                _lib.getLineAlpha               = ( )       => app.settings.visual.line.alpha;

                _lib.getLineWidth               = ( )       => app.settings.visual.line.width;

                _lib.getTuning                  = ( )       => app.settings.tuning;

                _lib.getScaleType               = ( )       => app.settings.scale.type;

                _lib.getScaleTonic              = ( )       => app.settings.scale.tonic;

                ////////////////////////////////////////////

                _lib.getLineStroke              = ( )       =>
                {
                    let stroke = { };

                    for ( let prop in app.settings.visual.line )

                        stroke[`${prop}`] = app.settings.visual.line [ prop ];

                    return stroke;
                }

                _lib.getLine                    = ( )       =>
                {
                    let line = new Line ( );

                        line.start   = musicNote.getCoordinatesFromCell ( app.mouse.start );

                        line.end     = musicNote.getCoordinatesFromCell ( app.mouse.end   );

                        line.stroke  = musicNote.getLineStroke ( );

                        line.context = app.dom.main.context;

                        line.shadow  = app.settings.visual.line.shadow;

                    return line;
                }

                ////////////////////////////////////////////

                _lib.getStringFromCell          = ( cell )                                                => Number.parseInt ( ( cell / ( app.settings.maxFrets + 1 ) ).toString ( )[0] ) + 1;

                _lib.getFretFromCell            = ( cell )                                                => cell % ( app.settings.maxFrets + 1 );

                _lib.getDisplayFromNote         = ( note )                                                => ( app.settings.scale.notes.indexOf ( note ) != -1 );

                _lib.getOctaveFromPreviousNote  = ( o = { note, octave } )                                => ( o.note == _lib.getMiddleNote ( ) ) ? o.octave + 1 : o.octave;

                _lib.getMiddleNote              = ( o = { note: app.settings.scale.tonic } )              => _lib.getPreviousNoteFromNote ( o.note );

                _lib.getIntervalColor           = ( o = { interval } )                                    => ( app.colors.interval [ o.interval ] != undefined ) ? app.colors.interval [ o.interval ] : app.colors.name.white;

                _lib.getIntervalAlpha           = ( o = { display }, alpha = { max: 0.8, min: 0.2 } )     => ( o.display ) ? alpha.max : alpha.min;

                _lib.getNoteFromPreviousNote    = ( o = { note }, i = app.tone.notes.indexOf ( o.note ) ) => app.tone.notes [ ( i + 1 >= app.tone.notes.length ) ? app.tone.notes.length % ( i + 1 ) : i + 1 ];

                _lib.getNoteFromCell            = ( cell )                                                =>
                {
                    let temp = fingering.notes;

                        temp.sort ( ( a, b ) =>
                        {
                            return ( a.string > b.string ) ? 1 : ( a.string < b.string ) ? -1 : 0;
                        }) [ cell ];

                    return temp [ cell ];
                }

                _lib.getIntervalFromNote        = ( note, i = app.settings.scale.notes.indexOf ( note ) ) => ( i != -1 ) ? i + 1 : undefined;

                _lib.getPreviousNoteFromNote    = ( o, i = app.tone.notes.indexOf ( o.note ) )            => app.tone.notes [ ( i - 1 < 0 ) ? app.tone.notes.length - 1 : i - 1 ];

                _lib.getCoordinatesFromNote     = ( o = { fret, string } )                                => ( { x: ( fingering.partition.width * ( o.fret ) + ( fingering.partition.width / 2 ) ), y: - ( fingering.partition.height * ( o.string - 1 ) - ( fingering.size.height - fingering.partition.height * 1.5 ) ) } );

                _lib.getCoordinatesFromCell     = ( cell )                                                => { for ( let note in fingering.notes ) if ( fingering.notes [ note ].cell == cell ) { return fingering.notes [ note ].coordinates } }

                ////////////////////////////////////////////

                _lib.setFingeringNotes          = ( tuning )                        => fingering.notes = _setFingeringNotes ( tuning );

            ////////////////////////////////////////////////////////////////////
            ////    INITIALIZER     ////////////////////////////////////////////

                _lib.init         = ( mainCanvas ) =>
                {
                    _lib.setDatatypes ( );

                    _lib.setCanvases  ( mainCanvas );

                    _setDefaults      ( );                  // TODO: EXPAND TO INCLUDE CUSTOM DEFAULTS

                    _lib.setSettings  ( );

                    _lib.setTone      ( );

                    _lib.setFingering ( );

                    _lib.setPost      ( );
                }

            return _lib;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    INITIALIZE       ///////////////////////////////////////////////////////////////////////

        if ( typeof ( window.musicNote ) === 'undefined' )

            window.musicNote = musicNoteLib ( );

}) ( window );
