import React from 'react';
import { Collapse, Container, Navbar, NavbarToggler } from 'reactstrap';
import { Link } from 'react-router-dom';
const AppNavbar = () => {
    return (
        <>
        <Navbar>
            <Container>
                <Link to="/" className="text-white text-decoration-none">
                    My Side Project Blog
                </Link>
                <NavbarToggler />
                <Collapse>
                </Collapse>
            </Container>
        </Navbar>
        </>
    )
}

export default AppNavbar;