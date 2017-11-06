import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './Main';
import BookView from './BookView';
import Header from './Header';

const App = (): JSX.Element  => (
    <div>
         <Header />
        <main>
            <Switch>
                <Route exact path='/' component={Main} />
                <Route exact path='/book/:id' component={BookView} />
            </Switch>
        </main>
    </div>
);

export default App;
