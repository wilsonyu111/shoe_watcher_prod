import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  getJwtClaims,
  getSubscribeList,
  validateStoredJwt,
  delete_sub_row,
} from "../HelperFunctions";
import { updateLoginStatus } from "../features/auth/authSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import AlertPopup from "../AlertPopup";
import { useNavigate } from "react-router-dom";

function DeleteButton({ handleClickOpen }) {
  return (
    <>
      <IconButton size="large" onClick={handleClickOpen} color="inherit">
        <RemoveCircleOutlineOutlinedIcon />
      </IconButton>
    </>
  );
}

function ButtonGroup({ cancel, confirm, disableBtn }) {
  return (
    <>
      <Button onClick={cancel} disabled={disableBtn}>
        close
      </Button>
      <Button
        variant="contained"
        color="error"
        disabled={disableBtn}
        onClick={confirm}
        autoFocus
      >
        confirm
      </Button>
    </>
  );
}

export default function SubscribeTable() {
  const navigate = useNavigate();
  const [disableBtn, setDisableBtn] = useState(false);

  const [rowData, setRowData] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [popupMsg, setPopUp] = useState(<></>);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYes = (setLoading) => {
    const selectedData = gridRef.current.api.getSelectedRows();
    const endAction = () => {
      handleClose();
      setDisableBtn(false);
      setLoading(placeholder());
    };
    if (selectedData.length > 0) {
      console.log(selectedData[0]);
      let jsonData = {
        sfccid: selectedData[0].sfccid,
        username_id: selectedData[0].username_id,
        id: selectedData[0].row_id,
      };
      setDisableBtn(true);
      setLoading(
        <>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </>
      );
      delete_sub_row(
        jsonData,
        () => {
          const res = gridRef.current.api.applyTransaction({
            remove: selectedData,
          });
          endAction();
        },
        () => {
          handleClose();
          endAction();
        }
      );
    } else {
      handleClose();
    }
  };
  const placeholder = () => {
    return <div className="loading_area"></div>;
  };
  const [loading, showLoading] = React.useState(placeholder());
  const defaultColDef = React.useMemo(() => {
    return {
      width: 200,
      editable: true,
    };
  }, []);

  const gridRef = React.useRef();

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      headerName: "",
      field: "boolean",
      editable: false,

      cellRenderer: () => {
        return (
          <DeleteButton
            gridRef={gridRef}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          />
        );
      },
      width: 80,
    },
    { editable: false, field: "shoe_name" },
    { editable: false, field: "gender", width: 100 },
    { editable: false, field: "brand", width: 100 },
    { editable: false, field: "shoe_link" },
    { editable: false, field: "sfccid", width: 100 },
    { editable: false, field: "shoe_link" },
    { editable: false, field: "update_date" },
    { editable: false, field: "email" },
    { editable: false, field: "target_price" },
    { editable: false, field: "previous_target_price" },
  ]);

  const processResult = (resultList) => {
    setRowData(resultList);
  };

  React.useEffect(() => {
    if (validateStoredJwt()) {
      dispatch(updateLoginStatus({ key: "loginStatus", value: true }));
      let cred = getJwtClaims();
      getSubscribeList(
        { username: cred.user, email: cred.email },
        processResult
      );
      setPopUp(<></>);
    } else {
      dispatch(updateLoginStatus({ key: "loginStatus", value: false }));
      setPopUp(
        <AlertPopup
          openAlert={true}
          msg={"Your login credential has expired, please login again."}
          TIME={3}
          onclose={() => {
            navigate("/");
          }}
        />
      );
    }
  }, []);

  return (
    <>
      <br />
      {popupMsg}
      <h3>Subscribed Table</h3>
      <br />

      <br />

      <div
        className={"ag-theme-quartz"}
        style={{ height: "100%", width: "100%" }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact
          ref={gridRef}
          rowSelection={"single"}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
        />
      </div>
      <div>
        <Dialog
          className="delete_diag_box"
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="confirm_delete">
            {"Are you sure you want to unsubscribe?"}
          </DialogTitle>
          <DialogContent>{loading}</DialogContent>
          <div className="confirm_delete_buttons">
            <ButtonGroup
              cancel={handleClose}
              confirm={() => {
                handleYes(showLoading);
              }}
              disableBtn={disableBtn}
            />
          </div>
        </Dialog>
      </div>
    </>
  );
}
