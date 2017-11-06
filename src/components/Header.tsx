import * as React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <div style={{width:"800px", margin:"0 auto"}}>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" to="/">Home</Link>
                </li>
            </ul>
        </div>
    );
}