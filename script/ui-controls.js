function main ( )
{
    populateMenu ( 'Scale', trimObject ( tone.scale, 2 ) );

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
    let mainMenu = document.querySelector( '#settings ul' );

    let temp     = mainMenu.innerHTML;

    ////////////////////////////////////////////////////////////////////////////

    mainMenu.innerHTML = '';

    title = title.toLowerCase ( );

    ////////////////////////////////////////////////////////////////////////////
    ////    FUNCTIONS    ///////////////////////////////////////////////////////

    /**
     * getMenuMaster()          {Method}                    Returns the HTML for the master menu item
     * @return                  {string}                    HTML for the master menu item 
     */
    function getMenuMaster ( )
    {
        return `<!-- ${title} -->` +
               `<li class="has-children">` +
                   `<a href="#">` +
                       `<label class="label" for="${title}-settings">${title.toTitleCase ( )}</label>` +
                   `</a>` +
                `<ul>`;
    }

    /**
     * startMenu()              {Method}                    Returns the HTML for a menu item
     * @param                   {string} key                Key used to denote this menu item
     * @return                  {string}                    HTML for a menu item
     */
    function startMenu ( key )
    {
        key = key.toLowerCase   ( );

        return `<!-- ${title}-${key} -->` +
               `<li class="has-children">` +
                   `<a href="#">` +
                       `<label class="label" for="${title}-${key}">${key.toTitleCase ( )}</label>` +
                   `</a>` +
                   `<ul>`;
    }

    /**
     * endMenu()                {Method}                    Returns closing HTML brackets of a previously embedded menu item
     * @param                   {number} depth              Depth of the menu items to close
     * @return                  {string}                    HTML of closing brackets
     */
    function endMenu ( depth )
    {
        let result = '';

        if ( depth > 0 )
        {
            for ( let i = 0; i < depth; i++ )
            {
                result += '</li></ul>';
            }
        }

        return result;
    }

    /**
     * createControl()          {Method}                    Returns the HTML for a input control
     * @param                   {string} key                Key used to denote this input control
     * @param                   {string} head               Head used to denote this input control
     * @return                  {string}                    HTML of an input control
     */
    function createControl ( key, head = undefined )
    {
        let header = ( head != undefined )
                         ? `${title}-${head}`
                         : title;

            header = header.toLowerCase ( );
            key    = key.toLowerCase    ( );

        return `<!-- ${header}-${key} -->` +
               `<li>` +
                   `<a href="#">` +
                       `<input type="checkbox" id="${header}-${key}-checkbox" class="${header}-${key}-settings">` +
                       `<label class="label" for="${header}-${key}-checkbox">${key.toTitleCase ( )}</label>` +
                   `</a>` +
               `</li>`;
    }

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

    ////    FUNCTIONS    ///////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    let keys      = Object.keys ( flatten ( object ) );
    let subMenu   = new Array ( );

    let count     = 0;
    let lastLevel = 0;

    for ( let key of keys )
    {
        let prevDepth  = getPseudoDepth ( keys [ count - 1 ] );
        let thisDepth  = getPseudoDepth ( keys [ count     ] );

        let prevValues = splitValue    ( keys [ count - 1 ], '.' );
        let thisValues = splitValue    ( keys [ count     ], '.' );

        let maxValue = ( thisValues != undefined )
                           ? thisValues.length
                           : 0; 

        if ( count == 0 || thisDepth == 0 )
        {
            if ( thisDepth == 0 )
            {
                subMenu.push ( createControl ( key ) );
            }
            else
            {
                for ( let i = 0; i < thisValues.length; i++ )
                {
                    let thisValue = thisValues[i];
                    let level     = i + 1;

                    if ( i != ( maxValue - 1 ) )
                    {
                        subMenu.push ( startMenu ( thisValue ) );

                        lastLevel = level;
                    }
                    else
                    {
                        if ( lastLevel > level )
                        {
                            subMenu.push ( endMenu ( lastLevel - level ) );
                        }

                        subMenu.push ( createControl ( thisValue ) );

                        lastLevel = level;
                    }
                }
            }
        }
        else
        {
            for ( let i = 0; i < thisValues.length; i++ )
            {   
                let thisValue = thisValues[i];
                let level     = i + 1;

                if ( prevDepth == 0 && i == 0 )
                {
                    subMenu.push ( startMenu ( thisValue ) );

                    lastLevel = level;

                    continue;
                }

                if ( i == ( maxValue - 1 ) )
                {
                    if ( lastLevel > level )
                    {
                        subMenu.push ( endMenu ( lastLevel - level ) );
                    }

                    subMenu.push ( createControl ( thisValue ) );

                    lastLevel = level;
                }
                else
                {
                    let prevValue = prevValues[i];

                    if ( thisValue == prevValue )
                    {
                        continue;
                    }
                    else
                    {
                        if ( lastLevel > level )
                        {
                            subMenu.push ( endMenu ( lastLevel - level ) );
                        }

                        subMenu.push ( startMenu ( thisValue ) );

                        lastLevel = level;
                    }
                }
            }
        }

        count++;
    }

    subMenu.push    ( endMenu ( lastLevel ) );
    
    subMenu.unshift ( getMenuMaster ( ) );
    
    subMenu.push    ( endMenu ( 1 ) );

    ////    RESULT   ///////////////////////////////////////////////////////////

    mainMenu.innerHTML = subMenu.join ( '' ) + temp;
}

/**
 * trimObject()             {Method}                    Trims the maximum values (rtl) of the object passed
 * @param                   {Object} object             Object to trim
 * @param                   {number} trim               Amount to trim
 * @return                  {Object}                    Object trimmed of its maximum values
 */
function trimObject ( object, trim )
{
    let temp    = new Array ( );

    let prevKey = undefined;

    function checkRedudancy ( prevValue, currValue )
    {
        let regex = '\\w+';

        let append = '';

        for ( let i = 1; i <= prevValue.countChar ( '.' ); i++ )
        {
            append += '\\.\\w+';
        }

        regex = new RegExp ( `${regex}${append}` );

        if ( regex.test ( currValue ) )
        {
            temp.pop ( );
        }
    }

    function trimElements ( object, trim, rootKey = undefined )
    {
        Object.entries ( object ).forEach ( ( [ key, element ] ) => 
        {
            if ( key.length > trim )
            {
                key = ( rootKey != undefined )
                          ? `${rootKey}.${key}`
                          : key;
            }

            if ( prevKey != undefined && ( key.countChar ( '.' ) > prevKey.countChar ( '.' ) ) )
            {
                checkRedudancy ( prevKey, key );    
            }

            temp.push ( key );

            prevKey = key;

            if ( typeof element == 'object' )
            {
                trimElements ( element, trim, key );
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

document.getElementById ( 'clear-canvas' ).addEventListener ( "click", function ( )
{
    clearCanvas ( );
});

document.getElementById ( 'about' ).addEventListener ( "click", function ( )
{
    showWindow ( 'about' );
});