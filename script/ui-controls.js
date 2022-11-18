////////////////////////////////////////////////////////////////////////////////////////////////////
////    MAIN                    ////////////////////////////////////////////////////////////////////

    function main ( )
    {
        populateMenu   ( 'Scale',  object2Menu ( config.tone.scale ) );

        populateMenu   ( 'Tuning', object2Menu ( config.tone.tuning ) );

        createComboBox ( 'root',   config.tone.notes,     'notes' );
        
        createComboBox ( 'type',   [ 'solid', 'dashed' ], 'lines' );

        createComboBox ( 'alpha',  [ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1  ], 'lines' );

        createComboBox ( 'Width',  [ 1, 2, 3, 4, 5, 6 ], 'lines' );
    }

    main ();

////////////////////////////////////////////////////////////////////////////////////////////////////
////    ARROW FUNCTIONS         ////////////////////////////////////////////////////////////////////

    ////    SETTERS     ////////////////////////////////////////////////////////
    
    /**
     * setScrollWidth()         {Method}                    Sets the scroll width; in config.mouse.offset.x
     */
    const setScrollWidth         = ( )           => [ config.mouse.offset.x = Math.round ( window.scrollX ) ]

    ////    GETTERS     ////////////////////////////////////////////////////////

    /**
     * getPixelValueFromStyle() {Method}                    Returns the numeric pixel value from a specific style attribute
     * @param                   {type} id                   DOM object identifier 
     * @param                   {type} style                Style to inspect
     * @return                  {number}                    Numeric value of the inspected style
     */
    const getPixelValueFromStyle = ( id, style ) => Number.parseFloat ( document.getElementById ( id ).style[`${style}`].match ( /[^p]+/ )[0] );
    
    /**
     * getCoordinatesFromCell() {Method}                    Get coordinates of a specific note via it's cell number
     * @param                   {type} cell                 Cell number of note
     * @return                  {Object}                    X & Y coordinates of note
     */
    const getCoordinatesFromCell = ( cell )      => { for ( let note in fretboard.notes ) if ( fretboard.notes[note].cell == cell ) { return fretboard.notes[note].coordinates } }

    /**
     * getMouseCoordinates()    {Method}                    Returns the mouses current coordinates relative to its position
     * @param                   {Object} event              Event from 'mousemove' event listener
     * @return                  {Object}                    X & Y coordinates of mouse
     */
    const getMouseCoordinates    = ( event )     => ( { x: ( event.clientX + config.mouse.offset.x ) - getPixelValueFromStyle ( 'fretboard', 'marginLeft' ), y: event.clientY - getPixelValueFromStyle ( 'fretboard', 'marginTop' ) } );

    /**
     * getUiNode()              {Method}                    Returns node value from the rendered document object corresponding to a note
     * @param                   {Object} uiElement          Object corresponding UI element
     * @return                  {number}                    Node value
     */
    const getUiNode              = ( uiElement ) => uiElement.id.match ( /ui-node-(?<result>\d+)/ )[1];

    ////    SPECIAL     ////////////////////////////////////////////////////////

    /**
     * toggleCheckbox()         {Method}                    Toggles whether the passed input[type='checkbox'] is checked; or not
     * @param                   {string}  id                The input element's id
     * @param                   {boolean} check             Overrides toggle to either 'on' or 'off'
     */
    const toggleCheckbox         = ( id, check ) => ( check == undefined ) ? document.getElementById ( id ).checked = ( document.getElementById ( id ).checked ) ? false : true : document.getElementById ( id ).checked = check;

////////////////////////////////////////////////////////////////////////////////////////////////////
////    COMPONENT FUNCTIONS     ////////////////////////////////////////////////////////////////////

    /**
     * populateMenu()           {Method}                    Populate the 'flyout' menu with the object passed
     * @param                   {string} title              Title of the master menu item
     * @param                   {Object} object             Object to populate the master menu item
     */
    function populateMenu ( title, object )
    {
        title = ( title.includes ( ' ' ) )
                    ? title.replace ( /\s/g, '_' ).toLowerCase ( )
                    : title.toLowerCase ( );

        ////////////////////////////////////////////////////////////////////////
        ////    FUNCTIONS    ///////////////////////////////////////////////////

            /**
             * getDepth()               {Method}                    Returns the depth of the value passed
             * @param                   {string} value              Value to measure the depth of
             * @return                  {number}                    Depth of the value passed
             */
            const getDepth = ( value ) => ( value != undefined ) ? ( value.match ( /\./g ) || [] ).length : undefined;

            /**
             * splitValue()             {Method}                    Returns an array of the value split by the passed delimiter
             * @param                   {string} value              Value to split
             * @return                  {Array}                     Array containing each split value
             */
            const getValue = ( value ) => ( value != undefined ) ? value.splitValue ( '.' ) : undefined;

            /**
             * generateMenuItem()       {Method}                    Populates the 'subMenu' array with the appropriate HTML code for the flyout menu
             * @param                   {string} type               Menu item type
             * @param                   {string} key                Current key to denote the item
             * @param                   {string} head               Key of the previous menu item(s) to be perpended a control
             * @param                   {number} depth              Present depth of the item
             * @return                  {string}                    HTML code
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

                            header = header.toLowerCase ( );
                            key    = key.toLowerCase    ( );

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
             * createMenuItem()         {Method}                    Preps the menu item prior to creation
             * @param                   {string} type               Menu item type
             * @param                   {string} key                Current key to denote the item
             * @param                   {number} depth              Present depth of the item
             * @param                   {number} level              Level of the current item
             * @param                   {number} prevLevel          Level of the previous item
             */
            function createMenuItem ( type, key, depth, level, prevLevel )
            {   
                ( prevLevel > level )
                    ? generateMenuItem ( 'menuEnd', undefined, undefined, prevLevel - level )
                    : String.empy;

                ////////////////////////////////////////////////////////////////////////////////////////////

                let regex = new RegExp ( `<!--\\s${title}-(?<result>[^\\s]+) -->` );
                
                let head  = ( regex.test ( lastMenu ) ) ? regex.exec ( lastMenu )[1] : undefined;

                let HTML  = generateMenuItem ( type, key, head );

                ////////////////////////////////////////////////////////////////////////////////////////////

                ( prevLevel == level ) ? persistentLevel++ : [ persistentLevel, columns ] = [ 0, 2 ];

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

        ////    FUNCTIONS    ///////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

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

                values.current.length = ( values.current.all != undefined ) ? values.current.all.length : 0;

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
                        values.current.lone = values.current.all[i];

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

    /**
     * object2Menu()            {Method}                    Turns an object into a menu to be parsed by populateMenu()
     * @param                   {Object} object             Object to convert into a menu
     * @return                  {Object}                    Object in menu form
     */
    function object2Menu ( object )
    {
        let temp        = new Array ( );

        let previousKey = undefined;

        ////////////////////////////////////////////////////////////////////////
        ////    FUNCTIONS    ///////////////////////////////////////////////////

            /**
             * checkRedudancy()         {Method}                    Identifies whether the current value is present within the previous value 
             * @param                   {Object} value              Key value data
             * @param                   {number} value.current      Value of the current key
             * @param                   {number} value.previous     Value of the present key
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
             * trimElements()           {Method}                    Trim elements to create a menu
             * @param                   {Object} object             Object to trim
             * @param                   {string} rootKey            Root key
             */
            function trimElements ( object, rootKey = undefined )
            {
                for ( let currentKey in object )
                {   
                    if ( currentKey.length > 2 )
                    {
                        currentKey  = ( rootKey != undefined ) 
                                          ? `${rootKey}.${currentKey}` : currentKey;   

                        if ( previousKey != undefined && ( currentKey.countChar ( '.' ) > previousKey.countChar ( '.' ) ) )
                            checkRedudancy ( { current: currentKey, previous: previousKey } );    

                        temp.push ( currentKey );

                        previousKey = currentKey;

                        if ( typeof object[`${currentKey}`] == 'object' ) 
                            trimElements ( object[`${currentKey}`], currentKey );
                    }
                }
            }

        ////    FUNCTIONS    ///////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        trimElements ( object );

        let result = {};

        for ( let key of temp )
            if ( key.length > 2 ) result[`${key}`] = 0;

        return result;
    }

    /**
     * createComboBox()         {Method}                    Creates a combo box utilizing the passed values
     * @param                   {string} title              Title of the combo box
     * @param                   {Array}  values             Values to populate the combo box with
     * @param                   {string} group              Title of the combo group
     */
    function createComboBox ( title, values, group )
    {
        let elements    = new Array ( );

        let uiContainer = document.getElementById ( 'controls' );

        ////////////////////////////////////////////////////////////////////////
        ////    FUNCTIONS    ///////////////////////////////////////////////////

            /**
             * getOptions()             {Method}                Generates all combo box values with their appropriate tags
             * @param                   {Array} values          Values to populate the combo box with
             * @return                  {string}                Combo box values
             */
            function getOptions ( values )
            {    
                let result = '';

                for ( let value in values )
                    result += `<a id="${value}" class="dropdown-item" onclick="comboBoxClick(this)">${values[value]}</a>\n`;

                return result;
            }

            /**
             * getComboBox()            {Method}                Generates a combo box utilizing the passed values
             * @param                   {string} title          Title of the combo box
             * @param                   {Array}  values         Values to populate the combo box with
             * @return                  {string}                Combo box containing passed values
             */
            const getComboBox = ( title, values ) => `<div class="btn-group dropup"><button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${title.toTitleCase ( )}</button><div class="dropdown-menu">${getOptions ( values )}</div></div><!-- .btn-group dropup -->`;

            /**
             * getComboGroup()          {Method}                Generates a combo group around the passed UI element
             * @param                   {string} uiElement      Combo box to wrap within a combo group
             * @param                   {string} group          Title for combo group
             * @return                  {string}                Combo group containing passed UI element
             */
            const getComboGroup = ( uiElement, group ) => `<div id="${group}-group" class="control-group"><span class="header">${group}</span><div class="master-btn-group">${uiElement}</div></div><!-- .control-group #${group}-group -->`;

            /**
             * setUiElements()          {Method}                Appends each passed UI element as a child of the passed container
             * @param                   {object} container      DOM container to append each UI element to
             * @param                   {object} uiElements     UI elements
             */
            const setUiElements = ( container, uiElements ) => { for ( let element of uiElements ) container.appendChild ( element ) }

        ////    FUNCTIONS    ///////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        let comboBox    = getComboBox ( title, values );    // Create: combo box

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
     * comboBoxClick()          {Method}                    ///// @TODO: [description] /////
     * @param                   {object} uiElement          Object corresponding UI element
     */
    function comboBoxClick ( uiElement )
    {
        console.log ( config.tone.notes [ `${uiElement.id}` ] );
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
                        `<div id="program-name"><b>Program: </b>${config.about.Library}</div>`   +
                        `<div id="version-number"><b>Version: </b>${config.about.Version}</div>` +
                        `<div id="updated-last"><b>Updated: </b>${config.about.Updated}</div>`   +
                        `<div id="about-copyright">${config.about.Copyright}, all rights reserved</div>`;

                    config.windows.about = true;
                }

                break;

            case 'ui-overlay':

                let temp           = fretboard.notes;

                let mouseFunctions = `onmouseover='mouseOver ( this )' onmouseout='mouseOut ( this )' onmousedown='mouseDown ( this )' onmouseup='mouseUp ( this )'`;

                let cssStyles      = `style="display: inline-block; float: left; text-align: center; line-height: ${fretboard.partition.height * 0.95}px; width: ${fretboard.partition.width}px; height: ${fretboard.partition.height}px; border-radius: ${fretboard.partition.height - 2}px; transition: box-shadow 0.75s; color: white;"`;
                    
                    temp.sort ( ( a, b ) =>
                    {
                        return ( a.string < b.string ) ? 1 : ( a.string > b.string ) ? -1 : 0;
                    });

                for ( let note of temp ) 
                    document.getElementById ( 'ui-overlay' ).innerHTML += `<div ${cssStyles} ${mouseFunctions} id="ui-node-${note.cell}"></div>`;

                break;

            default:

                console.log ( `${windowId} is not supported by the insertHtmlContent ( ) function!` );
                
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
        let element = document.getElementById ( `${windowId}-window` );

        ////////////////////////////////////////////////////////////////////////
        ////    FUNCTIONS   ////////////////////////////////////////////////////
        
            /**
             * setElementsPosition()    {Method}                Sets the elements position using the align param
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

                element.style.marginLeft = `${( config.dom.window.width  - Number.parseInt ( element.style.width  ) ) * adjust.width}px`;

                element.style.marginTop  = `${( config.dom.window.height - Number.parseInt ( element.style.height ) ) * adjust.height}px`;

                element.style.display    = 'block';
            }

        ////    FUNCTIONS   ////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        ( element.style.display === 'none' ) 
            ? setElementsPosition ( ) 
            : element.style.display = 'none';

        insertHtmlContent ( windowId );
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    MOUSE FUNCTIONS         ////////////////////////////////////////////////////////////////////

    /**
     * mouseOver()              {Method}                    ///// @TODO: [description] /////
     * @param                   {type} uiElement            Object corresponding UI element
     */
    function mouseOver ( uiElement )
    {
        document.getElementById ( uiElement.id ).style.setProperty ( 'box-shadow', 'inset 0px 0px 10px 2px #fff' );

        document.body.style.cursor = 'cell';
    }

    /**
     * mouseOut()               {Method}                    ///// @TODO: [description] /////
     * @param                   {type} uiElement            Object corresponding UI element
     */
    function mouseOut  ( uiElement )
    {
        document.getElementById ( uiElement.id ).style.setProperty ( 'box-shadow', 'none' );

        document.body.style.cursor = 'default';
    }

    /**
     * mouseDown()              {Method}                    Defines the beginner of a straight line
     * @param                   {Object} uiElement          Object corresponding UI element
     */
    function mouseDown ( uiElement ) 
    { 
        [ config.mouse.down, config.mouse.start] = [ true, getUiNode ( uiElement ) ] 
    }

    /**
     * mouseUp()                {Method}                    Defines the ending of a straight line 
     * @param                   {Object} uiElement          Object corresponding UI element
     */
    function mouseUp   ( uiElement )
    {
        [ config.mouse.down, config.mouse.end ] = [ false, getUiNode ( uiElement ) ]

        let object = { line: [ config.mouse.start, config.mouse.end ], stroke: { type: 1, color: '0, 0, 0', alpha: 1, width: 1 } }

        linePushPop ( object );

        console.warn ( fretboard.lines );
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////    BINDINGS                ////////////////////////////////////////////////////////////////////

    /**
     * setTimeout()             {Event}                     Loads specific UI functions after DOM is loaded
     */
    setTimeout ( ( ) =>
    {
        document.getElementById ( 'clear-canvas' ).addEventListener ( "click", () => clearCanvas ( 1 ) );

        document.getElementById ( 'about' ).addEventListener ( "click", ( ) => showWindow ( 'about' ) );

        insertHtmlContent ( 'ui-overlay' );
    }, 
    500 );

    /**
     * EventListener()          {Event}                     Window scroll event listener
     */    
    window.addEventListener ( "scroll", setScrollWidth );

    /**
     * EventListener()          {Event}                     Mouse move event listener
     */
    window.addEventListener ( "mousemove", function ( event ) 
    {   
        showSavedState ( 1 );

        if ( config.mouse.down )
        {
            let start = getCoordinatesFromCell ( config.mouse.start );

            let end   = getMouseCoordinates    ( event );

            drawLine ( start.x, end.x, start.y, end.y, { type:  1, width: 5, color: config.colors.name.white, alpha: 0.8 } );
        }
    });
