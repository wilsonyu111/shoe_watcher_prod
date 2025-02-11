import * as React from "react";
import Alert from "@mui/material/Alert";

function Popup({ severity, msg, time, msgArea, updateMsg}) {
    const [msgArea, showMsgArea] = React.useState(
      <Alert className="errorMsg_area" severity={severity}>{msg}</Alert>
    );
    const handleExpire = () => {
      showMsgArea(<></>);
    };
    React.useEffect(() => {
      const interval = setInterval(() => {
        if (time > 0) {
          time = time - 1;
        } else {
          clearInterval(interval);
          handleExpire();
        }
      }, 1000);
    }, []);
    return <div>{msgArea}</div>;
  }

export default Popup