import React from 'react';
import ReactDOM from 'react-dom';
import './frontend/index.css';
import registerServiceWorker from './frontend/registerServiceWorker';
import ReduxInit from './frontend/ReduxInit.js';

ReactDOM.render(<ReduxInit />, document.getElementById('root'));
registerServiceWorker();
