import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import TextField from "@mui/material/TextField";
import ResetStatus from "./ResetStatus";

function VisibilityTextField({ id, mismatch, onChangeCallback, label }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <FormControl variant="outlined" className="form_field">
        <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
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
          label={label}
          onChange={(event) => {
            onChangeCallback(event.target.value);
          }}
        />
      </FormControl>
    </>
  );
}

function ValueFields({ checkMismatch, setMapInfo, getMapInfo, otp, email, showLoading}) {
  const [passwordMismatch, setMismatch] = React.useState(false);
  const [enableSubmit, allowSubmit] = React.useState(true);

  return (
    <>
      <TextField
        className="form_field"
        required
        disabled={true}
        defaultValue={email}
        label="Email"
      />
      <TextField
        className="form_field"
        required
        disabled={true}
        defaultValue={otp}
        label="one time password"
      />

      <VisibilityTextField
        id={"new_password"}
        label={"password"}
        mismatch={passwordMismatch}
        onChangeCallback={(password) => {
          setMapInfo("password", password);
          setMismatch(checkMismatch());
          allowSubmit(checkMismatch());
        }}
      />
      <VisibilityTextField
        id={"confirm_new_password"}
        label={"confirm password"}
        mismatch={passwordMismatch}
        onChangeCallback={(password) => {
          setMapInfo("confirmPassword", password);
          setMismatch(checkMismatch());
          allowSubmit(checkMismatch());
        }}
      />
      <Button
        className="form_submit_button"
        variant="contained"
        disabled={enableSubmit}
        disableElevation
        onClick={() => {
          showLoading(getMapInfo("password"))
        }}
      >
        Submit
      </Button>
    </>
  );
}

function NewPassword({ otp, email }) {
  
  const formMap = new Map();

  formMap.set("password", "");
  formMap.set("confirmPassword", "");

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

  const setMapInfo = (key, value) => {
    formMap.set(key, value);
  };

  const getMapInfo = (key) => {
    return formMap.get(key);
  };

  const [loadingPage, showLoading] = React.useState(
    <div className="new_password_form">
      <ValueFields
        checkMismatch={checkMismatch}
        getMapInfo={getMapInfo}
        setMapInfo={setMapInfo}
        otp={otp}
        email={email}
        showLoading={(password)=>{
          showLoading(<ResetStatus otp={otp} email={email} password={password}/>)
        }}
      />
    </div>)

  

  return (
    <>
      {loadingPage}
    </>
  );
}

export default NewPassword;
