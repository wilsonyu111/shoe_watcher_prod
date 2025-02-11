import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses
} from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { submit_reset } from "../HelperFunctions";

const size = 80;
const thickness = 4;

function ResetPassLoading() {
  return (
    <div className="loading_area">
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) =>
              theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
          }}
          size={size}
          thickness={thickness}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
            animationDuration: "550ms",
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={size}
          thickness={thickness}
        />
      </Box>
    </div>
  );
}

function ResetStatus({ otp, email, password }) {
  console.log(otp, email, password);
  const navigate = useNavigate();
  const [errorMsg, showErrorMsg] = React.useState(<></>);
  const [loading, showLoading] = React.useState(<ResetPassLoading />);

  function errorHelper(severity, msg, timeout, func1 = null, func2 = null) {
    timer(
      () => {
        showErrorMsg(<Alert severity={severity}>{msg}</Alert>);

        if (func1 !== null) {
          func1();
        }
      },
      () => {
        showErrorMsg(<></>);
        if (func2 !== null) {
          func2();
        }
      },
      timeout
    );
  }
  const redirectToMain = () => {
    navigate("/");
  };
  const success = () => {
    showLoading(<></>);
    errorHelper(
      "success",
      "reset successful, redirecting to main page",
      5,
      null,
      redirectToMain
    );
  };

  const fail = (code) => {
    showLoading(<></>);
    if (code === 401) {
      errorHelper(
        "error",
        "reset link has expired, please try again later. (Redirecting back to main page in 5 seconds)",
        5,
        null,
        redirectToMain
      );
    } else {
      errorHelper(
        "error",
        "server error, please try again later. (Redirecting back to main page in 5 seconds)",
        5,
        null,
        redirectToMain
      );
    }
  };

  React.useEffect(() => {
    submit_reset(email, otp, password, success, fail);
  }, []);

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

  return (
    <>
      <div className="errorMsg_area">{errorMsg}</div>
      {loading}
    </>
  );
}

export default ResetStatus;
