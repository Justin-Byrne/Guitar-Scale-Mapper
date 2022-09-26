# Changelog
All notable changes to this project will be documented in this file.

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

[1.3.36]: 2022-09-26 [CURRENT REVISION]

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