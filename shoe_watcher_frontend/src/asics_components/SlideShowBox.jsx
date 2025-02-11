import React from "react"
import Carousel from "react-bootstrap/Carousel";

function SlideShowBox(props) {
  
  return(
    <Carousel.Item>
    <img
      className="d-block w-100"
      src={props.dataMap.get("img_link")} alt="running shoes"
      style={{ width: 300, height: 300 }}
    />
    <a className="item_title" href={props.dataMap.get("html_link")}>{props.dataMap.get("shoe_name")}</a>
    <p className="info">price: ${props.dataMap.get("price")}</p>
  </Carousel.Item>
    
  )
}

export default SlideShowBox