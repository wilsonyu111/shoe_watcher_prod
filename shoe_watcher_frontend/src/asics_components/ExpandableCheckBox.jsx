import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IndeterminateCheckbox from "./IndeterminateCheckbox";

function ExpandableCheckBox({ name, checkBoxType, checkBoxVal}) {

  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"

        >
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <IndeterminateCheckbox checkBoxKey={name} checkBoxType={checkBoxType} checkBoxVal={checkBoxVal}/>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default ExpandableCheckBox;
