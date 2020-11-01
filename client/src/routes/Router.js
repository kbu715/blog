import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AppNavbar from '../components/AppNavbar'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import PostCardList from './normalRoute/PostCardList';
import PostWrite from './normalRoute/PostWrite';
import PostDetail from './normalRoute/PostDetail';
import CategoryResult from './normalRoute/CategoryResult';
import Search from './normalRoute/Search';

const MyRouter = () => {
    return (
        <>
            <AppNavbar />
            <Header />
            <Container id="main-body">
                <Switch>
                    <Route path="/" exact component={PostCardList} />
                    <Route path="/posts" exact component={PostWrite} />
                    <Route path="/posts/:id" exact component={PostDetail} />
                    <Route path="/posts/category/:categoryName" exact component={CategoryResult} />
                    <Route path="/search/searchTerm" exact component={Search} />
                    <Redirect from="*" to="/" />
                </Switch>
            </Container>
            <Footer />
        </>
    )
}

export default MyRouter;