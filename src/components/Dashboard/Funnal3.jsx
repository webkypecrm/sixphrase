import React, { Fragment } from 'react'
import { Unstable_FunnelChart as FunnelChart } from "@mui/x-charts-pro/FunnelChart";
import Stack from "@mui/material/Stack";


const PercentageSeries = {
    data: [
      { value: 200, label: "Calls" },
      { value: 180, label: "Messages" },
      { value: 90, label: "Leads" },
      { value: 50, label: "Tasks" },
    ],
  };
const Funnal3 = () => {
  return (
    <Fragment>
          <div className="card-body">
                <div className="statistic-header">
                  <h4>
                    <i className="ti ti-grip-vertical me-1" />
                    Won By Services
                  </h4>
                </div>
                <Stack sx={{ width: "100%" }}>
                  <FunnelChart
                    series={[
                      {
                        curve:"bump",
                        layout: "vertical",
                        ...PercentageSeries,
                      },
                    ]}
                    gap={5}
                    height={350}
                    slotProps={{ legend: { direction: "vertical" } }}
                  />
                </Stack>
              </div>
        
    </Fragment>
  )
}

export default Funnal3