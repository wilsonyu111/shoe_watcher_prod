import * as React from "react";
import ShowSkeletonBox from "./ShowSkeletonBox";
import Box from "./Box";
import LoadMore from "./LoadMore";
import store from "./app/store";
import SlideShow from "./Slideshow";

function PanelList({ datalist }) {
  function renderData() {
    const compList = [];
    if (datalist.length > 0) {
      datalist.forEach((element) => {
        const obj = new Map(Object.entries(element));
        compList.push(<Box key={obj.get("sfccid")} dataMap={obj} />);
      });
    } else {
      return <></>;
    }

    return compList;
  }

  return renderData();
}

function Message_box({ msg, img_name }) {
  return (
    <div className="message_box">
      <div className="error_msg">{msg}</div>
      <img className="error_img" src={img_name}></img>
    </div>
  );
}

function BodyDisplay({ datalist, searchState }) {
  function renderBody() {
    switch (searchState) {
      case "no_search":
        return (
          <Message_box
            key="search_msg"
            msg={"enter a name to start the search"}
            img_name={
              "/static/images/8684048_folder_file_document_search_find_icon.png"
            }
          />
        );
      case "searching":
        return <ShowSkeletonBox />;
      case "empty":
        return (
          <Message_box
            msg={
              "can't find \"" +
              store.getState().searchParam.value.shoe_name +
              '"'
            }
            img_name={
              "/static/images/7900767_error_404_found_page_page not found_icon.png"
            }
          />
        );
      case "done":
        return (
          <>
            <div className="data_tiles">
              <div className="shoe_tile">
                <PanelList datalist={datalist} />
              </div>
            </div>
          </>
        );
      default:
        return (
          <Message_box
            msg={"hmmm... something went wrong, please try again later"}
            img_name={
              "/static/images/7900825_error_404_robot_page not found_fatal_icon.png"
            }
          />
        );
    }
  }

  function renderSlideShow() {
    if (searchState !== "done") {
      return <SlideShow />;
    } else {
      return <></>;
    }
  }

  return (
    <>
      {renderSlideShow()}

      {renderBody()}
      <div className="loadmore_button">
        <LoadMore />
      </div>
    </>
  );
}

export default BodyDisplay;
