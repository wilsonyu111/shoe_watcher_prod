import * as React from "react";
import Typography from "@mui/material/Typography";
import EmailRequest from "./EmailRequest";
import Alert from "@mui/material/Alert";


export const EmailContext = React.createContext();
export const OtpContext = React.createContext();
export const DisplayCompContext = React.createContext();
export const ErrorMsgContext = React.createContext();
export const NewPassContext = React.createContext();
export const ConfirmPassContext = React.createContext();

function ResetPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [errorMsg, showErrorMsg] = React.useState(<></>);
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");


  function timer(beginFunc, endFunc, period) {
    let time = period;
    beginFunc();
    const interval = setInterval(() => {
      if (time > 0) {
        time = time - 1;
      } else {
        clearInterval(interval);
        endFunc();
      }
    }, 1000);
  }

  function errorHelper(severity, msg, timeout, func1=null, func2=null) {
    timer(
      () => {
        
        showErrorMsg(<Alert severity={severity}>{msg}</Alert>);

        if (func1 !== null)
        {
          func1()
        }
      },
      () => {
        showErrorMsg(<></>);
        if (func2 !== null)
        {
          func2()
        }
      },
      timeout
    );
  }

  return (
    <>
      <div>
        <Typography className="forgot_page_title">
          Forgot your password?
        </Typography>
      </div>
      <div className="errorMsg_area">{errorMsg}</div>
      <NewPassContext.Provider value={{ newPassCtx: [newPass, setNewPass] }}>
        <ConfirmPassContext.Provider
          value={{ confirmPassCtx: [confirmPass, setConfirmPass] }}
        >
          <ErrorMsgContext.Provider
            value={errorHelper}
          >
            <OtpContext.Provider value={{ otpCtx: [otp, setOtp] }}>
              <EmailContext.Provider value={{ emailCtx: [email, setEmail] }}>
                <DisplayArea />
              </EmailContext.Provider>
            </OtpContext.Provider>
          </ErrorMsgContext.Provider>
        </ConfirmPassContext.Provider>
      </NewPassContext.Provider>
    </>
  );
}

function DisplayArea() {
  const [displayComp, updateComp] = React.useState(<EmailRequest />);
  return (
    <>
      <div>
        

        <DisplayCompContext.Provider value={updateComp}>
          {displayComp}
        </DisplayCompContext.Provider>
      </div>
    </>
  );
}

export default ResetPasswordPage;
