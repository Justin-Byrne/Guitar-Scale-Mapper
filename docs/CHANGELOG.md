# Changelog
All notable changes to this project will be documented in this file.

## [1.7.90] - 2022-11-15
### Added
- lines array within fretboard object to save drawn lines
- canvasSave() to save the canvas to the saveState variable
- showSavedState() to clears the canvas, and replaces it with an image
- setScrollWidth() to set the scroll width
- getPixelValueFromStyle() to returns the numeric pixel value from a specific style attribute
- getCoordinatesFromCell() to get coordinates of a specific note via it's cell number
- getMouseCoordinates() to return the mouses current coordinates relative to its position
- getUiNode() to returns node value from the rendered document object corresponding to a note
- toggleCheckbox() to toggle whether the passed input[type='checkbox'] is checked
- comboBoxClick() to handle combo box click events
- mouseOver() to handle mouse over events for UI elements
- mouseOut() to handle mouse out events for UI elements
- mouseDown() to handle mouse down events for UI elements
- mouseUp() to handle mouse up events for UI elements
- timeout to load specific UI functions after DOM is loaded

### Changes
- modified config.mouse to include offset values
- expanded drawLine() to include dashed lines
- getPseudoDepth() to getDepth()
- refactored generateMenuItem()
- expanded insertHtmlContent() to include content for the 'ui-overlay'
- refactored setElementsPosition()

### Removed
- removed ui-underlay

## [1.6.80] - 2022-11-12
### Added
- added Event Listener for when the DOM content is loaded

### Changes
- migrated requireJS() to its own file: dom-tools.js
- migrated various generic functions for obtaining music note data to: musicNote.lib.js
- changed setupEnvironment() to setDom()
- moved insertUIElements() & toggleCheck() to ui-controls.js
- refactored clearCanvas()
- refactored configuration object by migrating the colors, tone, and settings objects
- refactored displayFretboardNotes()
- refactored displayFretNumbers()
- refactored displayNoteMarkers()
- refactored displayScaleNotes()
- refactored displayText()
- refactored drawCircle()
- refactored drawFretboard()
- refactored drawFretboardFrets()
- refactored drawLine()
- refactored drawRectangle()
- refactored trimObject()
- refactored fretboard object
- changed generateScale() to getScale()
- changed mapFretboardNotes() to getFretboardNotes()

### Removed
- line, circle, and object default settings from configuration object
- removed Array.prototype.indexOfArray()
- removed Number.prototype.convert2digStr()
- removed drawModeOutlines()
- removed generateNote()
- removed setNextNote()
- removed mapOpenNotes()
- removed parseFull2Clean()
- removed parseFull2Strings()

## [1.5.60] - 2022-11-04
### Added
- requireJS() to load and execute JavaScript file

### Changes
- refactored populateMenu() to optimize core processes

## [1.5.58] - 2022-11-03
### Changes
- refactored populateMenu() to include 'flyout menu' columns support 

## [1.5.57] - 2022-11-01
### Added
- Object.prototype.getDepth() to return the maximum depth of an object
- String.prototype.toTitleCase() to return a title case string
- String.prototype.countChar() to return count of character passed via param
- dynamic sizing of various DOM elements added to setupEnvironment()
- populateMenu() to populate the 'flyout' menu with the object passed
- trimObject() to trim the maximum values (rtl) of the object passed
- createComboBox() to create an input control (combo box) based on the passed object
- added flatten.js to assist in menu generation
- added canvas2svg.js to assist in future SVG generation
- added jquery-3.2.1.slim.min.js for base jquery functionality
- added popper-1.12.9.min.js for menu functionality

### Changed
- moved insertHtmlContent() to ui-controls.js
- moved showWindow() to ui-controls.js
- moved UI Listeners to ui-controls.js

### Removed
- removed mapModes() function
- removed drawFingerBoundingBox() function
- removed drawFingering() function
- removed drawModeOutlines() function

## [1.4.43] - 2022-10-02
### Changed
- expanded fretboard to 24 frets
- expanded notes array under the fretboard array to organize various note array patterns
- refactored & optimized generateNextNote() function
- refactored & optimized mapOpenNotes() function
- refactored & optimized mapFretboardNotes() function
- refactored & optimized mapFretboardNotes() mapModes
- cleaned up drawModeOutlines

### Removed
- removed getNextNote(), getAllNotes(), getPriorNote(), and getLastNote()

## [1.3.36] - 2022-09-26
### Added
- main() function, to hold main procedures
- generateNextNote() to generate the next note 
- getNextNote() to return the next active note
- getPriorNote() to return the prior active note
- getAllNotes() to return all active notes, based on note passed via param
- drawFingerBoundingBox() to draw a bounding box for fingering optimization

### Changed
- refactored getNextNote() between generateNextNote() & getNextNote()
- changed getNote() to generateNote()
- changed setScale() to generateScale()
- getStartNote() to include more functionality
- refactored mapModes() with a more optimized configuration

### Removed
- removed Array.prototype.containsArray() function
- removed Array.prototype.pushPop() function

## [1.3.23] - 2022-09-17
### Added
- settings constant to contain unique scale settings
- getNote() to get a single (open) note, with regards to the instruments current tuning
- mapModes() to map all available modes
- drawModeFingering() to draw lines between each mode's fingering
- drawModeOutlines() to draw lines around each mode's fingering
- drawFretboardFrets() to draw thicker frets across fretboard
- displayFretNumbers() to display fret numbers at the bottom of the fretboard

### Changed
- Consolidated all colors into constant colors
- fretboardNotes variable converted into a 'notes' array, in settings; to store the same values
- moved 'scale' variable into settings constant
- renamed generateOpenNotes() to mapOpenNotes()
- renamed generateFretboardNotes() to mapFretboardNotes()

## [1.1.14] - 2022-09-03
### Added
- settings object within 'config' object, for HTML5 canvas API drawing properties
- fretboard object to retain basic fretboard data; i.e., size(s), strings, frets, etc...
- tone object to retain basic note and scale information; i.e., notes, tuning, scales, etc...
- drawFretboard() to draw fretboard using HTML5 canvas API calls
- generateOpenNotes() to generate open notes for fretboard
- generateFretboardNotes() to generate fret notes for fretboard
- setScale() to set scale notes, to be used through desired scale
- getNextNote() to return the next note 
- displayFretboardNotes() to display notes on the fretboard
- drawRectangle() to draw a simple rectangle
- displayText() to display text
- UnitTests.js for unit tests

### Changed
- modified 'div#ui-overlay' to 'div#fretboard'
- updated 'colorArray' values

### Removed
- 'Guitar Scale Mapper.sublime-project' and 'Guitar Scale Mapper.sublime-workspace'

## [1.0.0] - 2022-01-05
### Added
- Directory structure
- CHANGELOG.md
- README.md
- index.html
- styles; scss and css
- main.js

---

[1.7.90]: 2022-11-15 [CURRENT REVISION]

[1.6.80]: 2022-11-12 [5c80247](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/5c80247) major refactoring of whole program: see changelog

[1.5.60]: 2022-11-04 [e5e8582](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/e5e8582) added requireJS() function, and refactored populateMenu()

[1.5.58]: 2022-11-03 [aaf9e22](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/aaf9e22) refactored populateMenu() to include 'flyout menu' columns support

[1.5.57]: 2022-11-01 [d9caf51](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/d9caf51) implemented dynamic flyout menu functionality; general refactoring

[1.4.43]: 2022-10-02 [6d23501](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/6d23501) optimized core algorithms to locate individual modes

[1.3.36]: 2022-09-26 [4933e69](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/4933e69) general refactoring

[1.3.23]: 2022-09-17 [3ddbfa8](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/3ddbfa8) incorporated mode mapping and drawing; general cleanup of settings

[1.1.14]: 2022-09-03 [95cb934](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/95cb934) incorporated various basic HTML5 canvas calls to render fretboard and notes; general cleanup

[1.0.0]: 2022-01-05 [0169cd4](https://github.com/Justin-Byrne/Guitar-Scale-Mapper/commit/0169cd4) initial upload

---

## Types of changes
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## Copyright

![Byrne-Systems](http://byrne-systems.com/content/static/cube_sm.png)

==Byrne-Systems © 2022 - All rights reserved.==