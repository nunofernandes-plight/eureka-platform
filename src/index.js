import React from 'react';
import ReactDOM from 'react-dom';
import './frontend/index.css';
import App from './frontend/App';
import registerServiceWorker from './frontend/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
