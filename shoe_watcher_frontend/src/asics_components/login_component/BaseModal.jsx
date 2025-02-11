import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Login from "./Login";
import Modal from "@mui/material/Modal";
import { useDispatch } from "react-redux";
import { refreshLoginStat } from "../HelperFunctions";

const style = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BaseModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [pageContent, setPageContent] = React.useState(<></>);
  const dispatch = useDispatch();


  React.useEffect(() => {
    setPageContent(
      <Login
        key={"login" + String(1)}
        setPageContent={setPageContent}
        closeWindow={handleClose}
      />
    );
    
    refreshLoginStat()

  }, []);

  return (
    <>
      <Button className="nav_login_button" onClick={handleOpen}>
        Login
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="credential_page">
          {pageContent}
        </Box>
      </Modal>

    </>
  );
}

export default BaseModal;
