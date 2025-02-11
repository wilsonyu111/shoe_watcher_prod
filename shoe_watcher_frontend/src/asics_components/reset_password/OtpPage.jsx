import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  OtpContext,
  EmailContext,
  ErrorMsgContext,
  DisplayCompContext,
} from "./ResetPasswordPage";
import LoadingButton from "@mui/lab/LoadingButton";
import NewPassword from "./NewPassword";
import { otpChecker, resetPassRequest } from "../HelperFunctions";
import { useNavigate } from "react-router-dom";

const request_timeout = 3;

function LoadingOrContinue({ loading, setLoading }) {
  const { otpCtx } = React.useContext(OtpContext);
  const { emailCtx } = React.useContext(EmailContext);
  const errorHelper = React.useContext(ErrorMsgContext);
  const [otp] = otpCtx;
  const [email] = emailCtx;
  const [requestTimeout, setTimeout] = React.useState("");
  const [disableRequest, disableRequestButton] = React.useState(false);
  const setDisplayComp = React.useContext(DisplayCompContext);
  const navigate = useNavigate();
  const waitRedirect = () => {
    navigate("/");
  };

  const success = () => {
    setDisplayComp(<NewPassword otp={otp} email={email} />);
  };

  const wrongOtp = (code) => {
    setLoading(false);
    if (code === 401)
      errorHelper("error", "invalid or expired OTP, please request again", 5);
    else
      errorHelper(
        "error",
        "something went wrong, please try again later. Redirecting back to main page.",
        5,null, waitRedirect
      );
  };
  if (!loading) {
    return (
      <>
        <div className="request_again">
          <Typography className="missing_code_prompt">
            Didn't receive the code?
          </Typography>
          <Button
            variant="text"
            disabled={disableRequest}
            onClick={() => {
              errorHelper(
                "info",
                "If this account exist, a one time password will be send shortly and will be valid for 10 minutes",
                5
              );
              console.log("requested code");
              resetPassRequest(email);
              let time = request_timeout;
              disableRequestButton(true);
              const interval = setInterval(() => {
                if (time > 0) {
                  setTimeout(`(${time})`);
                  time = time - 1;
                } else {
                  disableRequestButton(false);
                  setTimeout("");
                  clearInterval(interval);
                }
              }, 1000);
            }}
          >
            request {requestTimeout}
          </Button>
        </div>
        <Button
          className="form_submit_button"
          variant="contained"
          disableElevation
          onClick={() => {
            setLoading(true);
            otpChecker(otp, email, success, wrongOtp);
          }}
        >
          Continue
        </Button>
      </>
    );
  } else {
    return (
      <div>
        <LoadingButton loading={true} variant="outlined">
          <span>disabled</span>
        </LoadingButton>
      </div>
    );
  }
}

function OtpPage() {
  const { otpCtx } = React.useContext(OtpContext);
  const { emailCtx } = React.useContext(EmailContext);
  const [, setOtp] = otpCtx;
  const [email, setEmail] = emailCtx;
  const [loadingButton, showLoading] = React.useState(false);

  return (
    <>
      <div className="forgot_password">
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
          label="One Time Password"
          onChange={(event) => {
            setOtp(event.target.value);
          }}
        />
        <LoadingOrContinue loading={loadingButton} setLoading={showLoading} />
      </div>
    </>
  );
}

export default OtpPage;
