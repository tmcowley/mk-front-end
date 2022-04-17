# mirrored-keyboard

Third-Year Project: The predictive mirrored keyboard

## About the Project

This project aims to design and implement a typing system suitable for one-handed use on a standard QWERTY keyboard.

Our technique bisects the keyboard into an active and an inactive section: these can be the left and right keyboard
halves. Each alphabetic character from the inactive half will be symmetrically mapped to the active half, according to
hand symmetry. 

## About This Component

The front-end component, build with React, displays the application user-interface. 
It allows inputs to our keyboard algorithm, these being sentences in half, or full form. 
This component calls back-end APIs to process sentences, query sentence prompts, and record metrics.

## Launching the Front-End Component

To build and run: <br />

```
npm install; npm run build; npm start
```

To test: <br />

```
npm test
```

## Front-End Technical Configuration

- [TypeScript](https://www.typescriptlang.org/)
- [React JS](https://reactjs.org/)

## Notices

Licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
<br />
This allows commercial and personal use while preventing the distribution of closed source versions.
