import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import {
  updateParam,
} from "./features/searchParameter/searchParamSlice";
import { doSearch } from "./HelperFunctions";

const minDistance = 10;

function DualSlider({ name, minVal, maxVal }) {
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(updateParam({ key: "min_price", value: minVal }));
        dispatch(updateParam({ key: "max_price", value: maxVal }));
     }, []);

  function MultiSlider() {
    
    const [value2, setValue2] = React.useState([minVal, maxVal]);
    const [showMin, setShowMin] = React.useState(minVal);
    const [showMax, setShowMax] = React.useState(maxVal);
    const handleChange2 = (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }
      let small = newValue[0];
      let large = newValue[1];
      if (large - small < minDistance) {
        if (activeThumb === 0) {
          const clamped = Math.min(small, maxVal - minDistance);
          small = clamped;
          large = clamped + minDistance;
          setValue2([small, large]);
        } else {
          const clamped = Math.max(large, minDistance);
          small = clamped - minDistance;
          large = clamped;
          setValue2([small, large]);

        }
      } else {
        setValue2(newValue);
      }
      setShowMin(small);
      setShowMax(large);

    };

    function updateStore()
    {
      dispatch(updateParam({ key: "min_price", value: showMin }));
      dispatch(updateParam({ key: "max_price", value: showMax }));
      doSearch();
    }

    return (
      <>
        <Grid container spacing={2}>
          <Grid item>
            <Typography sx={{ width: 30 }}>${showMin}</Typography>
          </Grid>
          <Grid item>
            {" "}
            <Box sx={{ width: 110 }}>
              <Slider
                getAriaLabel={() => "Minimum distance shift"}
                value={value2}
                onChange={handleChange2}
                onChangeCommitted={updateStore}
                valueLabelDisplay="auto"
                disableSwap
                min={minVal}
                max={maxVal}
              />
            </Box>
          </Grid>

          <Grid item>
            <Typography sx={{ width: 30 }}>${showMax}</Typography>
          </Grid>
        </Grid>
      </>
    );
  }
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
        <AccordionDetails>{MultiSlider()}</AccordionDetails>
      </Accordion>
    </div>
  );
}

export default DualSlider;
