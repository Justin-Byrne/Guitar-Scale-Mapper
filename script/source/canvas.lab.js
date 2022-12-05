( ( window ) =>
{
    'use strict';

    /**
     * _dataTypes                                                   User defined data-types
     * @type                        {Object}
     */
    let _dataTypes =
    [
        function Config ( )
        {
            return class Config extends Array
            {
                constructor ( )
                {
                    super ( );
                }

                addToDOM ( ) { }
            }
        },
        function Point ( )
        {
            return class Point
            {
                #_x = undefined;
                #_y = undefined;

                constructor ( ) { };

                ////    SETTERS     ////////////////

                    set x ( value )
                    {
                        this.#_x = ( typeof value == 'number' ) ? value : undefined;
                    }

                    set y ( value )
                    {
                        this.#_y = ( typeof value == 'number' ) ? value : undefined;
                    }

                ////    GETTERS     ////////////////

                    get x ( )
                    {
                        return this.#_x;
                    }

                    get y ( )
                    {
                        return this.#_y;
                    }
            }
        },
        function Line  ( )
        {
            return class Line
            {
                start   = new Point ( );
                end     = new Point ( );

                stroke  = undefined;
                shadow  = undefined;
                context = undefined;

                isThere ( line )
                {
                    ////    FUNCTION(S)     ////////

                        let toString  = ( valueA, valueB ) => `${valueA} ${valueB}`;

                    ////    VARIABLES       ////////

                        let thisStart = toString ( this.start.x, this.start.y ), thisEnd = toString ( this.end.x, this.end.y );

                        let lineStart = toString ( line.start.x, line.start.y ), lineEnd = toString ( line.end.x, line.end.y );

                    ////    EXPRESSION      ////////

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
                constructor ( )
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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    GENERIC DATA    ////////////////////////////////////////////////////////////////////////

        /**
         * _settings                                                    Default canvas settings
         * @type                        {Object}
         */
        let _settings =
        {
            visual:
            {
                line:
                {
                    type:    0,
                    color:   '255, 255, 255',
                    alpha:   1,
                    width:   8,
                    shadow:  false
                }
            }
        }

        /**
         * _dom                                                         DOM Elements
         * @type                        {Object}
         */
        let _dom =
        {
            canvases:  { },
            contexts:  { },
            window:
            {
                width:     window.innerWidth  - 18,
                height:    window.innerHeight -  4,
                xCenter: ( window.innerWidth  /  2 ),
                yCenter: ( window.innerHeight /  2 )
            },
            main:
            {
                canvas:  undefined,
                context: undefined
            }
        }

        /**
         * _post()                                                      Post processing data
         * @type                        {Object}
         */
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

        /**
         * _clearCanvas()               {Method}                        Clears the entire canvas element
         * @param                       {string} canvasId               Canvas element identifier
        */
        const _clearCanvas          = ( canvasId )          => app.dom.contexts [ canvasId ].clearRect ( 0, 0, app.dom.canvases [ canvasId ].width, app.dom.canvases [ canvasId ].height );

        /**
         * _setSavedState()             {Method}                        Saves the canvas to the canvas state variable
         * @param                       {string} canvasId               Canvas element identifier
         */
        const _setSavedState        = ( canvasId )          => { app.post.canvas.state = app.dom.canvases [ canvasId ].toDataURL ( ); }

        /**
         * _setShadow()                 {Method}                        Sets & displays shadow under shape
         * @param                       {string} color                  RGB number set for fill; r, g, b
         * @param                       {number} alpha                  Alpha (transparency) number value
         * @param                       {number} blur                   Blur
         * @param                       {Object} offset                 Blur offset
         * @param                       {number} offset.x               X shadow offset
         * @param                       {number} offset.y               Y shadow offset
         * @param                       {HTMLCanvasElement} context     2D canvas context
         */
        const _setShadow            = ( color = '0, 0, 0', alpha = 1, blur = 3, offset = { x: 3, y: 3 }, context = app.dom.main.context ) => [ context.shadowColor, context.shadowBlur, context.shadowOffsetX, context.shadowOffsetY ] =  [ _getRgba ( color, alpha ), blur, offset.x, offset.y ]

        /**
         * _setStrokeType()             {Method}                        Sets stroke type
         * @param                       {number} type                   Solid or Dashed
         * @param                       {Array}  segments               Segment distances
         * @param                       {HTMLCanvasElement} context     2D canvas context
         */
        const _setStrokeType        = ( type, segments = [ 15, 15 ], context = app.dom.main.context ) => ( type ) ? context.setLineDash ( segments ) : context.setLineDash ( [ ] );

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
            if ( typeof ( window.app.settings ) === 'undefined' )

                window.app.settings = _settings;

            else

                for ( let element in _settings )

                    window.app.settings [ element ] = element;
        }

        /**
         * _setCanvases()               {Method}                        Set's primary canvas & canvases within '_dom' object in global context
         * @param                       {string} canvasId               Name of primary canvas
         */
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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    GETTERS     ////////////////////////////////////////////////////////////////////////////

        /**
         * __getRgb()                   {Method}                        Generates RGB() functional notation
         * @param                       {string} color                  Color notation: 'R, G, B'
         * @return                      {type}                          RGB functional notation
         */
        const _getRgb   = ( color )                         => `rgb(${color})`;

        /**
         * _getRgba()                   {Method}                        Generates RGBA() functional notation
         * @param                       {string} color                  Color notation: 'R, G, B'
         * @param                       {number} alpha                  Alpha
         * @return                      {type}                          RGBA functional notation
         */
        const _getRgba  = ( color, alpha )                  => `rgba(${color}, ${alpha})`;

        /**
         * _getFont()                   {Method}                        Generates font functional notation
         * @param                       {string} name                   Name of the font
         * @param                       {number} size                   Size of the font
         * @param                       {string} weight                 Weight of the font
         * @return                      {[type]}                        Font functional notation
         */
        const _getFont  = ( name, size, weight = 'normal' ) => `${weight} ${size}px ${name}`;

        /**
         * _getSavedState()             {Method}                        Clears the canvas, and replaces it with an image; from param
         * @param                       {string} canvasId               Canvas element identifier
         */
        function _getSavedState ( canvasId )
        {
            _clearCanvas ( canvasId );

            if ( document.getElementById ( 'saved-state' ) == null )
            {
                let element = document.createElement ( 'img' );

                    [ element.src, element.id, element.style ] = [ app.post.canvas.state, 'saved-state', 'position: absolute' ];

                    document.getElementById ( canvasId ).parentNode.insertBefore ( element, document.getElementById ( canvasId ).nextElementSibling );
            }
        }

        /**
         * _getLineStroke()             {Method}                        Returns a stroke object for a line's properties
         * @return                      {Object}                        Line stroke based off of app.settings' visual values
         */
        function _getLineStroke ( )
        {
            let stroke = { };

            for ( let prop in app.settings.visual.line )

                stroke[`${prop}`] = app.settings.visual.line [ prop ];

            return stroke;
        }

        /**
         * _getLine()                   {Method}                        Returns a line using stored mouse coordinates
         * @return                      {Line}                          A line with all properties set
         */
        function _getLine ( start, end, shadow = app.settings.visual.line.shadow, context = app.dom.main.context )
        {
            let line = new Line ( );

                [ line.start, line.end, line.stroke, line.context, line.shadow ] = [ start, end, canvasLab.getLineStroke ( ), context, shadow ]

            return line;
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
            ( window [ rootId ] === 'undefined' )

                ? window.alert ( `window.${rootId} is already defined !` )

                : window [ rootId ] [ newElement ] = contents;
        }

        /**
         * _requireJS()                 {Method}                        Used to load and execute JavaScript file.
         * @param                       {string} file                   JS file name
         * @param                       {Method}   callback             Subscribe to get notified when script file is loaded
         */
        function _requireJS ( file, callback )
        {
            var script     = document.createElement ( "script" );               // create script element

                script.src = file;

            if ( callback )                                                     // monitor script loading ... IE < 7, does not support onload
            {
                script.onreadystatechange = function ( )
                {
                    if ( script.readyState === "loaded" || script.readyState === "complete" )
                    {
                        script.onreadystatechange = null;                       // no need to be notified again

                        callback();                                             // notify user
                    }
                };

                script.onload = function()                                      // other browsers
                {
                    callback();
                };
            }

            document.documentElement.firstChild.appendChild ( script );         // append and execute script
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    DRAWING     ////////////////////////////////////////////////////////////////////////////

        /**
         * _drawLine()                  {Method}                        Draws a simple circle
         * @param                       {number}  xStart                X position start
         * @param                       {number}  xEnd                  X position end
         * @param                       {number}  yStart                Y position start
         * @param                       {number}  yEnd                  Y position end
         * @param                       {Object}  stroke                Stroke object containing stoke properties
         * @param                       {number}  stroke.type           Stroke type; 1 (solid) | 2 (dashed)
         * @param                       {string}  stroke.color          Stroke RGB number set for fill; r, g, b
         * @param                       {decimal} stroke.alpha          Stroke alpha (transparency) number value
         * @param                       {decimal} stroke.width          Strokes width
         * @param                       {HTMLCanvasElement} context     2D canvas context
         */
        function _drawLine ( xStart, xEnd, yStart, yEnd, stroke = { type: 0, color: '0, 0, 0', alpha: 1, width: 1 }, shadow = false, context = app.dom.main.context )
        {
            ( shadow ) ? _setShadow ( ) : null;

            context.strokeStyle = _getRgb ( stroke.color );

            context.globalAlpha = stroke.alpha;

            context.lineCap     = 'round';

            context.lineWidth   = stroke.width;

            ////////////////////////////////////////////////////////////////////

            _setStrokeType     ( stroke.type, undefined );

            context.beginPath ( );

            context.moveTo    ( xStart, yStart );

            context.lineTo    ( xEnd, yEnd );

            context.stroke    ( );

            ////////////////////////////////////////////////////////////////////

            ( shadow ) ? context.shadowColor = 'transparent' : null;

            context.globalAlpha = 1;

            // postLineProcessing ( arguments );
        }

        /**
         * drawRectangle()              {Method}                        Draws a simple rectangle
         * @param                       {number}  x                     X - position
         * @param                       {number}  y                     Y - position
         * @param                       {number}  width                 Width of rectangle
         * @param                       {number}  height                Height of rectangle
         * @param                       {Object}  stroke                Stroke object containing stoke properties
         * @param                       {string}  stroke.color          Stroke RGB number set for fill; r, g, b
         * @param                       {decimal} stroke.alpha          Stroke alpha (transparency) number value
         * @param                       {decimal} stroke.width          Strokes width
         * @param                       {Object}  fill                  Fill object containing fill properties
         * @param                       {string}  fill.color            Fill RGB number set for fill; r, g, b
         * @param                       {decimal} fill.alpha            Fill alpha (transparency) number value
         * @param                       {HTMLCanvasElement} context     2D canvas context
         */
        function _drawRectangle ( x, y, width, height, stroke = { color: '255, 255, 255', alpha: 1, width: 4 }, fill = { color: '255, 255, 255', alpha: 0 }, context = app.dom.main.context )
        {
            context.strokeStyle = _getRgba ( stroke.color, stroke.alpha );

            context.fillStyle   = _getRgba (   fill.color,   fill.alpha );

            context.lineWidth   = stroke.width;

            ////////////////////////////////////////////////////////////////////

            context.beginPath ( );

            context.rect      ( x, y, width, height );

            context.stroke    ( );

            context.fill      ( );
        }

        /**
         * _drawCircle()                {Method}                        Draws a simple circle
         * @param                       {number}  x                     X - axis; center
         * @param                       {number}  y                     Y - axis; center
         * @param                       {number}  radius                Circle radius
         * @param                       {Object}  angle                 Angle object containing angle properties
         * @param                       {number}  angle.start           Start angle
         * @param                       {number}  angle.end             End angle
         * @param                       {Object}  stroke                Stroke object containing stroke properties
         * @param                       {string}  stroke.color          Stroke RGB number set for fill; r, g, b
         * @param                       {decimal} stroke.alpha          Stroke alpha (transparency) number value
         * @param                       {decimal} stroke.width          Strokes width
         * @param                       {Object}  fill                  Fill object containing fill properties
         * @param                       {string}  fill.color            Fill RGB number set for fill; r, g, b
         * @param                       {decimal} fill.alpha            Fill alpha (transparency) number value
         * @param                       {boolean} centerDot             Include a center dot
         * @param                       {HTMLCanvasElement} context     2D canvas context
         */
        function _drawCircle ( x, y, radius, angle = { start: 0, end: 2 * Math.PI }, stroke = { color: '255, 255, 255', alpha: 1, width: 6 }, fill = { color: '255, 255, 255', alpha: 0 }, context = app.dom.main.context )
        {
            context.strokeStyle = _getRgba ( stroke.color, stroke.alpha );

            context.fillStyle   = _getRgba (   fill.color,   fill.alpha );

            context.lineWidth   = stroke.width;

            ////////////////////////////////////////////////////////////////////

            context.beginPath ( );

            context.arc       ( x, y, radius, angle.start, angle.end, false );

            context.stroke    ( );

            context.fill      ( );
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    DISPLAY     ////////////////////////////////////////////////////////////////////////////

        /**
         * _displayText()               {Method}                        Display text
         * @param                       {number}  x                     X - position
         * @param                       {number}  y                     Y - position
         * @param                       {string}  text                  Test to display
         * @param                       {number}  fontSize              Font size
         * @param                       {number}  maxWidth              Maximum width of text area
         * @param                       {string}  color                 Fill RGB number set for fill; r, g, b
         * @param                       {decimal} alpha                 Fill alpha (transparency) number value
         * @param                       {HTMLCanvasElement} context     2D canvas context
         */
        function _displayText ( x, y, text, fontSize = 24, maxWidth, color = '0, 0, 0', alpha = 1, context = app.dom.main.context )
        {
            context.font        = _getFont ( 'Roboto', fontSize );

            context.fillStyle   = _getRgb  ( color );

            context.globalAlpha = alpha;

            x = x - ( context.measureText ( text ).width / 1.85 );

            y = y + ( fontSize / 3.5 );

            ////////////////////////////////////////////////////////////////////

            context.fillText ( text, x, y, maxWidth );

            context.globalAlpha = 1;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    LIBRARY     ////////////////////////////////////////////////////////////////////////////

        function library ( )
        {
            let _lib = { };

            ////    SETTERS     ////////////////////////////////////////////////

                _lib.setCanvases    = ( value )                                                     => _setCanvases ( value );

                _lib.setLineShadow  = ( value )                                                     => app.settings.visual.line.shadow = value;

                _lib.setSavedState  = ( canvasId )                                                  => _setSavedState ( canvasId );

                _lib.clearCanvas    = ( canvasId )                                                  => _clearCanvas ( canvasId );

            ////    GETTERS     ////////////////////////////////////////////////

                _lib.getSavedState  = ( canvasId )                                                  => _getSavedState ( canvasId );

                _lib.getLineStroke  = ( )                                                           => _getLineStroke ( );

                _lib.getLine        = ( start, end, shadow, context )                               => _getLine ( start, end, shadow, context );

            ////    ACTIONS     ////////////////////////////////////////////////

                _lib.drawRectangle  = ( x, y, width, height, stroke, fill, context )                => _drawRectangle ( x, y, width, height, stroke, fill, context );

                _lib.drawLine       = ( xStart, xEnd, yStart, yEnd, stroke, shadow, context )       => _drawLine ( xStart, xEnd, yStart, yEnd, stroke, shadow, context );

                _lib.drawCircle     = ( x, y, radius, angle, stroke, fill, context )                => _drawCircle ( x, y, radius, angle, stroke, fill, context );

                _lib.displayText    = ( x, y, text, fontSize, maxWidth, color, alpha, context )     => _displayText ( x, y, text, fontSize, maxWidth, color, alpha, context );

            ////    INITIALIZER     ////////////////////////////////////////////

                _lib.init = function ( canvasId )
                {
                    _setDataTypes      ( );

                    _setSettings       ( );

                    _add2GlobalContext ( 'dom',  _dom  );

                    _add2GlobalContext ( 'post', _post );

                    _lib.setCanvases   ( canvasId );
                }

            return _lib;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////    INITIALIZE       ///////////////////////////////////////////////////////////////////////

        if ( typeof ( window.canvasLab ) === 'undefined' )

            window.canvasLab = library ( );

} ) ( window );
