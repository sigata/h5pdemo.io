// import { H5P } from 'h5p-standalone'; // ES6
// const { H5P } = require('h5p-standalone'); AMD
const { H5P:standAloneH5p } = H5PStandalone; // object destructuring
// <script src="node_modules/h5p-standalone/dist/main.bundle.js"> // Global include

const el = document.getElementById('h5p-container');
const options = {
    h5pJsonPath: './h5p-folder',
    frameJs: './h5p-standalone/dist/frame.bundle.js',
    frameCss: './h5p-standalone/dist/styles/h5p.css',
};

const h5p = new standAloneH5p(el, options);
console.log(h5p);

let xpaiEvents = [];
let xIndex = 0;
let xMax = 5;
const appendToEvent = data => {
    xpaiEvents[xIndex % xMax] = data;
    xIndex = (xIndex + 1)  % xMax;
}
const formatter = new JSONFormatter(xpaiEvents);
formatter.openAtDepth(3);
console.log(formatter);
document.getElementById("xpai").appendChild(formatter.render());
window.H5P.externalDispatcher.on('xAPI', function (event) {
    console.log(event.data.statement);
    const { actor,verb,object } = event.data.statement;
    appendToEvent({ "Actor": actor.account.name, "verb": verb.id, "object": object.objectType });
    setTimeout(() => {
        // formatter.json = xpaiEvents;
        formatter.openAtDepth(2);
    }, 500);
  });