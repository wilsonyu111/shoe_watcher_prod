import React from "react";
import SubscribeButton from "./SubscribeButton";
import PriceHistoryButton from "./PriceHistoryButton";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Box(props) {
  return (
    <div className="shoe_card">
      <Card className="card_tile">
        <CardMedia
          className="card_image"
          component="img"
          image={props.dataMap.get("img_link")}
          alt={props.dataMap.get("shoe_name")}
        />
        <CardContent>
          <Typography className="tile_title">
            <Link
              className="item_title"
              href={props.dataMap.get("html_link")}
              underline="hover"
            >
              {props.dataMap.get("shoe_name")}
            </Link>
          </Typography>

          <Typography className="tile_info" noWrap>
            {props.dataMap.get("gender")}
          </Typography>
          <Typography className="tile_info" noWrap>
            asics id: {props.dataMap.get("shoe_style")}
          </Typography>
          <Typography className="tile_info" noWrap>
            in stock: {props.dataMap.get("in_stock")}
          </Typography>
          <Typography className="tile_info" noWrap>
            online: {props.dataMap.get("online_status")}
          </Typography>
          <Typography className="tile_info" noWrap>
            price: ${props.dataMap.get("price")}
          </Typography>
        </CardContent>
        <CardActions disableSpacing className="tile_control_button">
          <SubscribeButton
            sfccid={props.dataMap.get("sfccid")}
            html_link={props.dataMap.get("html_link")}
            dataMap={props.dataMap}
          />
          <PriceHistoryButton
            sfccid={props.dataMap.get("sfccid")}
            html_link={props.dataMap.get("html_link")}
            dataMap={props.dataMap}
          />
        </CardActions>
      </Card>
    </div>
  );
}

export default Box;
