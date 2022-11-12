( function ( window )
{
    'use strict';

    let map     = new Object ( );

    let offset  = undefined;

    let frets   = undefined;

    let canvas  = undefined;

    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

    if ( canvas == undefined )
    {
        console.warn ( 'canvas is not yet defined !' );
    }
    else
    {
        let map  =
        {
            notes:  [],                                                         // all notes
            scale:  [],                                                         // scale
            width:  canvas.clientWidth,                                         // canvas.partition.clientWidth
            height: canvas.clientHeight,                                        // canvas.partition.clientHeight
            split:
            {
                width:  canvas.clientWidth  / ( frets   + offset ),             // document.getElementById('fretboard').clientWidth  / ( config.settings.maxFrets   + 1 )
                height: canvas.clientHeight / ( strings + offset )              // document.getElementById('fretboard').clientHeight / ( config.settings.maxStrings + 1 )
            },
            max:
            {
                frets:   undefined,                                             // maxFrets
                strings: undefined                                              // maxStrings
            },
            color:
            {
                interval: [],                                                   // color intervals
                default: undefined                                              // config.colors.name.white
            }
        }
    }

    function musicNoteLib ( )
    {
        let _lib = {};
        
            ////////////////////////////////////////////////////////////////////////////////////////
            ////    SETTERS     ////////////////////////////////////////////////////////////////////

            _lib.setCanvas        = ( canvasId )      => { canvas = document.getElementById(`${canvasId}`) }

            _lib.setFrets         = ( frets )         => map.max.frets;
            _lib.setStrings       = ( strings )       => map.max.strings;
            _lib.setcolorInterval = ( ColorInterval ) => map.color.interval;
            _lib.setColorDefault  = ( ColorDefault )  => map.color.default;

            _lib.setSettings = ( map ) => map;

            ////////////////////////////////////////////////////////////////////////////////////////
            ////    GETTERS     ////////////////////////////////////////////////////////////////////

            _lib.getStringFromCell         = ( cell )                                                   => ( cell / ( config.settings.maxFrets + 1 ) ).toString ( )[0];

            _lib.getFretFromCell           = ( cell )                                                   => cell % ( config.settings.maxFrets + 1 );

            _lib.getDisplayFromNote        = ( note )                                                   => ( config.settings.scale.notes.indexOf ( note ) != -1 );

            _lib.getOctaveFromPreviousNote = ( o = { note, octave } )                                   => ( o.note == _lib.getMiddleNote ( ) ) ? o.octave + 1 : o.octave;

            _lib.getMiddleNote             = ( o = { note: config.settings.scale.tonic } )              => _lib.getPreviousNoteFromNote ( o.note );

            _lib.getIntervalColor          = ( o = { interval } )                                       => ( config.colors.interval [ o.interval ] != undefined ) ? config.colors.interval [ o.interval ] : config.colors.name.white;

            _lib.getIntervalAlpha          = ( o = { display }, alpha = { max: 0.8, min: 0.2 } )        => ( o.display ) ? alpha.max : alpha.min;

            _lib.getNoteFromPreviousNote   = ( o = { note }, i = config.tone.notes.indexOf ( o.note ) ) => config.tone.notes [ ( i + 1 >= config.tone.notes.length ) ? config.tone.notes.length % ( i + 1 ) : i + 1 ];

            _lib.getIntervalFromNote       = ( note, i = config.settings.scale.notes.indexOf ( note ) ) => ( i != -1 ) ? i + 1 : undefined;

            _lib.getPreviousNoteFromNote   = ( o, i = config.tone.notes.indexOf ( o.note ) )            => config.tone.notes [ ( i - 1 < 0 ) ? config.tone.notes.length - 1 : i - 1 ];

            _lib.getCoordinatesFromNote    = ( o = { fret, string } )                                   => ( { x: ( fretboard.partition.width * ( o.fret ) + ( fretboard.partition.width / 2 ) ), y: - ( fretboard.partition.height * ( o.string ) - ( fretboard.size.height - fretboard.partition.height * 1.5 ) ) } );

            ////////////////////////////////////////////////////////////////////

            _lib.getSettings = ( ) => map;

            _lib.getCanvas   = ( ) => canvas;

        return _lib;
    }

    if ( typeof ( window.musicNote ) === 'undefined' )
    {
        window.musicNote = musicNoteLib ( );
    }

}) ( window );

// musicNote.setCanvas ( 'fretboard' );