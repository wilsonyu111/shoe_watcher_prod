import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { doSearch } from './HelperFunctions';
import { updateParam } from './features/searchParameter/searchParamSlice';
import { useDispatch } from 'react-redux';

export default function SelectAutoWidth({showDrop, defaultOption}) {
  const [sortOption, setOption] = React.useState(defaultOption);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setOption(event.target.value);
    dispatch(
        updateParam({
          key: "sorting_style",
          value: event.target.value
        })
      );
    doSearch();
  };


  if (showDrop === "done")
    return (
        
        <div>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">sort by</InputLabel>
            <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={sortOption}
            onChange={handleChange}
            autoWidth
            label="sort by"
            >
            <MenuItem value={"A-Z"}><em>A-Z</em></MenuItem>
            <MenuItem value={"Z-A"}>Z-A</MenuItem>
            <MenuItem value={"$-$$"}>$-$$</MenuItem>
            <MenuItem value={"$$-$"}>$$-$</MenuItem>
            </Select>
        </FormControl>
        </div>
    )
else{
    return (<></>)
}
}