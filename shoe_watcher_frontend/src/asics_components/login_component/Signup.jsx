import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link } from "@mui/material";
import Login from "./Login";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signup } from "../HelperFunctions";
import Alert from "@mui/material/Alert";
import PasswordCheck from "../login_component/PasswordCheck";
import { passwordRequirmentCheck } from "../HelperFunctions";

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

function PassMismatchSign({mismatch}){
  console.log(mismatch)
  return (
          <Alert
            className="passwordChecks"
            sx={{ paddingTop: 0, paddingBottom: 0, height: 36 }}
            severity={!mismatch ? "success" : "error"}
          >
            Password match?
          </Alert>
  )
}

function ValueFields({ checkMismatch, setMapInfo, getMapInfo, toLogin }) {
  const [passwordMismatch, setMismatch] = React.useState(false);
  const [enableSubmit, allowSubmit] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(<></>);
  const [isMismatch, setIsMismatch] = React.useState(<></>);
  const [newPassCheck, setNewCheck] = React.useState(<></>);
  const onErrorCallback = (success, msg) => {
    if (!success) {
      setErrorMsg(<Alert severity="error">Error signning up, {msg}</Alert>);
    } else {
      let time = 5;
      const interval = setInterval(() => {
        if (time > 0) {
          setErrorMsg(
            <Alert severity="success">
              Sign up sucessfully, click below or wait to be redirected to login
              page ({time})
            </Alert>
          );
          time = time - 1;
        } else {
          clearInterval(interval);
          toLogin();
        }
      }, 1000);
    }
  };

  return (
    <>
      <div className="error_msg_area">{errorMsg}</div>
      <Typography className="formtype_name">Sign up</Typography>
      <TextField
        className="form_field"
        onChange={(event) => {
          setMapInfo("email", event.target.value);
        }}
        required
        label="Email"
      />
      <TextField
        className="form_field"
        onChange={(event) => {
          setMapInfo("username", event.target.value);
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
          allowSubmit(checkMismatch());
          setNewCheck(<PasswordCheck password={password}/>);
          setIsMismatch(<PassMismatchSign mismatch={checkMismatch()}/>);
        }}
      />

      <VisibilityTextField
        id={"confirm_new_password"}
        mismatch={passwordMismatch}
        onChangeCallback={(password) => {
          setMapInfo("confirmPassword", password);
          setMismatch(checkMismatch());
          allowSubmit(checkMismatch());
          setIsMismatch(<PassMismatchSign mismatch={checkMismatch()}/>);
        }}
      />
      {isMismatch}
      {newPassCheck}
      <Button
        className="form_submit_button"
        variant="contained"
        disabled={enableSubmit}
        disableElevation
        onClick={() => {
          signup(
            getMapInfo("email"),
            getMapInfo("username"),
            getMapInfo("password"),
            onErrorCallback
          );
        }}
      >
        Sign up
      </Button>
    </>
  );
}

function Signup({ setPageContent, closeWindow }) {
  const formMap = new Map();
  formMap.set("password", "");
  formMap.set("confirmPassword", "");
  formMap.set("email", "");
  formMap.set("username", "");

  const checkMismatch = () => {
    if (
      getMapInfo("password") !== "" &&
      getMapInfo("confirmPassword") !== "" &&
      getMapInfo("password") === getMapInfo("confirmPassword") &&
      passwordRequirmentCheck(getMapInfo("password")).reduce(
        (prev_val, val) => {
          return prev_val && val;
        },
        true
      )
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

  return (
    <>
      <ValueFields
        checkMismatch={checkMismatch}
        getMapInfo={getMapInfo}
        setMapInfo={setMapInfo}
        toLogin={() => {
          setPageContent(
            <Login setPageContent={setPageContent} closeWindow={closeWindow} />
          );
        }}
      />

      <div className="alternative_form_group">
        <Typography className="signup_info">
          Already have an account?
        </Typography>
        <Link
          component="button"
          variant="body2"
          className="signup_button"
          onClick={() => {
            setPageContent(
              <Login
                setPageContent={setPageContent}
                closeWindow={closeWindow}
              />
            );
          }}
        >
          Log in now!
        </Link>
      </div>
    </>
  );
}

export default Signup;
