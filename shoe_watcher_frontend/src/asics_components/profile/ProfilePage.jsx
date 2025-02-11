import * as React from "react";
import { useState } from "react";
import {
  getMyAccount,
  getJwtClaims,
  validateStoredJwt,
} from "../HelperFunctions";
import { useSelector } from "react-redux";
import AlertPopup from "../AlertPopup";
import { Outlet } from "react-router-dom";
import {
  selectLoginState,
  updateLoginStatus,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../HelperFunctions";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";

function ProfilePage() {
  const navigate = useNavigate();
  const [popupMsg, setPopUp] = useState(<></>);
  const loginStat = useSelector(selectLoginState);
  const [userName, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [helloName, setHelloName] = React.useState(<></>);
  const dispatch = useDispatch();

  // console.log("profile page")
  React.useEffect(() => {
    let cred = getJwtClaims();

    if (cred.user !== "") {
      setHelloName(<>Hello {cred.user}</>);
    } else {
      setHelloName(<></>);
    }

    setEmail(cred.email);
    setUsername(cred.user);
  }, [loginStat]);

  React.useEffect(() => {
    console.log("profile page");
    if (validateStoredJwt()) {
      dispatch(updateLoginStatus({ key: "loginStatus", value: true }));
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
      {popupMsg}
      <AppBar className="profile_side_navbar">
        <Toolbar>
          <Typography className="hello_name">{helloName}</Typography>
          <Box className="profile_side_item">
            <IconButton
              sx={{ color: "#fff" }}
              className="side_button"
              onClick={() => {
                getMyAccount();
              }}
            >
              <div className="icon_description">
                <HomeIcon />
                <Typography>test account</Typography>
              </div>
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              className="side_button"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <div className="icon_description">
                <HomeIcon />
                <Typography>profile</Typography>
              </div>
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              className="side_button"
              onClick={() => {
                navigate("/profile/subscribed");
              }}
            >
              <div className="icon_description">
                <EmailIcon />
                <Typography>subscribed</Typography>
              </div>
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              className="side_button"
              onClick={() => {
                navigate("/");
              }}
            >
              <div className="icon_description">
                <HomeIcon />
                <Typography>home</Typography>
              </div>
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              className="side_button"
              onClick={() => {
                navigate("/profile/setting");
              }}
            >
              <div className="icon_description">
                <SettingsIcon />
                <Typography>settings</Typography>
              </div>
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              className="side_button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <div className="icon_description">
                <LogoutIcon />
                <Typography>logout</Typography>
              </div>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet context={{ user: userName, email: email }} />
    </>
  );
}

export default ProfilePage;
