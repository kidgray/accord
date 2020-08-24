import React from 'react';
import ReactDOM from 'react-dom';

// STYLES
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import './styles/styles.scss';

// COMPONENTS & PAGES
import ApolloChatApp from './components/index.jsx';

ReactDOM.render(<ApolloChatApp />, document.getElementById('root'));