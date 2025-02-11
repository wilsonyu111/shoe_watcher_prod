import * as React from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import BaseModal from "./BaseModal";
import { logout, getJwtClaims} from "../HelperFunctions";
import { updateLoginStatus } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function LogedInItem({ authStatus }) {

  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (authStatus) {
    return (
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              
              handleClose();
              navigate("/profile");
            }}
          >
            My account
          </MenuItem>
          <MenuItem
            onClick={() => {
              logout();
              handleClose();
              dispatch(updateLoginStatus({ key: "expiredAuth", value: false }));

            }}
          >
            Log out
          </MenuItem>
        </Menu>
      </div>
    );
  } else {
    return <BaseModal/>;
  }
}

export default LogedInItem;
