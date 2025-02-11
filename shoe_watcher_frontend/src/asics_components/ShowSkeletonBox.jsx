import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import * as React from "react";

function ShowSkeletonBox() {
  return (
    <div className="bodycontent">
      {Array.from(Array(10)).map((_,idx) => (
        <Box key={"skel"+idx} className="fillerbox">
          <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
          <Skeleton width="100%" />
          <Skeleton width="70%" />
        </Box>
      ))}
    </div>
  );
}

export default ShowSkeletonBox;
