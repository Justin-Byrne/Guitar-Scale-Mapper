( ( window ) =>
{
    'use strict';

    /**
     * _genericDataTypes                                        Generic data-types
     * @type                        {Object}
     */
    let _genericDataTypes =
    {
        'Array'  : Array,
        'BigInt' : BigInt,
        'Boolean': Boolean,
        'Number' : Number,
        'String' : String
    }

    /**
     * _prototypes                                              Function declarations of generic data-types
     * @type                        {Object}
     */
    let _prototypes =
    {
        'String':
        {
            toTitleCase ( )
            {
                return this.toLowerCase ( ).split ( ' ' ).map ( function ( word )
                {
                    return ( word.charAt ( 0 ).toUpperCase( ) + word.slice( 1 ) );
                }).join ( ' ' );
            },
            countChar ( value )
            {
                let count = 0, i = this.length - 1;

                while ( i >= 0 )
                {
                    if ( this.charAt ( i ) == value ) count++;

                    i--;
                }

                return count;
            },
            splitValue ( delimiter )
            {
                return ( this.includes ( delimiter ) )

                           ? this.split ( delimiter )

                           : undefined;
            },
            convertToElements ( )
            {
                let temp = document.createElement ( 'div' );

                    temp.innerHTML = this;

                return temp.childNodes;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    GENERIC DATA    ////////////////////////////////////////////////////////////////////////

        /**
         * _mouse                                                   Application data for the mouse
         * @type                        {Object}
         */
        let _mouse =
        {
            start:  undefined,
            end:    undefined,
            down:   false,
            extant: -1,
            offset: { x: 0, y: 0 }
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    SETTERS     ////////////////////////////////////////////////////////////////////////////

        /**
         * _setScrollWidth()            {Function}                  Set's scroll width for mouse related functions
         */
        const _setScrollWidth       = ( )                   => [ app.mouse.offset.x = Math.round ( window.scrollX ) ]

        /**
         * _toggleCheckbox()            {Function}                  Toggles whether the passed input[type='checkbox'] is checked; or not
         * @param                       {string}  id                The input element's id
         * @param                       {boolean} check             Overrides toggle to either 'on' or 'off'
         */
        const _toggleCheckbox       = ( id, check )         => ( check == undefined ) ? document.getElementById ( id ).checked = ( document.getElementById ( id ).checked ) ? false : true : document.getElementById ( id ).checked = check;

        ////    MOUSE FUNCTIONS     ////////////////////////////////////////////

        /**
         * _mouseOver()                 {Function}                  UI mouse over trigger
         * @param                       {HTMLElement} uiElement     Object corresponding UI element
         */
        function _mouseOver ( uiElement )
        {
            document.getElementById ( uiElement.id ).style.setProperty ( 'box-shadow', 'inset 0px 0px 10px 2px #fff' );

            document.body.style.cursor = 'cell';
        }

        /**
         * _mouseOut()                  {Function}                  UI mouse out trigger
         * @param                       {HTMLElement} uiElement     Object corresponding UI element
         */
        function _mouseOut  ( uiElement )
        {
            document.getElementById ( uiElement.id ).style.setProperty ( 'box-shadow', 'none' );

            document.body.style.cursor = 'default';
        }

        /**
         * _mouseDown()                 {Function}                  UI mouse down trigger
         * @param                       {HTMLElement} uiElement     Object corresponding UI element
         */
        function _mouseDown ( uiElement )
        {
            [ app.mouse.down, app.mouse.start ] = [ true, _getUiNode ( uiElement ) ]
        }

        /**
         * _mouseUp()                   {Function}                  UI mouse up trigger
         * @param                       {HTMLElement} uiElement     Object corresponding UI element
         */
        function _mouseUp   ( uiElement )
        {
            [ app.mouse.down, app.mouse.end ] = [ false, _getUiNode ( uiElement ) ]

            if ( app.mouse.start == app.mouse.end )
            {
                // Toggle Note
                let note = guitarLab.getNoteFromCell ( app.mouse.end );

                if ( !note.display )
                {
                    note.toggleDisplay ( );

                    guitarLab.displayNoteMarkers ( );

                    canvasLab.canvasSave ( 1 );

                    console.log ( note );
                }
            }
            else
            {
                fingering.lines.pushPop ( _getLine ( ) );
            }

            // TODO: FIGURE THIS SHIT OUT WITH THE 'LINE' OBJECT
            // let object = { line: [ app.mouse.start, app.mouse.end ], stroke: musicNote.getLineStroke ( ) }

            canvasLab.getSavedState ( 'canvas' );

            guitarLab.drawFretboardShapes ( );
        }

        /**
         * _setHtmlContent()            {Function}                  Inserts HTML content in accordance with the window ID passed
         * @param                       {string} windowId           Window to populate HTML content to
         */
        function _setHtmlContent ( windowId )
        {
            switch ( windowId )
            {
                case 'about':

                    if ( !app.windows.about )
                    {
                        document.getElementById ( 'content' ).innerHTML +=
                            `<div id="program-name"><b>Program: </b>${app.about.Library}</div>`   +
                            `<div id="version-number"><b>Version: </b>${app.about.Version}</div>` +
                            `<div id="updated-last"><b>Updated: </b>${app.about.Updated}</div>`   +
                            `<div id="about-copyright">${app.about.Copyright}, all rights reserved</div>`;

                        app.windows.about = true;
                    }

                    break;

                case 'ui-overlay':

                    let temp           = fingering.notes;

                    let mouseFunctions = `onmouseover='uiLab.mouseOver ( this )' onmouseout='uiLab.mouseOut ( this )' onmousedown='uiLab.mouseDown ( this )' onmouseup='uiLab.mouseUp ( this )'`;

                    let cssStyles      = `style="display: inline-block; float: left; text-align: center; line-height: ${fingering.partition.height * 0.95}px; width: ${fingering.partition.width}px; height: ${fingering.partition.height}px; border-radius: ${fingering.partition.height - 2}px; transition: box-shadow 0.75s; color: white;"`;

                        temp.sort ( ( a, b ) =>
                        {
                            return ( a.string < b.string ) ? 1 : ( a.string > b.string ) ? -1 : 0;
                        });

                    for ( let note of temp )

                        document.getElementById ( 'ui-overlay' ).innerHTML += `<div ${cssStyles} ${mouseFunctions} id="ui-node-${note.cell}"></div>`;

                    break;

                default:

                    console.log ( `${windowId} is not supported by the _setHtmlContent ( ) function!` );

                    break;
            }
        }

        /**
         * _bindUiElements()            {Function}                  Bind UI elements to event listeners
         */
        function _bindUiElements ( )
        {
            setTimeout ( ( ) =>
            {
                _setHtmlContent ( 'ui-overlay' );

                window.about.addEventListener ( "click",     ( ) => _getWindow  ( 'about'  ) );

                window.addEventListener       ( "scroll",    _setScrollWidth );

                window.addEventListener       ( "mousemove", ( event ) =>
                {
                    canvasLab.getSavedState ( 'canvas' );

                    guitarLab.drawFretboardShapes ( );

                    if ( app.mouse.down )
                    {
                        let start = _getCoordinatesFromCell ( app.mouse.start );

                        let end   = _getMouseCoordinates    ( event );

                        canvasLab.drawLine (
                            start.x,                                            // xStart
                            end.x,                                              // xEnd
                            start.y,                                            // yStart
                            end.y,                                              // yEnd
                            {
                                type:  1,                                       // stroke.type
                                width: 5,                                       // stroke.width
                                color: app.colors.name.white,                   // stroke.color
                                alpha: 0.8                                      // stroke.alpha
                            }
                        );
                    }
                });
            },
            500 );
        }

        /**
         * _setPrototypes()             {Function}                  Set's prototypes stored within the _prototypes object literal
         */
        function _setPrototypes ( )
        {
            for ( let type in _prototypes )

                for ( let func in _prototypes [ type ] )

                    _genericDataTypes [ type ].prototype [ func ] = _prototypes [ type ] [ func ];
        }

        /**
         * _populateMenu()              {Function}                  Populate the 'flyout' menu with the object passed
         * @param                       {string} title              Title of the master menu item
         * @param                       {Object} object             Object to populate the master menu item
         */
        function _populateMenu ( title, object )
        {
            object = _object2Menu ( object );

            title = ( title.includes ( ' ' ) )

                        ? title.replace ( /\s/g, '_' ).toLowerCase ( )

                        : title.toLowerCase ( );

            ////    FUNCTIONS    ///////////////////////////////////////////////

                /**
                 * getDepth()                   {Function}                  Returns the depth of the value passed
                 * @param                       {string} value              Value to measure the depth of
                 * @return                      {number}                    Depth of the value passed
                 */
                const getDepth = ( value ) => ( value != undefined ) ? ( value.match ( /\./g ) || [] ).length : undefined;

                /**
                 * splitValue()                 {Function}                  Returns an array of the value split by the passed delimiter
                 * @param                       {string} value              Value to split
                 * @return                      {Array}                     Array containing each split value
                 */
                const getValue = ( value ) => ( value != undefined ) ? value.splitValue ( '.' ) : undefined;

                /**
                 * generateMenuItem()           {Function}                  Populates the 'subMenu' array with the appropriate HTML code for the flyout menu
                 * @param                       {string} type               Menu item type
                 * @param                       {string} key                Current key to denote the item
                 * @param                       {string} head               Key of the previous menu item(s) to be perpended a control
                 * @param                       {number} depth              Present depth of the item
                 * @return                      {string}                    HTML code
                 */
                function generateMenuItem ( type, key, head, depth )
                {
                    let result = undefined;

                    switch ( type )
                    {
                        case 'master':

                            result = `<!-- ${title} --><li class="has-children" id="menu-${title}"><a href="#"><label class="label" for="${title}-settings">${( title.includes ( '_' ) ) ? title.replace( /_/g, ' ' ).toTitleCase ( ) : title.toTitleCase ( )}</label></a><ul>`;

                            break;

                        case 'menu':

                            key    = key.toLowerCase   ( );

                            result = `<!-- ${title}-${key} --><li class="has-children"><a href="#"><label class="label" for="${title}-${key}">${key.toTitleCase ( )}</label></a><ul>`;

                            break;

                        case 'menuEnd':

                            result = '';

                            if ( depth > 0 )

                                for ( let i = 0; i < depth; i++ )

                                    result += '</ul></li>';

                            break;

                        case 'control':

                            let controlTitle = ( key.includes ( '_') ) ? key.replace ( /_/g, ' ' ) : key

                            let header       = ( head != undefined )   ? `${title}-${head}`        : title;

                            let value        = `${header}-${key}`.replace ( /\-/g, '.' );

                                [ header, key ] = [ header.toLowerCase ( ), key.toLowerCase ( ) ]

                                result = `<!-- ${header}-${key} --><li><a href="#"><input type="checkbox" id="${header}-${key}-checkbox" class="${header}-control" value='${value}'><label class="label" for="${header}-${key}-checkbox">${controlTitle.toTitleCase ( )}</label></a></li>`;

                            break;
                    }

                    ( type == 'master' )

                        ? subMenu.unshift ( result )

                        : subMenu.push    ( result );

                    return result;
                }

                let persistentLevel = 0;
                let lastMenu        = undefined;
                let columns         = 2;

                /**
                 * createMenuItem()             {Function}                  Preps the menu item prior to creation
                 * @param                       {string} type               Menu item type
                 * @param                       {string} key                Current key to denote the item
                 * @param                       {number} depth              Present depth of the item
                 * @param                       {number} level              Level of the current item
                 * @param                       {number} prevLevel          Level of the previous item
                 */
                function createMenuItem ( type, key, depth, level, prevLevel )
                {
                    ( prevLevel > level )

                        ? generateMenuItem ( 'menuEnd', undefined, undefined, prevLevel - level )

                        : String.empy;

                    ////////////////////////////////////////////////////////////

                    let regex = new RegExp ( `<!--\\s${title}-(?<result>[^\\s]+) -->` );

                    let head  = ( regex.test ( lastMenu ) ) ? regex.exec ( lastMenu )[1] : undefined;

                    let HTML  = generateMenuItem ( type, key, head );

                    ////////////////////////////////////////////////////////////

                    ( prevLevel == level )

                        ? persistentLevel++

                        : [ persistentLevel, columns ] = [ 0, 2 ];

                    if ( persistentLevel >= 12 )
                    {
                        let index = subMenu.indexOf ( lastMenu );

                        let menu  = ( columns < 3 )

                                        ? subMenu [ index ].replace ( '<ul>', `<ul style="columns: ${columns};">` )

                                        : subMenu [ index ].replace ( `<ul style="columns: ${columns - 1};">`, `<ul style="columns: ${columns};">` );

                            subMenu [ index ] = lastMenu = menu;

                            [ persistentLevel, columns ] = [ 0, columns + 1 ]
                    }

                        lastMenu  = ( /<li\sclass=\"has-children\">/.test ( HTML ) ) ? HTML  : lastMenu;

                        lastLevel = ( depth > 0 )                                    ? level : lastLevel;
                }

            ////    FUNCTIONS    ///////////////////////////////////////////////

            let keys      = Object.keys ( flatten ( object ) );
            let subMenu   = new Array ( );

            let count     = 0;
            let lastLevel = 0;

            for ( let key of keys )
            {
                let values =
                {
                    current:
                    {
                        depth:  getDepth ( keys [ count ] ),
                        lone:   undefined,
                        all:    getValue ( keys [ count ] ),
                        length: undefined
                    },
                    previous:
                    {
                        depth:  getDepth ( keys [ count - 1 ] ),
                        lone:   undefined,
                        all:    getValue ( keys [ count - 1 ] )
                    }
                }

                    values.current.length = ( values.current.all != undefined )

                                                ? values.current.all.length

                                                : 0;

                if ( count == 0 || values.current.depth == 0 )
                {
                    if ( values.current.depth == 0 )
                    {
                        createMenuItem ( 'control', key, values.current.depth );
                    }
                    else
                    {
                        for ( let i = 0; i < values.current.length; i++ )
                        {
                                values.current.lone = values.current.all[i];

                            ( i != ( values.current.length - 1 ) )

                                ? createMenuItem ( 'menu',    values.current.lone, values.current.depth, ( i + 1 ), lastLevel )

                                : createMenuItem ( 'control', values.current.lone, values.current.depth, ( i + 1 ), lastLevel );
                        }
                    }
                }
                else
                {
                    for ( let i = 0; i < values.current.length; i++ )
                    {
                            values.current.lone = values.current.all [ i ];

                        if ( values.previous.depth == 0 && i == 0 )
                        {
                            createMenuItem ( 'menu', values.current.lone, values.current.depth, ( i + 1 ), lastLevel );

                            continue;
                        }

                        if ( i == ( values.current.length - 1 ) )
                        {
                            createMenuItem ( 'control', values.current.lone, values.current.depth, ( i + 1 ), lastLevel );
                        }
                        else
                        {
                                values.previous.lone = values.previous.all[i];

                            if ( values.current.lone == values.previous.lone )
                            {
                                continue;
                            }
                            else
                            {
                                createMenuItem ( 'menu', values.current.lone, values.current.depth, ( i + 1 ), lastLevel );
                            }
                        }
                    }
                }

                count++;
            }

            ( lastLevel != 0 )

                ? generateMenuItem ( 'menuEnd', undefined, undefined, lastLevel )

                : generateMenuItem ( 'menuEnd', undefined, undefined, 1 )

            generateMenuItem ( 'master' );

            ////    RESULT   ///////////////////////////////////////////////////////////

            let mainMenu = document.querySelector( '#settings ul' );

            let temp     = mainMenu.innerHTML;

                mainMenu.innerHTML = subMenu.join ( '' ) + temp + '</li>';

            ////////////////////////////////////////////////////////////////////////////

            return subMenu.join ( '' );
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    GETTERS     ////////////////////////////////////////////////////////////////////////////

        /**
         * _getPixelValueFromStyle()    {Function}                  Returns the numeric pixel value from a specific style attribute
         * @param                       {type} id                   DOM object identifier
         * @param                       {type} style                Style to inspect
         * @return                      {number}                    Numeric value of the inspected style
         */
        const _getPixelValueFromStyle = ( id, style )       => Number.parseFloat ( document.getElementById ( id ).style [ style ].match ( /[^p]+/ )[0] );

        /**
         * _getCoordinatesFromCell()    {Function}                  Get coordinates of a specific note via it's cell number
         * @param                       {type} cell                 Cell number of note
         * @return                      {Object}                    X & Y coordinates of note
         */
        const _getCoordinatesFromCell = ( cell )            => { for ( let note in fingering.notes ) if ( fingering.notes[note].cell == cell ) { return fingering.notes [ note ].coordinates } }

        /**
         * _getMouseCoordinates()       {Function}                  Returns the mouses current coordinates relative to its position
         * @param                       {Object} event              Event from 'mousemove' event listener
         * @return                      {Object}                    X & Y coordinates of mouse
         */
        const _getMouseCoordinates    = ( event )           => ( { x: ( event.clientX + app.mouse.offset.x ) - _getPixelValueFromStyle ( 'fingering', 'marginLeft' ), y: event.clientY - _getPixelValueFromStyle ( 'fingering', 'marginTop' ) } );

        /**
         * _getUiNode()                 {Function}                  Returns node value from the rendered document object corresponding to a note
         * @param                       {Object} uiElement          Object corresponding UI element
         * @return                      {number}                    Node value
         */
        const _getUiNode              = ( uiElement )       => uiElement.id.match ( /ui-node-(?<result>\d+)/ ) [ 1 ];

        /**
         * _object2Menu()               {Function}                  Turns an object into a menu to be parsed by populateMenu()
         * @param                       {Object} object             Object to convert into a menu
         * @return                      {Object}                    Object in menu form
         */
        function _object2Menu ( object )
        {
            let temp        = new Array ( );

            let previousKey = undefined;

            ////    FUNCTIONS    ///////////////////////////////////////////////

                /**
                 * checkRedudancy()             {Function}                  Identifies whether the current value is present within the previous value
                 * @param                       {Object} value              Key value data
                 * @param                       {number} value.current      Value of the current key
                 * @param                       {number} value.previous     Value of the present key
                 */
                function checkRedudancy ( value = { current, previous } )
                {
                    let regex = '\\w+';

                    let append = '';

                    for ( let i = 1; i <= value.previous.countChar ( '.' ); i++ )

                        append += '\\.\\w+';

                    regex = new RegExp ( `${regex}${append}` );

                    if ( regex.test ( value.current ) ) temp.pop ( );
                }

                /**
                 * trimElements()               {Function}                  Trim elements to create a menu
                 * @param                       {Object} object             Object to trim
                 * @param                       {string} rootKey            Root key
                 */
                function trimElements ( object, rootKey = undefined )
                {
                    for ( let currentKey in object )
                    {
                        if ( currentKey.length > 2 )
                        {
                            currentKey  = ( rootKey != undefined )

                                              ? `${rootKey}.${currentKey}`

                                              : currentKey;

                            if ( previousKey != undefined && ( currentKey.countChar ( '.' ) > previousKey.countChar ( '.' ) ) )

                                checkRedudancy ( { current: currentKey, previous: previousKey } );

                            temp.push ( currentKey );

                            previousKey = currentKey;

                            if ( typeof object[`${currentKey}`] == 'object' )

                                trimElements ( object[`${currentKey}`], currentKey );
                        }
                    }
                }

            ////    FUNCTIONS    ///////////////////////////////////////////////

            trimElements ( object );

            let result = { };

            for ( let key of temp )

                if ( key.length > 2 ) result[`${key}`] = 0;

            return result;
        }

        /**
         * _createComboBox()            {Function}                  Creates a combo box utilizing the passed values
         * @param                       {string} title              Title of the combo box
         * @param                       {Array}  values             Values to populate the combo box with
         * @param                       {string} group              Title of the combo group
         */
        function _createComboBox ( title, values, group )
        {
            let elements    = new Array ( );

            let uiContainer = document.getElementById ( 'controls' );

            ////    FUNCTIONS    ///////////////////////////////////////////////

                /**
                 * getComboBox()                {Function}                  Generates a combo box utilizing the passed values
                 * @param                       {string} title              Title of the combo box
                 * @param                       {Array}  values             Values to populate the combo box with
                 * @return                      {string}                    Combo box containing passed values
                 */
                const getComboBox   = ( title, values ) => `<div class="btn-group dropup"><button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${title.toTitleCase ( )}</button><div id="${title.toLowerCase ( )}" class="dropdown-menu">${getOptions ( values )}</div></div><!-- .btn-group dropup -->`;

                /**
                 * getComboGroup()              {Function}                  Generates a combo group around the passed UI element
                 * @param                       {string} uiElement          Combo box to wrap within a combo group
                 * @param                       {string} group              Title for combo group
                 * @return                      {string}                    Combo group containing passed UI element
                 */
                const getComboGroup = ( uiElement, group ) => `<div id="${group}-group" class="control-group"><span class="header">${group}</span><div class="master-btn-group">${uiElement}</div></div><!-- .control-group #${group}-group -->`;

                /**
                 * setUiElements()              {Function}                  Appends each passed UI element as a child of the passed container
                 * @param                       {object} container          DOM container to append each UI element to
                 * @param                       {object} uiElements         UI elements
                 */
                const setUiElements = ( container, uiElements ) => { for ( let element of uiElements ) container.appendChild ( element ) }

                /**
                 * getOptions()                 {Function}                  Generates all combo box values with their appropriate tags
                 * @param                       {Array} values              Values to populate the combo box with
                 * @return                      {string}                    Combo box values
                 */
                function getOptions ( values )
                {
                    let result = '';

                    for ( let value in values )

                        result += `<a id="${value}" class="dropdown-item" onclick="comboBoxClick(this)">${values[value]}</a>\n`;

                    return result;
                }

            ////    FUNCTIONS    ///////////////////////////////////////////////

            let comboBox = getComboBox ( title, values );   // Create: combo box

            if ( group != undefined )
            {
                let groupId  = `${group}-group`;

                if ( document.getElementById ( groupId ) == null )

                    comboBox = getComboGroup ( comboBox, group );                   // Wrap: combo box in combo group

                else
                {
                    for ( let child of document.getElementById ( 'controls' ).children )

                        if ( child.id.includes ( groupId ) )
                        {
                            for ( let child of document.querySelector ( `#${groupId} .master-btn-group` ).children )

                                elements.push ( '<div class="btn-group dropup">' + child.innerHTML + '</div>' );

                            elements.push ( comboBox );                                                 // Push: combo box at the end of the elements' array

                            uiContainer.removeChild ( uiContainer.children [ groupId ] );               // Remove: previous group

                            comboBox = getComboGroup ( elements.join ( '' ), group );                   // Wrap: all elements in combo group
                        }
                }
            }

            setUiElements ( uiContainer, comboBox.convertToElements ( ) );
        }

        /**
         * _getLine()                   {Function}                  Returns a line using stored mouse coordinates
         * @return                      {Line}                      A line with all properties set
         */
        function _getLine ( )
        {
            return  canvasLab.getLine (
                        _getCoordinatesFromCell ( app.mouse.start ),            // start
                        _getCoordinatesFromCell ( app.mouse.end   ),            // end
                    );
        }

        /**
         * _getWindow()                 {Function}                  Display the window that's passed via it's windowId param
         * @param                       {string} windowId           Window to populate HTML content
         * @param                       {string} align              How the window should be aligned against the main window
         */
        function _getWindow ( windowId, align = 'center' )
        {
            let element = document.getElementById ( `${windowId}-window` );

            ////    FUNCTIONS   ////////////////////////////////////////////////

                /**
                 * setElementsPosition()        {Function}                  Sets the elements position using the align param
                 */
                function setElementsPosition ( )
                {
                    let adjust =
                    {
                        width:  undefined,
                        height: undefined
                    }

                    switch ( align )
                    {
                        case 'left':                               adjust.width = 0;     break;

                        case 'top': case 'bottom': case 'center':  adjust.width = 0.5;   break;

                        case 'right':                              adjust.width = 1;     break;
                    }

                    switch ( align )
                    {
                        case 'top':                                adjust.height = 0;    break;

                        case 'right': case 'left': case 'center':  adjust.height = 0.5;  break;

                        case 'bottom':                             adjust.height = 1;    break;
                    }

                    element.style.marginLeft = `${( app.dom.window.width  - Number.parseInt ( element.style.width  ) ) * adjust.width}px`;

                    element.style.marginTop  = `${( app.dom.window.height - Number.parseInt ( element.style.height ) ) * adjust.height}px`;

                    element.style.display    = 'block';
                }

            ////    FUNCTIONS   ////////////////////////////////////////////////

            ( element.style.display === 'none' )

                ? setElementsPosition ( )

                : element.style.display = 'none';

            _setHtmlContent ( windowId );
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    UTILITIES   ////////////////////////////////////////////////////////////////////////////

        /**
         * _add2GlobalContext()         {Function}                  Adds object to the global context for various settings
         * @param                       {string} newElement         Name of object
         * @param                       {Object} contents           Contents of object
         * @param                       {string} rootId             Root object under the 'window' object
         */
        function _add2GlobalContext ( newElement, contents, rootId = 'app' )
        {
            ( window [ rootId ] === undefined )

                ? window.alert ( `window.${rootId} is already defined !` )

                : window [ rootId ] [ newElement ] = contents;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    LIBRARY     ////////////////////////////////////////////////////////////////////////////

        function library ( )
        {
            let _lib = { };

            ////    SETTERS     ////////////////////////////////////////////////

                _lib.populateMenu   = ( title, object )         => _populateMenu ( title, object );

                _lib.createComboBox = ( title, values, group )  => _createComboBox ( title, values, group );

                _lib.mouseOver      = ( uiElement )             => _mouseOver ( uiElement );

                _lib.mouseOut       = ( uiElement )             => _mouseOut  ( uiElement );

                _lib.mouseDown      = ( uiElement )             => _mouseDown ( uiElement );

                _lib.mouseUp        = ( uiElement )             => _mouseUp   ( uiElement );

            ////    GETTERS     ////////////////////////////////////////////////

                // getters ...

            ////    INITIALIZER     ////////////////////////////////////////////

                _lib.init = function ( )
                {
                    _add2GlobalContext ( 'mouse', _mouse );

                    _setPrototypes ( );

                    _bindUiElements ( );
                }

            return _lib;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    INITIALIZE       ///////////////////////////////////////////////////////////////////////

        if ( typeof ( window.uiLab ) === 'undefined' )

            window.uiLab = library ( );

} ) ( window );
