import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { emailChecker } from "../HelperFunctions";
import {
  EmailContext,
  DisplayCompContext,
  ErrorMsgContext,
} from "./ResetPasswordPage";
import { resetPassRequest } from "../HelperFunctions";
import OtpPage from "./OtpPage";

// function timer(beginFunc, endFunc, period) {
//   let time = period
//   beginFunc();
//   const interval = setInterval(() => {
//     if (time > 0) {
//       time = time - 1;
//     } else {
//       clearInterval(interval);
//       endFunc();
//     }
//   }, 1000);
// }

// function errorHelper(severity, msg, timeout, showErrorMsg)
// {
//   timer(
//     ()=>{
//       showErrorMsg(
//         <Alert severity={severity}>{msg}</Alert>
//       )
//     }, 
//     ()=>{
//       showErrorMsg(<></>)
//     },timeout);
// }


function EmailRequest() {
  const { emailCtx } = React.useContext(EmailContext);
  const setDisplayComp = React.useContext(DisplayCompContext);
  // const { errorMsgCtx } = React.useContext(ErrorMsgContext);
  const errorHelper = React.useContext(ErrorMsgContext);


  const [email, setEmail] = emailCtx;

  const [disableEmail, setDisableEmail] = React.useState(false);
  const continueButton = () => {
    if (emailChecker(email)) {
      handleContinue();
      setDisableEmail(true);
      resetPassRequest(email);
      setDisplayComp(<OtpPage />);
    } else {
      errorHelper("error", "Please enter a valid email address", 5)
    }
  };

  const handleContinue = () => {
    errorHelper("info", "If this account exist, a one time password will be send shortly and will be valid for 10 minutes", 5)
  };

  return (
    <>
      <div>
        <Typography className="forgot_page_title">
          Forgot your password?
        </Typography>
      </div>

      <div className="forgot_password">
        <TextField
          className="form_field"
          required
          disabled={disableEmail}
          label="Email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <Button
          className="form_submit_button"
          variant="contained"
          disableElevation
          onClick={() => {
            continueButton();
          }}
        >
          Continue
        </Button>
      </div>
    </>
  );
}

export default EmailRequest;
