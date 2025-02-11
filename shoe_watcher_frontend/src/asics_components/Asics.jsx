import * as React from "react";
import BaseNavBar from "./BaseNavBar";
import ExpandableCheckBox from "./ExpandableCheckBox";
import DualSlider from "./DualSlider";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import BodyDisplay from "./BodyDisplay";
import Grid from "@mui/material/Grid";
import SortingDropdown from "./SortingDropdown";
import { useSelector } from "react-redux";
import SubscribeTable from "./profile/SubscribeTable";
import {
  selectDataList,
  selectSearchState,
} from "./features/dataList/panelSlice";
import { selectSortingStyle } from "./features/searchParameter/searchParamSlice";
import { Outlet, Route, Routes } from "react-router-dom";
import ProfilePage from "./profile/ProfilePage";
import ResetPasswordPage from "./reset_password/ResetPasswordPage";
import Setting from "./profile/Setting";
import Security from "./profile/Security";


function Asics() {
  // no double useeffect
  const storedList = useSelector(selectDataList);
  const searchState = useSelector(selectSearchState);
  const genderlist = ["women", "men", "kids"];
  const showgender = [true, true, true];
  const conditionlist = ["New", "Road-tested"];
  const showCondition = [true, false];
  const defaultSort = useSelector(selectSortingStyle);
  return (
    <>
      <Routes>
        <Route
          path="/profile"
          element={
            <>
              <ProfilePage />
            </>
          }
        >
          <Route
            path="setting"
            element={
              <div className="profile_box">
                <Setting />
              </div>
            }
          />
          <Route
            path="security"
            element={
              <>
                <div className="profile_box"><Security/></div>
              </>
            }
          />
          <Route
            path="subscribed"
            element={
              <>
                <div className="profile_box">
                  <SubscribeTable />
                </div>
              </>
            }
          />
        </Route>
        <Route path="/reset_password" element={<ResetPasswordPage />} />
        <Route
          path="/test"
          element={
            <>
              <div>parent</div> <Outlet />
            </>
          }
        >
          <Route
            index
            element={
              <div>
                <h1>test1</h1>
              </div>
            }
          />
          <Route
            path="2"
            element={
              <div>
                <h1>test2</h1>
              </div>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <>
              <BaseNavBar page_title={"Asics watcher"} />
              <Grid container spacing={2}>
                <Grid item>
                  <Box sx={{ flexGrow: 10 }}>
                    <AppBar className="side_navbar">
                      <Toolbar>
                        <Box sx={{ width: "100%", maxWidth: "100%" }}>
                          <Box sx={{ p: 1 }}>
                            <ExpandableCheckBox
                              key="genderBox"
                              name={"gender"}
                              checkBoxType={genderlist}
                              checkBoxVal={showgender}
                            />
                          </Box>

                          <Box sx={{ p: 1 }}>
                            <ExpandableCheckBox
                              key="conditionBox"
                              name={"condition"}
                              checkBoxType={conditionlist}
                              checkBoxVal={showCondition}
                            />
                          </Box>

                          <Box sx={{ p: 1 }}>
                            <DualSlider
                              name={"price range"}
                              minVal={1}
                              maxVal={400}
                            />
                          </Box>
                        </Box>
                      </Toolbar>
                    </AppBar>
                  </Box>
                </Grid>
                <Grid item>
                  <div className="sorting_menu">
                    <SortingDropdown
                      showDrop={searchState}
                      defaultOption={defaultSort}
                    />
                  </div>
                  <div className="bodydisplay">
                    <BodyDisplay
                      datalist={storedList}
                      searchState={searchState}
                    />
                  </div>
                </Grid>
              </Grid>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default Asics;
