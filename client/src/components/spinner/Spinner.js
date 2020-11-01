import React, { Fragment } from "react";

import { Row, Spinner } from "reactstrap";

export const GrowingSpinner = (
  <Fragment>
    <Row className="d-flex justify-content-center m-5">
      <Spinner style={{width: "2rem", height:"2rem"}} size="sm" color="secondary" />
    </Row>
  </Fragment>
);
