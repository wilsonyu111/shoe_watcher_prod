import Carousel from "react-bootstrap/Carousel";
import React, { useEffect, useState } from "react";
import { getSearchUrl } from "./HelperFunctions";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function SlideShow() {
  const [enableSlideShow, updateSlide] = useState(<></>);

  function getResult() {
    const request = new XMLHttpRequest();
    const dataList = [];
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      if (request.readyState === 4) {
        if (request.status === 200) {
          const data = request.responseText;
          const dataMap = new Map(Object.entries(JSON.parse(data)));
          updateSlide(
            <PanelList key={"panellist"} list={dataMap.get("result")} />
          );
        } else {
          console.log(request.responseText)
          console.log("error fetching data");
        }
      }
    });

    request.open("get", getSearchUrl("slide_show"));
    request.send();
    return dataList;
  }

  useEffect(() => {
    getResult();
  }, []);

  return enableSlideShow;
}

function PanelList(props) {
  function renderData() {
    const compList = [];
    if (props.list.length > 0) {
      props.list.forEach((element) => {
        const obj = new Map(Object.entries(element));
        compList.push(
          <Carousel.Item key={obj.get("sfccid")}>
            <img
              className="d-block w-100"
              src={obj.get("img_link")}
              alt="running shoes"
              style={{ width: 200, height: 200, marginBottom: 15 }}
            />
            <div className="slide_description">
            <Typography className="tile_title">
            <Link
              className="item_title"
              href={obj.get("html_link")}
              underline="hover"
            >
              {obj.get("shoe_name")}
            </Link>
            </Typography>
            <Typography className="tile_info" noWrap>
            price: ${obj.get("price")}
          </Typography>
            </div>

          </Carousel.Item>
        );
      });
    } else {
      return <div></div>;
    }

    return <Carousel data-bs-theme="dark">{compList}</Carousel>;
  }

  return renderData();
}

export default SlideShow;
