import React from 'react';
import ReactDOM from 'react-dom';

// STYLES
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import './styles/styles.scss';

const App = () => {
    return (
        <div>
            <h1>Hello from React!</h1>
        </div>
    )
};

ReactDOM.render(<App />, document.getElementById('root'));