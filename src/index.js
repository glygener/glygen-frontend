import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {GLYGEN_BASENAME} from "./envVariables";

/**
 * Entry path to Glygen. Renders Glygen App.
 */

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Router basename={GLYGEN_BASENAME} forceRefresh={true}><App /></Router>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
