import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './Main';

const App = (): JSX.Element  => (
    <div>
        {/* Header Here */}
        <main>
            <Switch>
                <Route exact path='/' component={Main} />
            </Switch>
        </main>
    </div>
);

export default App;
