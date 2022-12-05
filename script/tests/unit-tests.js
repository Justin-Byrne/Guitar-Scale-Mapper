"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GLOBAL CONSTANTS                                        ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// const test =
// {
//     notes: [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ],
//     tuning :
//     {
//         values :
//         [
//             { note : 'E', octave : 4 },
//             { note : 'B', octave : 3 },
//             { note : 'G', octave : 3 },
//             { note : 'D', octave : 3 },
//             { note : 'A', octave : 2 },
//             { note : 'E', octave : 2 }
//         ],
//         compare :
//         [
//             { note: 'E',  octave: 4, interval: 1,    details: { cell: 125, string: 6, fret: 0, display: true,  coordinates: { x: 50.4, y: 36  } } },
//             { note: 'B',  octave: 3, interval: 5,    details: { cell: 100, string: 5, fret: 0, display: true,  coordinates: { x: 50.4, y: 108 } } },
//             { note: 'G',  octave: 3, interval: null, details: { cell: 75,  string: 4, fret: 0, display: false, coordinates: { x: 50.4, y: 180 } } },
//             { note: 'D',  octave: 3, interval: null, details: { cell: 50,  string: 3, fret: 0, display: false, coordinates: { x: 50.4, y: 252 } } },
//             { note: 'A',  octave: 2, interval: 4,    details: { cell: 25,  string: 2, fret: 0, display: true,  coordinates: { x: 50.4, y: 324 } } },
//             { note: 'E',  octave: 2, interval: 1,    details: { cell: 0,   string: 1, fret: 0, display: true,  coordinates: { x: 50.4, y: 396 } } }
//         ]
//     },
//     scales :
//     {
//         major :
//         {
//             'A'  : [ 'A',  'B',  'C#', 'D',  'E',  'F#', 'G#' ],
//             'A#' : [ 'A#', 'C',  'D',  'D#', 'F',  'G',  'A'  ],
//             'B'  : [ 'B',  'C#', 'D#', 'E',  'F#', 'G#', 'A#' ],
//             'C'  : [ 'C',  'D',  'E',  'F',  'G',  'A',  'B'  ],
//             'C#' : [ 'C#', 'D#', 'F',  'F#', 'G#', 'A#', 'C'  ],
//             'D'  : [ 'D',  'E',  'F#', 'G',  'A',  'B',  'C#' ],
//             'D#' : [ 'D#', 'F',  'G',  'G#', 'A#', 'C',  'D'  ],
//             'E'  : [ 'E',  'F#', 'G#', 'A',  'B',  'C#', 'D#' ],
//             'F'  : [ 'F',  'G',  'A',  'A#', 'C',  'D',  'E'  ],
//             'F#' : [ 'F#', 'G#', 'A#', 'B',  'C#', 'D#', 'F'  ],
//             'G'  : [ 'G',  'A',  'B',  'C',  'D',  'E',  'F#' ],
//             'G#' : [ 'G#', 'A#', 'C',  'C#', 'D#', 'F',  'G'  ]
//         }
//     },
//     menus :
//     {
//         control01 : 1,
//         control02 : 2,
//         one :
//         {
//             control01 : 1,
//             control02 : 2,
//             control03 : 3
//         },
//         two :
//         {
//             menu01 :
//             {
//                 control01 : 1,
//                 control02 : 2,
//                 control03 : 3
//             },
//             menu02 :
//             {
//                 control01 : 1,
//                 control02 : 2
//             },
//             menu03 :
//             {
//                 control01 : 1
//             }
//         },
//         three :
//         {
//             menu01 :
//             {
//                 menu01 :
//                 {
//                     control01 : 1,
//                     control02 : 2,
//                     control03 : 3
//                 }
//             },
//             menu02 :
//             {
//                 control01 : 1,
//                 control02 : 2,
//                 control03 : 3
//             },
//             control01 : 3
//         },
//         four :
//         {
//             menu01 :
//             {
//                 menu01 :
//                 {
//                     menu01 :
//                     {
//                         control01 : 1,
//                         control02 : 2,
//                         control03 : 3
//                     }
//                 }
//             },
//             control01 : 2,
//             menu03 :
//             {
//                 menu01 :
//                 {
//                     control01 : 1,
//                     control02 : 2,
//                     control03 : 3
//                 }
//             }
//         }
//     }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            TESTS                                                   ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

console.warn ( '[UNIT TESTS]' );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    CREATION FUNCTIONS      ////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
////    CREATION FUNCTIONS      ////////////////////////////////////////////////////////////////////

// console.group ( 'Creation Functions' );

//     console.log ( 'setScale ( )' );

//     Object.entries ( test.scales.major ).forEach ( ( element, index ) =>
//     {
//         console.group ( element[0] );

//         let testScale = setScale ( element[0], tone.scale.major );

//         for ( let i = 0; i < testScale.length; i++ )
//         {
//             console.assert (
//                 testScale[i] === element[1][i],
//                 `\n${testScale[i]} != ${element[1][i]}`      +
//                 `... testScale[${i}] != element[1][${i}] \n` +
//                 ` > testScale: ${testScale} \n`              +
//                 ` > element:   ${element[1]}`
//             );
//         }

//         console.groupEnd ( );
//     } );

//     console.log ( 'setNote ( )' );

//     for ( let note in test.tuning.values )
//     {
//         let value = setNote ( test.tuning.values[note], test.scales.major.E[note] );

//         console.log ( value );
//         console.log ( test.tuning.compare[note] );

//         console.assert ( value === test.tuning.compare[note], `\n${value} != ${test.tuning.compare[note]}` );
//     }

// console.groupEnd ( );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    GENERIC NOTE FUNCTIONS      ////////////////////////////////////////////////////////////////

// console.group ( 'Generic Note Functions' );

// console.groupEnd ( );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    CREATION FUNCTIONS      ////////////////////////////////////////////////////////////////////

// console.group ( 'Creation Functions' );

// console.groupEnd ( );

////////////////////////////////////////////////////////////////////////////////////////////////////
////    UI CONTROLS     ////////////////////////////////////////////////////////////////////////////

// console.group ( 'Menus' );

//     let menu  = populateMenu ( 'Test Menu', test.menus );

//     let match = `<!-- test_menu --><li class="has-children" id="menu-test_menu"><a href="#"><label class="label" for="test_menu-settings">Test Menu</label></a><ul><!-- test_menu-control01 --><li><a href="#"><input type="checkbox" id="test_menu-control01-checkbox" class="test_menu-control" value='test_menu.control01'><label class="label" for="test_menu-control01-checkbox">Control01</label></a></li><!-- test_menu-control02 --><li><a href="#"><input type="checkbox" id="test_menu-control02-checkbox" class="test_menu-control" value='test_menu.control02'><label class="label" for="test_menu-control02-checkbox">Control02</label></a></li><!-- test_menu-one --><li class="has-children"><a href="#"><label class="label" for="test_menu-one">One</label></a><ul><!-- test_menu-one-control01 --><li><a href="#"><input type="checkbox" id="test_menu-one-control01-checkbox" class="test_menu-one-control" value='test_menu.one.control01'><label class="label" for="test_menu-one-control01-checkbox">Control01</label></a></li><!-- test_menu-one-control02 --><li><a href="#"><input type="checkbox" id="test_menu-one-control02-checkbox" class="test_menu-one-control" value='test_menu.one.control02'><label class="label" for="test_menu-one-control02-checkbox">Control02</label></a></li><!-- test_menu-one-control03 --><li><a href="#"><input type="checkbox" id="test_menu-one-control03-checkbox" class="test_menu-one-control" value='test_menu.one.control03'><label class="label" for="test_menu-one-control03-checkbox">Control03</label></a></li></ul></li><!-- test_menu-two --><li class="has-children"><a href="#"><label class="label" for="test_menu-two">Two</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control01-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control01'><label class="label" for="test_menu-menu01-control01-checkbox">Control01</label></a></li><!-- test_menu-menu01-control02 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control02-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control02'><label class="label" for="test_menu-menu01-control02-checkbox">Control02</label></a></li><!-- test_menu-menu01-control03 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control03-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control03'><label class="label" for="test_menu-menu01-control03-checkbox">Control03</label></a></li></ul></li><!-- test_menu-menu02 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu02">Menu02</label></a><ul><!-- test_menu-menu02-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu02-control01-checkbox" class="test_menu-menu02-control" value='test_menu.menu02.control01'><label class="label" for="test_menu-menu02-control01-checkbox">Control01</label></a></li><!-- test_menu-menu02-control02 --><li><a href="#"><input type="checkbox" id="test_menu-menu02-control02-checkbox" class="test_menu-menu02-control" value='test_menu.menu02.control02'><label class="label" for="test_menu-menu02-control02-checkbox">Control02</label></a></li></ul></li><!-- test_menu-menu03 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu03">Menu03</label></a><ul><!-- test_menu-menu03-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu03-control01-checkbox" class="test_menu-menu03-control" value='test_menu.menu03.control01'><label class="label" for="test_menu-menu03-control01-checkbox">Control01</label></a></li></ul></li></ul></li><!-- test_menu-three --><li class="has-children"><a href="#"><label class="label" for="test_menu-three">Three</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control01-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control01'><label class="label" for="test_menu-menu01-control01-checkbox">Control01</label></a></li><!-- test_menu-menu01-control02 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control02-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control02'><label class="label" for="test_menu-menu01-control02-checkbox">Control02</label></a></li><!-- test_menu-menu01-control03 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control03-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control03'><label class="label" for="test_menu-menu01-control03-checkbox">Control03</label></a></li></ul></li></ul></li><!-- test_menu-menu02 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu02">Menu02</label></a><ul><!-- test_menu-menu02-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu02-control01-checkbox" class="test_menu-menu02-control" value='test_menu.menu02.control01'><label class="label" for="test_menu-menu02-control01-checkbox">Control01</label></a></li><!-- test_menu-menu02-control02 --><li><a href="#"><input type="checkbox" id="test_menu-menu02-control02-checkbox" class="test_menu-menu02-control" value='test_menu.menu02.control02'><label class="label" for="test_menu-menu02-control02-checkbox">Control02</label></a></li><!-- test_menu-menu02-control03 --><li><a href="#"><input type="checkbox" id="test_menu-menu02-control03-checkbox" class="test_menu-menu02-control" value='test_menu.menu02.control03'><label class="label" for="test_menu-menu02-control03-checkbox">Control03</label></a></li></ul></li><!-- test_menu-menu02-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu02-control01-checkbox" class="test_menu-menu02-control" value='test_menu.menu02.control01'><label class="label" for="test_menu-menu02-control01-checkbox">Control01</label></a></li></ul></li><!-- test_menu-four --><li class="has-children"><a href="#"><label class="label" for="test_menu-four">Four</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control01-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control01'><label class="label" for="test_menu-menu01-control01-checkbox">Control01</label></a></li><!-- test_menu-menu01-control02 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control02-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control02'><label class="label" for="test_menu-menu01-control02-checkbox">Control02</label></a></li><!-- test_menu-menu01-control03 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control03-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control03'><label class="label" for="test_menu-menu01-control03-checkbox">Control03</label></a></li></ul></li></ul></li></ul></li><!-- test_menu-menu01-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control01-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control01'><label class="label" for="test_menu-menu01-control01-checkbox">Control01</label></a></li><!-- test_menu-menu03 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu03">Menu03</label></a><ul><!-- test_menu-menu01 --><li class="has-children"><a href="#"><label class="label" for="test_menu-menu01">Menu01</label></a><ul><!-- test_menu-menu01-control01 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control01-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control01'><label class="label" for="test_menu-menu01-control01-checkbox">Control01</label></a></li><!-- test_menu-menu01-control02 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control02-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control02'><label class="label" for="test_menu-menu01-control02-checkbox">Control02</label></a></li><!-- test_menu-menu01-control03 --><li><a href="#"><input type="checkbox" id="test_menu-menu01-control03-checkbox" class="test_menu-menu01-control" value='test_menu.menu01.control03'><label class="label" for="test_menu-menu01-control03-checkbox">Control03</label></a></li></ul></li></ul></li></ul></li></ul></li>`;

//     console.assert ( menu === match, `\n${menu} != ${match}` );

//     document.getElementById ( "menu-test_menu" ).style.setProperty ( 'display', `${( config.debug ) ? 'block' : 'none'}` );

// console.groupEnd ( );