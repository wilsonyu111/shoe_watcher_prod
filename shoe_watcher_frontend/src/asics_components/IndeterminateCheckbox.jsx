import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateParam } from "./features/searchParameter/searchParamSlice";
import { doSearch } from "./HelperFunctions";

function IndeterminateCheckbox({ checkBoxKey, checkBoxType, checkBoxVal }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(checkBoxVal);

  useEffect(() => {
    dispatch(
      updateParam({
        key: checkBoxKey,
        value: checkBoxType.filter((_, idx)=>checkBoxVal[idx])
      })
    );
  }, []);

  const setFunc = checkBoxType.map((x, idx) => (event) => {
    const index = idx;
    const left = checked.slice(0, index + 1);
    const right = checked.slice(index + 1);
    left[index] = event.target.checked;
    const finalArr = left.concat(right);
    setChecked(finalArr);
    updateStore(finalArr);
    doSearch();
  });

  function initArray(length, value) {
    var arr = [],
      i = 0;
    arr.length = length;
    while (i < length) {
      arr[i++] = value;
    }
    return arr;
  }

  function allSame(arr) {
    let prev = arr[0];
    for (let i = 0; i < arr.length; i++) {
      if (prev !== arr[i]) {
        return false;
      }
    }
    return true;
  }

  function updateStore(finalArr)
  {
    let nameList = checkBoxType.filter((_, idx)=>finalArr[idx])

    if (nameList.length === 0)
      {
        nameList = ["default"]
      } 

    dispatch(
      updateParam({
        key: checkBoxKey,
        value: nameList
      })
    );
  }

  const handleChange = (event) => {
    const newArr = initArray(checkBoxType.length, event.target.checked)
    setChecked(newArr);
    updateStore(newArr);
    doSearch();
  }

  function generateCheckBox() {
    return checkBoxType.map((val, idx) => (
      <FormControlLabel
        key={val}
        label={val}
        control={<Checkbox checked={checked[idx]} onChange={setFunc[idx]} />}
      />
    ));
  }

  if (
    checkBoxType.length === 0 ||
    checkBoxVal.length === 0 ||
    checkBoxType.length !== checkBoxVal.length
  ) {
    return <></>;
  }
  return (
    <div>
      <FormControlLabel
        label="Select All"
        control={
          <Checkbox
            checked={checked.reduce((prev, current) => prev && current)}
            indeterminate={!allSame(checked)}
            onChange={handleChange}
          />
        }
      />{" "}
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        {generateCheckBox()}
      </Box>
    </div>
  );
}

export default IndeterminateCheckbox;
