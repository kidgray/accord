import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// COMPONENTS & PAGES
import MenuBar from '../components/menu-bar/menu-bar.component.jsx';
import HomePage from '../pages/home/home-page.component.jsx';
import LoginPage from '../pages/login/login-page.component.jsx';
import RegisterPage from '../pages/register/register-page.component.jsx';
import NotFoundPage from '../pages/not-found/not-found-page.component.jsx';

// UTILS
import DynamicRoute from '../utils/DynamicRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <MenuBar />
            <Switch>
                <DynamicRoute exact path='/home' component={HomePage} authenticated />
                <Redirect exact from="/" to="/home" />
                <DynamicRoute exact path="/login" component={LoginPage} guest />
                <DynamicRoute exact path="/register" component={RegisterPage} guest />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;