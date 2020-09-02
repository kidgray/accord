import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// COMPONENTS & PAGES
import RegisterPage from '../pages/register/register-page.component.jsx';
import NotFoundPage from '../pages/not-found/not-found-page.component.jsx';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" />
                <Redirect exact from="/" to="/login" />
                <Route exact path="/register" component={RegisterPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;