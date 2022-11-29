/**
 * requireJS()				{Method}					Used to load and execute JavaScript file.
 * @param 					{string}   file 			JS file name
 * @param 					{function} callback 		Subscribe to get notified when script file is loaded
 */
function requireJS ( file, callback )
{
    var script     = document.createElement ( "script" );                       // create script element

        script.src = file;

    if ( callback )																// monitor script loading ... IE < 7, does not support onload
    {
        script.onreadystatechange = function ( )
        {
            if ( script.readyState === "loaded" || script.readyState === "complete" )
            {
                script.onreadystatechange = null;								// no need to be notified again

                callback();														// notify user
            }
        };

        script.onload = function()												// other browsers
        {
            callback();
        };
    }

    document.documentElement.firstChild.appendChild ( script );					// append and execute script
}