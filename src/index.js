import JSONFormatter from 'json-formatter-js'

import { H5P } from 'h5p-standalone'; // ES6

// const { H5P } = require('h5p-standalone'); AMD
// const { H5P:standAloneH5p } = H5PStandalone; // object destructuring
// <script src="node_modules/h5p-standalone/dist/main.bundle.js"> // Global include

window.loadH5p = (h5pPath = "https://quiznextpublic.s3.ap-south-1.amazonaws.com/h5p/japan-culture")=>{
    const el = document.getElementById('h5p-container');
    el.innerHTML = ""
    const options = {
        h5pJsonPath: h5pPath,
        librariesPath: './h5p-folder',
        contentJsonPath: h5pPath,
        frameJs: './h5p-standalone/dist/frame.bundle.js',
        frameCss: './h5p-standalone/dist/styles/h5p.css',
    };

    const h5p = new H5P(el, options);
    console.log(h5p);

    let xpaiEvents = [];
    let xIndex = 0;
    let xMax = 5;
    const appendToEvent = data => {
        xpaiEvents[xIndex % xMax] = data;
        xIndex = (xIndex + 1) % xMax;
    }
    const formatter = new JSONFormatter(xpaiEvents);
    formatter.openAtDepth(3);
    console.log(formatter);
    // document.getElementById("xpai").appendChild(formatter.render());
    const clearxAPiInterval = setInterval(() => {
        if (window.H5P) {
            window.H5P.externalDispatcher.on('xAPI', function (event) {
                console.log(event.data.statement);
                const { actor, verb, object } = event.data.statement;
                appendToEvent({ "Actor": actor.account.name, "verb": verb.id, "object": object.objectType });
                setTimeout(() => {
                    // formatter.json = xpaiEvents;
                    formatter.openAtDepth(2);
                }, 500);
            });
            console.log("Cleared the interval")
            clearInterval(clearxAPiInterval);
        }
        else {
            console.log("not cleared the interval")
        }

    }, 1000);
}