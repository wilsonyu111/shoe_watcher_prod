import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link } from "@mui/material";
import Signup from "./Signup";
import { login } from "../HelperFunctions";
import Alert from "@mui/material/Alert";
import { updateLoginStatus } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

function Login({ setPageContent, closeWindow }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(<></>);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onErrorCallback = (success) => {
    if (!success) {
      setErrorMsg(
        <Alert severity="error">
          Error logging in, please check your username and password and try
          again
        </Alert>
      );
    } else {
      dispatch(updateLoginStatus({ key: "loginStatus", value: true }));
      closeWindow();
    }
  };

  return (
    <>
      <div className="error_msg_area">{errorMsg}</div>
      <Typography className="formtype_name">Login </Typography>
      <TextField
        className="form_field"
        required
        label="Username"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <FormControl variant="outlined" className="form_field">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
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
            setPassword(event.target.value);
          }}
        />
      </FormControl>
      <div className="link_to_reset_password">
        <Link
          component="button"
          variant="body2"
          className="link_form_button"
          onClick={() => {
            navigate("/reset_password");
          }}
        >
          Forgot password?
        </Link>
      </div>
      <Button
        className="form_submit_button"
        variant="contained"
        disableElevation
        onClick={() => {
          login(username, password, onErrorCallback);
        }}
      >
        Log In
      </Button>

      <div className="alternative_form_group">
        <Typography className="signup_info">Don't have an account?</Typography>
        <Link
          component="button"
          variant="body2"
          className="link_form_button"
          onClick={() => {
            setPageContent(
              <Signup
                setPageContent={setPageContent}
                closeWindow={closeWindow}
              />
            );
          }}
        >
          Signup now
        </Link>
      </div>
    </>
  );
}

export default Login;
