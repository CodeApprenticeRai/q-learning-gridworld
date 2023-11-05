import React from 'react';

import './AppControls.css';

let  AppControls = () => {
    return(<div className='app-controls'>
        <button>Reset / Initialize</button>
        <button>{"<<"}</button>
        <button>{">>"}</button>
    </div>)
}

export default AppControls;