import React, { useState, useEffect} from "react";
import Spinner from "react-bootstrap/Spinner";
import { getSearchUrl } from "./HelperFunctions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

function PriceChart(props) {
  const [showChart, updateChart] = useState(
    <Spinner animation="border" role="status" variant="secondary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  function getResult() {
    const request = new XMLHttpRequest();

    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      if (request.readyState === 4) {

        if (request.status === 200) {
          const data = request.responseText;
          const dataMap = new Map(Object.entries(JSON.parse(data)));
          const labels = dataMap.get("label")
          const priceData = {
            labels,
            datasets: [
              {
                label: "lowest",
                data: dataMap.get("lowest"),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "highest",
                data: dataMap.get("highest"),
                borderColor: "rgb(111, 0, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          };
          updateChart(<Line data={priceData} />);
        } else {
          console.log("error fetching data");
        }
      }
    });
    const jsonData = {
      sfccid: props.sfccid,
    };
    request.open("POST", getSearchUrl("price_history"));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(jsonData));
  }

  useEffect(()=>{
    getResult()
  }, [])

  return <>{showChart}</>;
}

export default PriceChart;
