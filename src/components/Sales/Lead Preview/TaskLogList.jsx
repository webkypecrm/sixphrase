import React from 'react'
import { Tag } from 'antd'

const TaskLogList = ({ data }) => {
  console.log('data in taskloglist =>', data)
  function getDate(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);
    // Format date into "DD MMM YYYY"
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate
  }

  function getTime(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);
    // Get time (hours and minutes)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
  }

  return (
    <li className="timeline-inverted">
      <div className="timeline-badge bg-orange">
        <i className="fas fa-circle" />
      </div>
      <div className="timeline-panel">
        <ul>
          <li className="activity-wrap">
            <div>
              <div>
                <div className="badge-day">
                  <i className="ti ti-calendar-check" />
                  {getDate(data.createdAt)}
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <span className="activity-icon bg-orange">
                  <i className="ti ti-list-check" />
                </span>
                <div className="activity-info">
                  <h6>
                    {data?.staff?.name}, Posted Comment
                  </h6>
                  <span style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px",
                  }}>
                    Status: <div>
                      {data.status === "resolved" && (
                        <span className="badge badge-pill badge-status bg-success">
                          {data.status}
                        </span>
                      )}
                      {data.status === "open" && (
                        <span className="badge badge-pill badge-status bg-info">
                          {data.status}
                        </span>
                      )}
                      {data.status === "pending" && (
                        <span className="badge badge-pill badge-status bg-warning">
                          {data.status}
                        </span>
                      )}
                      {data.status === "closed" && (
                        <span className="badge badge-pill badge-status bg-danger">
                          {data.status}
                        </span>
                      )}
                    </div></span>
                  <span>Task Comment: {data?.comment}</span><br />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </li>
  )
}

export default TaskLogList