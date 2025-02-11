import React, { useState} from "react";
import Modal from "react-bootstrap/Modal";
import PriceChart from "./PriceChart";
import TimelineIcon from '@mui/icons-material/Timeline';
import IconButton from "@mui/material/IconButton";
import Tooltip from '@mui/material/Tooltip';



function PriceHistoryButton(props) {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };


  const handleShow = () => {
    setShow(true);
  };
  return (
    <div style={{ marginTop: 5, padding: 5 }}>
      <Tooltip title="price history"><IconButton onClick={handleShow} aria-label="price history">
        <TimelineIcon />
      </IconButton></Tooltip>

      <Modal className="price_history_graph" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Price History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PriceChart sfccid={props.dataMap.get("sfccid")}/>          
        </Modal.Body>
        
      </Modal>
    </div>
  );
}

export default PriceHistoryButton;
