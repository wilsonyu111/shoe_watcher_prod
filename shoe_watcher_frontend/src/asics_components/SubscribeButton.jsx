import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import MailIcon from "@mui/icons-material/Mail";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginState } from "./features/auth/authSlice";
import { getJwtClaims } from "./HelperFunctions";
import { submit_Notify } from "./HelperFunctions";

function SubscribeButton(props) {
  let cred = getJwtClaims();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(cred.email);
  const [user, setUser] = useState(cred.user);
  const [price, setPrice] = useState(0);
  const [validated, setValidated] = useState(false);
  const [confirmation, setConfirm] = useState(false);
  const logedin = useSelector(selectLoginState);

  const handleClose = () => {
    setPrice(0);
    setShow(false);
    setValidated(false);
  };

  const closeConfirmation = () => {
    setConfirm(false);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(false);
      const jsonData = {
        email: email,
        username: user,
        price: Number(price),
        sfccid: props.dataMap.get("sfccid"),
        html_link: props.dataMap.get("html_link"),
        shoe_name: props.dataMap.get("shoe_name"),
      };
      submit_Notify(jsonData);

      setConfirm(true);
      setShow(false);
      setPrice(0);
    }
  };

  const handleShow = () => {
    setShow(true);
    setEmail(cred.email);
  };
  return (
    <div style={{ marginTop: 5, padding: 5 }}>
      {logedin ? (
        <Tooltip title="email notification">
          <IconButton onClick={handleShow} aria-label="email notification">
            <MailIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Email Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="7" controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder={email}
                  defaultValue={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Invalid email.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Price</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="90.00"
                    aria-describedby="inputGroupPrepend"
                    required
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a price.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Col className="mb-3">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Col>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={confirmation} onHide={closeConfirmation}>
        <Modal.Body>
          A confirmation email will be sent to {email} shortly.
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SubscribeButton;
