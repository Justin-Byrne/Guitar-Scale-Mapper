"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL CONSTANTS                                        ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

const testValues =
{
    scales : 
    {
        major : 
        {
            'A' :
            [
                'A',
                'B',
                'C#',
                'D',
                'E',
                'F#',
                'G#' 
            ],
            'A#' :
            [
                'A#',
                'C',
                'D',
                'D#',
                'F',
                'G',
                'A' 
            ],
            'B' :
            [
                'B',
                'C#',
                'D#',
                'E',
                'F#',
                'G#',
                'A#'
            ],
            'C' :
            [
                'C',
                'D',
                'E',
                'F',
                'G',
                'A',
                'B' 
            ],
            'C#' :
            [
                'C#',
                'D#',
                'F',
                'F#',
                'G#',
                'A#',
                'C' 
            ],
            'D' :
            [
                'D',
                'E',
                'F#',
                'G',
                'A',
                'B',
                'C#' 
            ],
            'D#' :
            [
                'D#',
                'F',
                'G',
                'G#',
                'A#',
                'C',
                'D' 
            ],
            'E' :
            [
                'E',
                'F#',
                'G#',
                'A',
                'B',
                'C#',
                'D#' 
            ],
            'F' :
            [
                'F',
                'G',
                'A',
                'A#',
                'C',
                'D',
                'E' 
            ],
            'F#' :
            [
                'F#',
                'G#',
                'A#',
                'B',
                'C#',
                'D#',
                'F' 
            ],
            'G' :
            [
                'G',
                'A',
                'B',
                'C',
                'D',
                'E',
                'F#' 
            ],
            'G#' :
            [
                'G#',
                'A#',
                'C',
                'C#',
                'D#',
                'F',
                'G'
            ]
        }    
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            TESTS                                                   ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

console.log   ( 'UNIT TESTS !!!' );

console.groupCollapsed ( 'SCALES' );

Object.entries ( testValues.scales.major ).forEach ( ( element, index ) =>
{
    console.group ( element[0] );

    let testScale = setScale ( element[0], tone.scale.major );

    for ( let i = 0; i < testScale.length; i++ )
    {
        console.assert ( 
            testScale[i] === element[1][i], 
            `\n${testScale[i]} != ${element[1][i]}`      + 
            `... testScale[${i}] != element[1][${i}] \n` +
            ` > testScale: ${testScale} \n`              +
            ` > element:   ${element[1]}` 
        );
    }

    console.groupEnd ( );

} );

console.groupEnd ( );