function main ( )
{
    populateMenu ( 'Scale', trimObject ( tone.scale, 2 ) );

    // console.log ( populateMenu ( 'Tuning', trimObject ( tone.tuning, 1 ) ) );

    // createComboBox ( 'Tuning', tone.tuning );
    // createComboBox ( 'Tonic', tone.notes );
}

main ();

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            FUNCTIONS                                               ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////////////////
    ////    FUNCTIONS    ///////////////////////////////////////////////////////

    /**
     * getPseudoDepth()         {Method}                    Returns the depth of the value passed
     * @param                   {string} value              Value to measure the depth of
     * @return                  {number}                    Depth of the value passed
     */
    function getPseudoDepth ( value )
    {
        return ( value != undefined )
                   ? ( value.match ( /\./g ) || [] ).length
                   : undefined;
    }

    /**
     * splitValue()             {Method}                    Returns an array of the value split by the passed delimiter
     * @param                   {string} value              Value to split
     * @param                   {string} delimiter          Delimiter used to split the passed value
     * @return                  {Array}                     Array containing each split value
     */
    function splitValue ( value, delimiter )
    {
        return ( value != undefined )
                   ? ( value.includes ( delimiter ) ) 
                         ? value.split ( delimiter )
                         : undefined
                   : undefined; 
    }

    /**
     * generateMenuItem()       {Method}                    Populates the 'subMenu' array with the appropriate HTML code for the flyout menu
     * @param                   {string} type               Menu item type
     * @param                   {string} key                Current key to denote the item
     * @param                   {string} head               Key of the previous menu item(s) to be perpended a control
     * @param                   {number} depth              Present depth of the item
     * @return                  {string}                    HTML code
     */
    function generateMenuItem ( type, key = undefined, head = undefined, depth = undefined )
    {
        let result = undefined;

        switch ( type )
        {
            case 'master':

                result = `<!-- ${title} -->` +
                         `<li class="has-children" id="menu-${title}">` +
                             `<a href="#">` +
                                 `<label class="label" for="${title}-settings">${( title.includes ( '_' ) ) ? title.replace( /_/g, ' ' ).toTitleCase ( ) : title.toTitleCase ( )}</label>` +
                             `</a>` +
                             `<ul>`;

                break;

            case 'menu':

                key    = key.toLowerCase   ( );

                result = `<!-- ${title}-${key} -->` +
                         `<li class="has-children">` +
                             `<a href="#">` +
                                 `<label class="label" for="${title}-${key}">${key.toTitleCase ( )}</label>` +
                             `</a>` +
                             `<ul>`;

                break;

            case 'menuEnd':

                result = '';

                if ( depth > 0 )
                {
                    for ( let i = 0; i < depth; i++ )
                    {
                        result += '</ul></li>';
                    }
                }

                break;

            case 'control':

                let controlTitle = ( key.includes ( '_') ) ? key.replace ( /_/g, ' ' ) : key

                let header       = ( head != undefined )   ? `${title}-${head}`        : title;

                let value        = `${header}-${key}`.replace ( /\-/g, '.' );

                    header = header.toLowerCase ( );
                    key    = key.toLowerCase    ( );

                    result = `<!-- ${header}-${key} -->` +
                             `<li>` +
                                 `<a href="#">` +
                                     `<input type="checkbox" id="${header}-${key}-checkbox" class="${header}-control" value='${value}'>` +
                                     `<label class="label" for="${header}-${key}-checkbox">${controlTitle.toTitleCase ( )}</label>` +
                                 `</a>` +
                             `</li>`;

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
        
        let head  = ( regex.test ( lastMenu ) )
                        ? regex.exec ( lastMenu )[1]
                        : undefined;

        let HTML  = generateMenuItem ( type, key, head );

        ////////////////////////////////////////////////////////////////////////////////////////////

        ( prevLevel == level )
            ? persistentLevel++
            : [ persistentLevel, columns ] = [ 0, 2 ];

        if ( persistentLevel >= 12 )
        {
            let index = subMenu.indexOf ( lastMenu );

            let menu  = ( columns < 3 )
                            ? subMenu[index].replace ( '<ul>', `<ul style="columns: ${columns};">` )
                            : subMenu[index].replace ( `<ul style="columns: ${columns - 1};">`, `<ul style="columns: ${columns};">` );

                subMenu[index] = lastMenu = menu;

                [ persistentLevel, columns ] = [ 0, columns + 1 ]
        }

            lastMenu  = ( /<li\sclass=\"has-children\">/.test ( HTML ) ) ? HTML  : lastMenu;

            lastLevel = ( depth > 0 )                                    ? level : lastLevel;
    }

    ////    FUNCTIONS    ///////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////   

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
                depth:  getPseudoDepth ( keys [ count     ] ),
                lone:   undefined,
                all:    splitValue ( keys [ count ], '.' ),
                length: undefined
            },
            previous:
            {
                depth:  getPseudoDepth ( keys [ count - 1 ] ),
                lone:   undefined,
                all:    splitValue ( keys [ count - 1 ], '.' )
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
    
    generateMenuItem ( 'menuEnd', undefined, undefined, lastLevel );
    
    generateMenuItem ( 'master' );

    ////    RESULT   ///////////////////////////////////////////////////////////

    let mainMenu = document.querySelector( '#settings ul' );

    let temp     = mainMenu.innerHTML;

        mainMenu.innerHTML = subMenu.join ( '' ) + temp + '</li>';

    ////////////////////////////////////////////////////////////////////////////

    return subMenu.join ( '' );
}

/**
 * trimObject()             {Method}                    Trims the maximum values (rtl) of the object passed
 * @param                   {Object} object             Object to trim
 * @param                   {number} trim               Amount to trim
 * @return                  {Object}                    Object trimmed of its maximum values
 */
function trimObject ( object, trim )
{
    let temp        = new Array ( );

    let previousKey = undefined;

    /**
     * checkRedudancy()         {Method}                    Identifies whether the current value is present within the previous value 
     * @param                   {Object} value              Key value data
     * @param                   {number} value.current      Value of the current key
     * @param                   {number} value.previous     Value of the present key
     */
    function checkRedudancy ( value = { current, previous } )   // previousValue, currentValue
    {
        let regex = '\\w+';

        let append = '';

        for ( let i = 1; i <= value.previous.countChar ( '.' ); i++ )
        {
            append += '\\.\\w+';
        }

        regex = new RegExp ( `${regex}${append}` );

        if ( regex.test ( value.current ) )
        {
            temp.pop ( );
        }
    }

    /**
     * trimElements()           {Method}                    Trim elements in accordance with the trim param
     * @param                   {Object} object             Object to trim
     * @param                   {number} trim               Value to trim against : rtl
     * @param                   {string} rootKey            Root key
     */
    function trimElements ( object, trim, rootKey = undefined )
    {
        Object.entries ( object ).forEach ( ( [ currentKey, element ] ) => 
        {
            if ( currentKey.length > trim )
            {
                currentKey = ( rootKey != undefined )
                                 ? `${rootKey}.${currentKey}`
                                 : currentKey;
            }

            if ( previousKey != undefined && ( currentKey.countChar ( '.' ) > previousKey.countChar ( '.' ) ) )
            {
                checkRedudancy ( { current: currentKey, previous: previousKey } );    
            }

            temp.push ( currentKey );

            previousKey = currentKey;

            if ( typeof element == 'object' )
            {
                trimElements ( element, trim, currentKey );
            }
        });
    }

    trimElements ( object, trim );

    let result = {};

    for ( let key of temp )
    {
        if ( key.length > 2 )
        {
            result[`${key}`] = 0;
        }
    }

    return result;
}

/**
 * createComboBox           {Method}                    Creates an input control (combo box) based on the passed object
 * @param                   {string} title              Title to be attributed to the created combo box
 * @param                   {Object} object             Object to populate the created combo box
 */
function createComboBox ( title, object )
{
    let keys    = Object.keys ( object );

    let options = '';   

    for ( let i = 0; i < keys.length; i++ )
    {
        options += `<a id="${keys[i]}" class="dropdown-item" href="#">${keys[i]}</a>\n`;
    }

    // Insert: Combo Box
    document.getElementById ( 'controls' ).innerHTML += 
        `<div class="btn-group dropup show">`   +
            `<button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">` +
                title                           +
            `</button>`                         +
            `<div class="dropdown-menu">`       +
                `${options}`                    +
            `</div>`                            +
        `</div><!-- .btn-group -->`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////                            GENERIC UI ALGORITHMS                                   ////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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
                    `<div id="program-name"><b>Program:</b> ${config.about.Library}</div>`   +
                    `<div id="version-number"><b>Version:</b> ${config.about.Version}</div>` +
                    `<div id="updated-last"><b>Updated:</b> ${config.about.Updated}</div>`   +
                    `<div id="about-copyright">${config.about.Copyright}, all rights reserved</div>`;

                config.windows.about = true; 
            }

            break;

        case 'properties':

            if ( !config.windows.properties )
            {
                config.windows.properties = true; 
            }

            break;

        default:

            console.log(`${windowId} is not supported by the insertHtmlContent() function!`);
            
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
    let element = document.getElementById(`${windowId}-window`);

    ( element.style.display == 'none' )
        ? setElementsPosition ( )
        : element.style.setProperty ( 'display', 'none' );

    function setElementsPosition ( )
    {
        element.style.setProperty ( 'display', 'block' );

        switch ( align )
        {
            case 'top':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) ) / 2}px` );
                element.style.setProperty ( 'margin-top',  '0px' );

                break;

            case 'right':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) )}px` );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) ) / 2}px` );

                break;

            case 'bottom':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) ) / 2}px` );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) )}px` );

                break;

            case 'left':

                element.style.setProperty ( 'margin-left', '0px' );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) ) / 2}px` );

                break;

            case 'center':

                element.style.setProperty ( 'margin-left', `${( config.domWindow.width  - parseInt ( element.style.width  ) ) / 2}px` );
                element.style.setProperty ( 'margin-top',  `${( config.domWindow.height - parseInt ( element.style.height ) ) / 2}px` );

                break;
        }
    }

    insertHtmlContent ( windowId );
}

////////        UI Listeners        ////////

// for (var i = 0; i <= inputArray.settings.class.length - 1; i++)
// {
//     document.querySelectorAll(inputArray.settings.class[i]).forEach(item =>
//     {
//         item.addEventListener('click', event =>
//         {
//             setSettings(item);
//         });
//     });
// }

document.getElementById ( 'clear-canvas' ).addEventListener ( "click", function ( )
{
    clearCanvas ( );
});

document.getElementById ( 'about' ).addEventListener ( "click", function ( )
{
    showWindow ( 'about' );
});