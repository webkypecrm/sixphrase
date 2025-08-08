// import React, { Fragment, useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import DataTable from "../../../components/Table/DataTable.jsx";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import TargetForm from "./TargetForm.jsx";

// const TeamMembers = ({ teamId, onCancel, isLoading }) => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [activityToggle, setActivityToggle] = useState(false);
//   const [staffId, setStaffId] = useState(null);
//   const [quarterSummaryMap, setQuarterSummaryMap] = useState({});

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const Token = localStorage.getItem("token") || "";

//   // Get Team Members
//   const getTeamMembers = async () => {
//     if (!teamId) return;
//     try {
//       const res = await axios.get(
//         `${apiUrl}/product/team-member-list-byid/${teamId}`,
//         { headers: { Authorization: `Bearer ${Token}` } }
//       );

//       setTeamMembers(res.data?.data[0]?.teamMembers || []);
//       console.log("first", res.data?.data);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };
//   console.log("teamMembers", teamMembers);

//     // Get quarter label from month
//   const getQuarter = (month) => {
//     const q1 = ["April", "May", "June"];
//     const q2 = ["July", "August", "September"];
//     const q3 = ["October", "November", "December"];
//     const q4 = ["January", "February", "March"];
//     if (q1.includes(month)) return "Q1";
//     if (q2.includes(month)) return "Q2";
//     if (q3.includes(month)) return "Q3";
//     if (q4.includes(month)) return "Q4";
//     return "";
//   };

//   // Fetch all summaries after team members load
//   const fetchAllQuarterSummaries = async (members) => {
//     const summaries = {};
//     for (const member of members) {
//       const id = member.id;
//       try {
//         const res = await axios.get(
//           `${apiUrl}/product/target-list?teamMemberId=${id}&month=&year=`,
//           { headers: { Authorization: `Bearer ${Token}` } }
//         );
//         const data = res.data.data || [];

//         const quarterTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
//         data.forEach((item) => {
//           const q = getQuarter(item.month);
//           if (q) quarterTotals[q] += parseFloat(item.salePrice || 0);
//         });

//         summaries[id] = quarterTotals;
//       } catch (err) {
//         console.error(`Failed for staffId ${id}`, err);
//       }
//     }
//     setQuarterSummaryMap(summaries);
//   };

//   // useEffect(() => {
//   //   if (teamId) {
//   //     getTeamMembers();
//   //   }
//   // }, [teamId]);

//   useEffect(() => {
//     if (teamId) {
//       getTeamMembers().then((members) => {
//         fetchAllQuarterSummaries(members);
//       });
//     }
//   }, [teamId]);

//     const handleQuarterSummary = (summary) => {
//     setQuarterSummaryMap((prev) => ({
//       ...prev,
//       [staffId]: summary,
//     }));
//   };

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "staffId",
//       render: (text, record) => (
//         <Link to="#" className="table-avatar d-flex align-items-center">
//           {record?.staff?.profilePic ? (
//             <Link to="#" className="avatar">
//               <img src={record.staff.profilePic} alt="UserImage" />
//             </Link>
//           ) : (
//             <Link to="#" className="avatar bg-pending">
//               <i className="ti ti-user" />
//             </Link>
//           )}
//           <Link className="profile-split d-flex flex-column">
//             {record.staff?.name}
//             <span>id : {record.staff?.staffId}</span>
//           </Link>
//         </Link>
//       ),
//       sorter: (a, b) => a.staff?.name?.localeCompare(b.staff?.name),
//     },
//     {
//       title: "Company/Branch",
//       dataIndex: "company",
//       key: "company",
//       render: (text, record) => (
//         <span>
//           <ul>
//             <li>{record?.staff?.userCompany?.companyName || "-"}</li>
//             <li>{record?.staff?.companyBranch?.name || "-"}</li>
//           </ul>
//         </span>
//       ),
//       //   sorter: (a, b) =>
//       //     (a.staff?.userCompany?.companyName || "").localeCompare(
//       //       b.staff?.userCompany?.companyName || ""
//       //     ),
//     },
//     {
//       title: "Contact",
//       dataIndex: "contact",
//       key: "contact",
//       render: (text, record) => (
//         <div>
//           <ul>
//             <li>{record.staff?.email || "-"}</li>
//             <li>{record.staff?.mobile || "-"}</li>
//           </ul>
//         </div>
//       ),
//       //   sorter: (a, b) =>
//       //     (a.staff?.mobile || "").localeCompare(b.staff?.mobile || ""),
//     },
//     {
//       title: "Department",
//       dataIndex: "department",
//       key: "department",
//       render: (text, record) => record.staff?.department?.name || "-",
//     },
//     {
//       title: "Role/Group",
//       dataIndex: "role",
//       key: "role",
//       render: (text, record) => (
//         <div>
//           <ul>
//             <li>{record.staff?.role?.name || "-"}</li>
//             <li>{record.staff?.group?.name || "-"}</li>
//           </ul>
//         </div>
//       ),
//     },
//     {
//       title: "Job Type",
//       dataIndex: "jobType",
//       key: "jobType",
//       render: (text, record) => record.staff?.jobType?.name || "-",
//     },
//      {
//       title: "Q1",
//       dataIndex: "q1",
//       key: "q1",
//       render: (text, record) => (
//         <span>{quarterSummaryMap[record.id]?.Q1 || "-"}</span>
//       ),
//     },
//     {
//       title: "Q2",
//       dataIndex: "q2",
//       key: "q2",
//       render: (text, record) => (
//         <span>{quarterSummaryMap[record.id]?.Q2 || "-"}</span>
//       ),
//     },
//    {
//       title: "Q3",
//       dataIndex: "q3",
//       key: "q3",
//       render: (text, record) => (
//         <span>{quarterSummaryMap[record.id]?.Q3 || "-"}</span>
//       ),
//     },
//      {
//       title: "Q4",
//       dataIndex: "q4",
//       key: "q4",
//       render: (text, record) => (
//         <span>{quarterSummaryMap[record.id]?.Q4 || "-"}</span>
//       ),
//     },

// {
//   title: "Target",
//   dataIndex: "target",
//   key: "target",
//   render: (text, record) => (
//     <div className="export-list text-sm-end">
//       <ul className="d-flex justify-content-center align-items-center flex-direction-column">
//         <li className="m-0">
//           <button
//             to="#"
//             className="btn btn-primary add-popup"
//             onClick={() => {
//               setActivityToggle(true), setStaffId(record?.id);
//             }}
//           >
//             <i className="ti ti-square-rounded-plus" />
//             Target
//           </button>
//         </li>
//       </ul>
//     </div>
//   ),
// },
//   ];

//   return (
//     <Fragment>
//       <div className="toggle-popup"></div>
      // <div className="sidebar-layout" style={{ maxWidth: "96%" }}>
      //   <div className="sidebar-header">
      //     <h4>Team Members</h4>
      //     <Link to="#" className="sidebar-close toggle-btn" onClick={onCancel}>
      //       <i className="ti ti-x" />
      //     </Link>
      //   </div>
      //   <div className="toggle-body">
      //     <div className="table-responsive custom-table">
      //       <DataTable
      //         dataSource={teamMembers}
      //         columns={columns}
      //         disableSelection={true}
      //       />
      //     </div>
      //     <div className="submit-button text-end mt-3">
      //       <Link
      //         to="#"
      //         className="btn btn-light sidebar-close"
      //         onClick={onCancel}
      //       >
      //         Cancel
      //       </Link>
      //       <button
      //         type="submit"
      //         className="btn btn-primary"
      //         disabled={isLoading}
      //       >
      //         {isLoading ? (
      //           <>
      //             <span
      //               className="spinner-border spinner-border-sm me-2"
      //               role="status"
      //               aria-hidden="true"
      //             ></span>
      //             Saving...
      //           </>
      //         ) : (
      //           "Save"
      //         )}
      //       </button>
      //     </div>
      //   </div>
      // </div>

//       {/* Add Target */}
//       <div
//         className={
//           activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
//         }
//       >
//         {/* <TargetForm
//           title="Add Target"
//           staffId={staffId}
//           onCancel={() => {
//             setActivityToggle(false);
//           }}
//         /> */}
//         <TargetForm
//           title="Add Target"
//           staffId={staffId}
//           onCancel={() => setActivityToggle(false)}
//           onQuarterSummary={handleQuarterSummary}
//         />
//       </div>
//       {/* Add Target */}
//     </Fragment>
//   );
// };

// export default TeamMembers;

import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../../components/Table/DataTable.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import TargetForm from "./TargetForm.jsx";
import { Spin } from "antd";

const TeamMembers = ({ teamId, onCancel }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [activityToggle, setActivityToggle] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [quarterSummaryMap, setQuarterSummaryMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  // Get Team Members
  const getTeamMembers = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/team-member-list-byid/${teamId}`,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      const data = res.data?.data[0]?.teamMembers || [];
      setTeamMembers(data);
      return data;
    } catch (err) {
      toast.error(err.message);
      return [];
    }
  };

  // Get quarter label from month
  const getQuarter = (month) => {
    const q1 = ["April", "May", "June"];
    const q2 = ["July", "August", "September"];
    const q3 = ["October", "November", "December"];
    const q4 = ["January", "February", "March"];
    if (q1.includes(month)) return "Q1";
    if (q2.includes(month)) return "Q2";
    if (q3.includes(month)) return "Q3";
    if (q4.includes(month)) return "Q4";
    return "";
  };

  // Fetch all summaries after team members load
 const fetchAllQuarterSummaries = async (members) => {
  setIsLoading(true);
  try {
    const requests = members.map((member) =>
      axios.get(
        `${apiUrl}/product/target-list?teamMemberId=${member.id}&month=&year=`,
        { headers: { Authorization: `Bearer ${Token}` } }
      )
    );

    const responses = await Promise.allSettled(requests);

    const summaries = {};
    responses.forEach((res, index) => {
      const id = members[index].id;
      if (res.status === "fulfilled") {
        const data = res.value.data?.data || [];
        const quarterTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

        data.forEach((item) => {
          const q = getQuarter(item.month);
          if (q) quarterTotals[q] += parseFloat(item.salePrice || 0);
        });

        summaries[id] = quarterTotals;
      } else {
        console.error(`Failed for staffId ${id}`, res.reason);
      }
    });

    setQuarterSummaryMap(summaries);
  } catch (err) {
    toast.error("Error fetching target summaries");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    if (teamId) {
      getTeamMembers().then((members) => {
        fetchAllQuarterSummaries(members);
      });
    }
  }, [teamId]);

  const handleQuarterSummary = (summary) => {
    setQuarterSummaryMap((prev) => ({
      ...prev,
      [staffId]: summary,
    }));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "staffId",
      render: (text, record) => (
        <Link to="#" className="table-avatar d-flex align-items-center">
          {record?.staff?.profilePic ? (
            <Link to="#" className="avatar">
              <img src={record.staff.profilePic} alt="UserImage" />
            </Link>
          ) : (
            <Link to="#" className="avatar bg-pending">
              <i className="ti ti-user" />
            </Link>
          )}
          <Link className="profile-split d-flex flex-column">
            {record.staff?.name}
            <span>id : {record.staff?.staffId}</span>
          </Link>
        </Link>
      ),
    },
    {
      title: "Company/Branch",
      dataIndex: "company",
      key: "company",
      render: (text, record) => (
        <span>
          <ul>
            <li>{record?.staff?.userCompany?.companyName || "-"}</li>
            <li>{record?.staff?.companyBranch?.name || "-"}</li>
          </ul>
        </span>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (text, record) => (
        <div>
          <ul>
            <li>{record.staff?.email || "-"}</li>
            <li>{record.staff?.mobile || "-"}</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text, record) => record.staff?.department?.name || "-",
    },
    {
      title: "Role/Group",
      dataIndex: "role",
      key: "role",
      render: (text, record) => (
        <div>
          <ul>
            <li>{record.staff?.role?.name || "-"}</li>
            <li>{record.staff?.group?.name || "-"}</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
      key: "jobType",
      render: (text, record) => record.staff?.jobType?.name || "-",
    },
    {
      title: "Q1",
      dataIndex: "q1",
      key: "q1",
      render: (text, record) => (
        <span>{quarterSummaryMap[record.id]?.Q1 || "0"}</span>
      ),
    },
    {
      title: "Q2",
      dataIndex: "q2",
      key: "q2",
      render: (text, record) => (
        <span>{quarterSummaryMap[record.id]?.Q2 || "0"}</span>
      ),
    },
    {
      title: "Q3",
      dataIndex: "q3",
      key: "q3",
      render: (text, record) => (
        <span>{quarterSummaryMap[record.id]?.Q3 || "0"}</span>
      ),
    },
    {
      title: "Q4",
      dataIndex: "q4",
      key: "q4",
      render: (text, record) => (
        <span>{quarterSummaryMap[record.id]?.Q4 || "0"}</span>
      ),
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      render: (text, record) => (
        <div className="export-list text-sm-end">
          <ul className="d-flex justify-content-center align-items-center flex-direction-column">
            <li className="m-0">
              <button
                to="#"
                className="btn btn-primary add-popup"
                onClick={() => {
                  setActivityToggle(true), setStaffId(record?.id);
                }}
              >
                <i className="ti ti-square-rounded-plus" />
                Target
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
        <div className="sidebar-layout" style={{ maxWidth: "96%" }}>
        <div className="sidebar-header">
          <h4>Team Members</h4>
          <Link to="#" className="sidebar-close toggle-btn" onClick={onCancel}>
            <i className="ti ti-x" />
          </Link>
        </div>
        <div className="toggle-body">
          <div className="table-responsive custom-table">
            {isLoading ? (
              <div
                style={{
                  padding: "50px 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Spin size="large" />
              </div>
            ) :(
            <DataTable
              dataSource={teamMembers}
              columns={columns}
              disableSelection={true}
            />
            )}
          </div>
          <div className="submit-button text-end mt-3">
            <Link
              to="#"
              className="btn btn-light sidebar-close"
              onClick={onCancel}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>

      {/* Target Form Modal */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <TargetForm
          title="Add Target"
          staffId={staffId}
          onCancel={() => setActivityToggle(false)}
          onQuarterSummary={handleQuarterSummary}
        />
      </div>
    </Fragment>
  );
};

export default TeamMembers;
