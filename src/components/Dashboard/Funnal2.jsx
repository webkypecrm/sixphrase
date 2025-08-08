import React, { Fragment } from "react";
import { Unstable_FunnelChart as FunnelChart } from "@mui/x-charts-pro/FunnelChart";
import Stack from "@mui/material/Stack";

const data = [
  { value: 2700000, label: "Invoiced Amount", color: "#1E90FF" },
  { value: 1600000, label: "Received Amount", color: "#47F455" },
  { value: 600000, label: "Due Amount", color: "#F8F852" },
  { value: 400000, label: "Cancelled Amount", color: "#FC3737" },
  { value: 100000, label: "Hold Amount", color: "#F575EB" },
];

const Funnal2 = () => {
  return (
    <Fragment>
      <div className="card-body">
        <div className="statistic-header">
          <h4 >
            <i className="ti ti-grip-vertical me-1" />
            Payment Flow
          </h4>
        </div>
        <Stack sx={{ width: "100%" }}>
          <FunnelChart
            series={[
              {
                data,
                layout: "horizontal",
                curve: "bump",
                valueFormatter: (value) => `₹ ${value.value.toLocaleString()}`, 
              },
            ]}
            gap={5}
            height={300}
          />
        </Stack>
      </div>
    </Fragment>
  );
};

export default Funnal2;