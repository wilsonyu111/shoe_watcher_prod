import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  getJwtClaims,
  validateStoredJwt,
  update_info,
  logout,
} from "../HelperFunctions";
import { updateLoginStatus } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import PasswordCheck from "../login_component/PasswordCheck";
import { passwordRequirmentCheck } from "../HelperFunctions";
import AlertPopup from "../AlertPopup";

function VisibilityTextField({ id, mismatch, onChangeCallback }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <FormControl variant="outlined" className="form_field">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          error={mismatch}
          id={id}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          onChange={(event) => {
            // console.log(event)
            onChangeCallback(event.target.value);
          }}
        />
      </FormControl>
    </>
  );
}

function ValueFields({
  checkMismatch,
  checkFields,
  setMapInfo,
  getMapInfo,
  user,
  email,
}) {
  const [passwordMismatch, setMismatch] = React.useState(false);
  const [enableSubmit, allowSubmit] = React.useState(true);
  const [errmsg, showErr] = React.useState(<></>);
  const [confimPassCheck, setConfimCheck] = React.useState(<></>);
  const [newPassCheck, setNewCheck]= React.useState(<></>);
  const navigate = useNavigate();
  const loadingBox = () => {
    return (
      <Dialog open>
        <Box className="loading_icon">
          <CircularProgress className="loading_icon_animation" />
        </Box>
      </Dialog>
    );
  };
  const [loading, showLoading] = React.useState(<></>);

  return (
    <>
      <div className="update_user_info">
        <Typography className="formtype_name">Update Info</Typography>
        <br />
        <br />
        <TextField
          key={"email"}
          className="form_field"
          defaultValue={email}
          onChange={(event) => {
            setMapInfo("email", event.target.value);
            allowSubmit(checkFields());
          }}
          required
          label="Email"
        />
        <TextField
          key={"user"}
          className="form_field"
          defaultValue={user}
          onChange={(event) => {
            setMapInfo("username", event.target.value);
            allowSubmit(checkFields());
          }}
          required
          label="Username"
        />
        <VisibilityTextField
          id={"new_password"}
          mismatch={passwordMismatch}
          onChangeCallback={(password) => {
            setMapInfo("password", password);
            setMismatch(checkMismatch());
            allowSubmit(checkFields());
            setNewCheck(<PasswordCheck password={password}/>)
          }}
        />
        {newPassCheck}
        <VisibilityTextField
          id={"confirm_new_password"}
          mismatch={passwordMismatch}
          onChangeCallback={(password) => {
            setMapInfo("confirmPassword", password);
            setMismatch(checkMismatch());
            allowSubmit(checkFields());
            setConfimCheck(<PasswordCheck password={password}/>)
          }}
        />
        {confimPassCheck}
        <Button
          className="form_submit_button"
          variant="contained"
          disabled={enableSubmit}
          disableElevation
          onClick={() => {
            let cred = getJwtClaims();
            update_info(
              {
                oldUser: cred.user,
                oldEmail: cred.email,
                email: getMapInfo("email"),
                username: getMapInfo("username"),
                password: getMapInfo("password"),
              },
              () => {
                showLoading(false);
                logout();
                showErr(
                    <AlertPopup
                      openAlert={true}
                      msg={"update successful, redirecting to main page..."}
                      TIME={5}
                      onclose={() => {
                        showErr(<></>);
                        navigate("/")
                      }}
                    />
                  );
              },
              () => {
                console.log("here");
                showLoading(false);
                showErr(
                  <AlertPopup
                    openAlert={true}
                    msg={"update failed, please try again!"}
                    TIME={5}
                    onclose={() => {
                      showErr(<></>);
                    }}
                  />
                );
              }
            );
            showLoading(loadingBox());
            console.log({
              oldUser: cred.user,
              oldEmail: cred.email,
              email: getMapInfo("email"),
              username: getMapInfo("username"),
              password: getMapInfo("password"),
            });
          }}
        >
          save
        </Button>
        {loading}
        {errmsg}
      </div>
    </>
  );
}

function Setting() {
  const formMap = new Map();
  formMap.set("password", "");
  formMap.set("confirmPassword", "");
  formMap.set("email", "");
  formMap.set("username", "");
  const dispatch = useDispatch();
  const [renderTextField, setTextFields] = React.useState(<></>);

  const checkMismatch = () => {
    if (
      getMapInfo("password") !== "" &&
      getMapInfo("confirmPassword") !== "" &&
      getMapInfo("password") === getMapInfo("confirmPassword")
    ) {
      return false;
    }
    return true;
  };

  const checkFields = () => {
    if (
      !checkMismatch() &&
      getMapInfo("username") !== "" &&
      getMapInfo("email") !== "" &&
      passwordRequirmentCheck(getMapInfo("password")).reduce(( prev_val, val)=>{return prev_val && val}, true)
    ) {
      return false;
    }
    return true;
  };

  const setMapInfo = (key, value) => {
    formMap.set(key, value);
  };

  const getMapInfo = (key) => {
    return formMap.get(key);
  };

  React.useEffect(() => {
    if (validateStoredJwt()) {
      dispatch(updateLoginStatus({ key: "loginStatus", value: true }));
      let cred = getJwtClaims();
      formMap.set("email", cred.email);
      formMap.set("username", cred.user);
      setTextFields(
        <ValueFields
          checkMismatch={checkMismatch}
          checkFields={checkFields}
          getMapInfo={getMapInfo}
          setMapInfo={setMapInfo}
          user={cred.user}
          email={cred.email}
        />
      );
    } else {
      dispatch(updateLoginStatus({ key: "loginStatus", value: false }));
    }
  }, []);

  return <>{renderTextField}</>;
}

export default Setting;
