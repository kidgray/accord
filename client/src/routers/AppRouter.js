import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// COMPONENTS & PAGES
import HomePage from '../pages/home/home-page.component.jsx';
import LoginPage from '../pages/login/login-page.component.jsx';
import RegisterPage from '../pages/register/register-page.component.jsx';
import NotFoundPage from '../pages/not-found/not-found-page.component.jsx';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/home' component={HomePage} />
                <Redirect exact from="/" to="/home" />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;