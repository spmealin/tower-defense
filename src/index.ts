// There's nothing of interest in this file.
//If you are looking for the main entry-point, go to App.ts and look for the main() function.

import { main } from "./App";
import reportWebVitals from "./reportWebVitals";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    if (root) {
        main(root);
    } else {
        /* eslint-disable-next-line no-alert */
        alert("No root element was found, the application will not start.");
    }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
