import React from "react";
import { Row, Col } from 'reactstrap'
const Footer = () => {
    const thisYear = () => {
        const year = new Date().getFullYear();
        return year;
    }
    return (
        <div id="main-footer" className="text-center m-auto p-2"> 
            <Row>
                <Col>
                    <p>Copyright &copy; <span>{thisYear()}</span></p>
                </Col>
            </Row>
        </div>
    )
}

export default Footer;

//m-auto : margin:auto

//p-2 : padding 0.25 rem 이 기본단위. 그러면 0.5rem?