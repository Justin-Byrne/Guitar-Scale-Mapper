# Changelog
All notable changes to this project will be documented in this file.

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

[1.1.14]: 2022-09-03 [CURRENT REVISION]
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