import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function InfoPopup({ msg }) {
  const [message, setMessage] = React.useState(
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert variant="outlined" severity="success">
        This is a filled success Alert.
      </Alert>
    </Stack>
  );
  React.useEffect(() => {
    let time = 5;
    
    const interval = setInterval(() => {
      if (time > 0) {
        time = time - 1;
      } else {
        clearInterval(interval);
        setMessage(<></>);
      }
    }, 1000);
  }, []);
  return <div className="info_popup">
    {message}
  </div>;
}

export default InfoPopup;
