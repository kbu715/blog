import React, { useCallback, useEffect, useState } from "react";
import { Collapse, Container, Nav, Navbar, NavbarToggler } from "reactstrap";
import { Link } from "react-router-dom";
import LoginModal from "./auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT_REQUEST } from "../redux/types";
const AppNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, userRole } = useSelector(
    (state) => state.auth
  );
  console.log(userRole, "UserRole");

  const dispatch = useDispatch();

  const onLogout = useCallback(() => { //useCallback(()=>{}) : useEffect와 비슷 araboza..
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, [dispatch]);


  useEffect(() => { //Collapse 닫아주기 위해서 user가 변했을때
    setIsOpen(false);
  }, [user]);


  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar color="dark" expand="lg" className="sticky-top">
        <Container>
          <Link to="/" className="text-white text-decoration-none">
            My Side Project Blog
          </Link>
          <NavbarToggler onClick={handleToggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto d-felx justify-content-around" navbar> 
              {isAuthenticated ? (
                <h1 className="text-white">authLink</h1>
              ) : (
                <LoginModal />
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;

/* 
ml-auto : margin-left:auto
d-flex : display:flex-Box
justify-content-around : space-around? 
*/