import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import AccountProfile from "./login_component/AccountProfile";
import { useDispatch} from "react-redux";
import {
  createTheme,
  ThemeProvider,
  alpha,
  styled,
  getContrastRatio,
} from "@mui/material/styles";
import {
  updateSearchState
} from "./features/dataList/panelSlice";
import {
  updateParam,
} from "./features/searchParameter/searchParamSlice";
import {getResult} from "./HelperFunctions";

const violetBase = "#7F00FF";
const violetMain = alpha(violetBase, 0.7);

const theme = createTheme({
  palette: {
    blue: {
      main: "#3572EF",
      light: "#A7E6FF",
      dark: "#050C9C",
      contrastText:
        getContrastRatio(violetMain, "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
function BaseNavBar({ page_title }) {
  const [searchName, setName] = useState("");
  const [disableSearch, setDisableSearch] = useState(true);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateParam({ key: "shoe_name", value: searchName }));
    try{
      getResult();
    } catch (e)
    {
      dispatch(updateSearchState("error"));
      console.log("error processing request, please try again")
    }
    
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1}} >
          <AppBar className="top_navbar">
            <Toolbar>

              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                {page_title}
              </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={(event) => {
                    setName(event.target.value);
                    if (event.target.value.length > 0) {
                      setDisableSearch(false);
                    } else {
                      setDisableSearch(true);
                    }
                  }}
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Button
                key="enableSearch"
                sx={{ m: 1, bgcolor: "blue.dark" }}
                variant="contained"
                size="small"
                color="blue"
                disabled={disableSearch}
                onClick={handleSubmit}
              >
                search
              </Button>
              <AccountProfile/>
            </Toolbar>
          </AppBar>
        </Box>

      </ThemeProvider>
    </>
  );
}

export default BaseNavBar;
