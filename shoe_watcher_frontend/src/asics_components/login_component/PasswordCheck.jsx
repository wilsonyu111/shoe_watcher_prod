import * as React from "react";
import Alert from "@mui/material/Alert";
import { passwordRequirmentCheck } from "../HelperFunctions";

const allowedSpecial = "!@#$"
const lowerLimit = 10;
const upperLimit = 20;

export default function PasswordCheck({ password}) {
    const [len, upper, lower, digit, specialChar] = passwordRequirmentCheck(password)


  return (
    <div>

      <Alert
        className="passwordChecks"
        sx={{ paddingTop: 0, paddingBottom: 0, height: 36 }}
        severity={len ? "success" : "error"}
      >
        {lowerLimit} - {upperLimit} characters long
      </Alert>
      <Alert
        className="passwordChecks"
        sx={{ paddingTop: 0, paddingBottom: 0, height: 36 }}
        severity={upper ? "success" : "error"}
      >
        at least one upper case alphabet
      </Alert>
      <Alert
        className="passwordChecks"
        sx={{ paddingTop: 0, paddingBottom: 0, height: 36 }}
        severity={lower ? "success" : "error"}
      >
        at least one lower case alphabet
      </Alert>
      <Alert
        className="passwordChecks"
        sx={{ paddingTop: 0, paddingBottom: 0, height: 36 }}
        severity={digit ? "success" : "error"}
      >
        at least one digit
      </Alert>
      <Alert
        className="passwordChecks"
        sx={{ paddingTop: 0, paddingBottom: 0, height: 36 }}
        severity={password !== "" && specialChar ? "success" : "error"}
      >
        at least one {allowedSpecial} character
      </Alert>
      <br/>
    </div>
  );
}