import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/Table/DataTable";
import { Table } from "antd";
import moment from "moment";
import DeleteData from "../DeleteData/DeleteData";
import { toast } from "react-toastify";
import axios from "axios";
import LeadPreview from "./Lead Preview/LeadPreview";
import AssignTo from "./AssignTo";
import ChangeStage from "./ChangeStage";
import MultipleAssignTo from "./MultipleAssignTo";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../pages/Router/all_routes";
import serviceImg from "../../../public/Media.png";

const ManageLeadList = ({
  data,
  onLeadDetails,
  togglePopup,
  fetchLeadData,
  manageColumns,
  pageSize,
  totalPages,
  leadForOpitons,
  serviceOpitons,
}) => {
  const [leadId, setLeadId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const [leadPreview, setLeadPreview] = useState(false);
  const [leadDetails, setLeadDetails] = useState({});
  const [leadForAssign, setLeadForAssign] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [addService, setAddService] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  function getDate(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);
    // Format date into "DD MMM YYYY"
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  }

  // console.log("leadDetails =>", leadDetails)
  const route = all_routes;

  function getTime(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);
    // Get hours, minutes, and determine AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  const toggleServicePopup = () => {
    setAddService((prev) => !prev);
  };

  const togglePopupTwo = () => {
    togglePopup((prev) => !prev);
  };
  const handleDelete = async () => {
    if (leadId) {
      try {
        const response = await axios.delete(
          `${apiUrl}/lead/delete-lead/${leadId}`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        fetchLeadData();
        toast.success(response?.data?.message);
        setLeadId(null);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleFetchData = (page) => {
    fetchLeadData(page);
  };
  console.log(data, "data");

  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const handleServiceClick = (id) => {
    setSelectedServiceId(id);
    toggleServicePopup();
  };

  useEffect(() => {
    console.log("Service ID updated:", selectedServiceId);
  }, [selectedServiceId]);

  // get Detail by id
  const [get, setGet] = useState(false);
  const getDetailById = async (id) => {
    try {
      const res = await axios.get(
        `${apiUrl}/lead/get-lead-by-id/${selectedServiceId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setGet(res.data.data);
      console.log("id", res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // add service
  const handleAddService = async () => {
    try {
      if (!selectedServiceId) {
        toast.error("No service ID selected");
        return;
      }

      if (selectedServiceIds.length === 0) {
        toast.error("Please select at least one service ID from the table");
        return;
      }

      // Step 1: GET the existing data by ID
      const getResponse = await axios.get(
        `${apiUrl}/lead/lead-details/${selectedServiceId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      const leadData = getResponse?.data.data;

      if (!leadData) {
        toast.error("Lead data not found");
        return;
      }

      const {
        leadId,
        leadPic,
        owner,
        ownerId,
        ownerImg,
        createdAt,
        updatedAt,
        industryId,
        assignedTo,
        stageId,
        estimateCost,
        totalEstimateCost,
        totalDiscount,
        totalSales,
        remark,
        facebookUniqueId,
        leadForId,
        company,
        source,
        staff,
        stage,
        country,
        city,
        state,
        Category,
        Service,
        LeadFor,
        Customer,
        LeadService,
        staffName,
        assignedId,
        ownerImgUrl,
        leadPicUrl,
        ...cleanedData
      } = leadData;

      const updatedData = {
        ...cleanedData,
        productServiceId: selectedServiceIds, // 👈 Send selected IDs here
      };

      // Step 2: PUT the same data back to update
      const putResponse = await axios.put(
        `${apiUrl}/lead/update-service-lead/${selectedServiceId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      fetchLeadData();
      toast.success(putResponse?.data?.message);
      toggleServicePopup();
    } catch (error) {
      toast.error(error.message);
    }
  };

  let columns = [
    // {
    //   title: () => {
    //     return (
    //       <div
    //         data-bs-toggle="modal"
    //         data-bs-target="#multiple_assigned_to"
    //         style={{ cursor: "pointer" }}
    //       >
    //         {selectedRowKeys.length > 0 ? "🔂" : ""}
    //       </div>
    //     );
    //   },
    //   dataIndex: "",
    // },
    // {
    //   title: "LID",
    //   dataIndex: "leadId",
    //   key: "leadId",
    //   render: (text, record) => {
    //     return (
    //       <Link
    //         to={`/sales/leads-details/${record?.leadId}`}
    //         className="table-avatar d-flex align-items-center"
    //         style={{ cursor: "pointer" }}
    //       >
    //         <ul>
    //           <li>{text}</li>
    //         </ul>
    //       </Link>
    //     );
    //   },
    //   sorter: (a, b) => a.leadId - b.leadId,
    // },
    // {
    //   title: "Source",
    //   dataIndex: "source",
    //   key: "source",
    //   sorter: (a, b) => a.source.length - b.source.length,
    //   render: (text, record) => {
    //     return (
    //       <Link
    //         to={`/sales/leads-details/${record?.leadId}`}
    //         className="table-avatar d-flex align-items-center"
    //         style={{ cursor: "pointer" }}
    //       >
    //         <ul>
    //           <li>{text}</li>
    //         </ul>
    //       </Link>
    //     );
    //   },
    // },
    {
      title: "Lead",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => {
        // return  moment(text).format("DD MMM YYYY, hh:mm a");
        return (
          <ul>
            <li>
              <div className="table-avatar d-flex align-items-center">
                <div className="grid-footer d-flex justify-content-between">
                  <div className="users-group">
                    <ul>
                      <li>
                        <Link to="#">
                          {record?.ownerImg ? (
                            <span className="menu-list-icon ">
                              <img src={record?.ownerImg} />
                            </span>
                          ) : (
                            <span className="menu-list-icon ">
                              <i className="ion-person" />
                            </span>
                          )}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <Link to="#" style={{ marginLeft: "2px" }}>
                  {record.owner}
                </Link>
              </div>
            </li>
            <li>{moment(record.createdAt).format("DD MMM YYYY, hh:mm a")}</li>
            <li>
              <strong>Source:</strong> {record.source}
            </li>
            <li>
              <strong>LID:</strong> {record?.leadId}
            </li>
          </ul>
        );
      },
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    //   render: (text) => {
    //     return moment(text).format("DD MMM YYYY, hh:mm a");
    //   },
    // },
    {
      title: "Service Name",
      dataIndex: "leadId",
      key: "leadId",
      render: (text, record) => {
        return (
          <ul>
            <li>
              {record?.ProductService?.serviceImageUrl ? (
                <img
                  src={record?.ProductService?.serviceImageUrl}
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <img
                  src={serviceImg}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                />
              )}
            </li>
            <li>
              {/* <p>Not Qualified</p> */}
              {record?.ProductService?.serviceName ? (
                <p>{record?.ProductService?.serviceName}</p>
              ) : (
                <p>Lead Only</p>
              )}
              {/* <p>{record?.ProductService?.serviceName}</p> */}
            </li>
          </ul>
        );
      },
    },
    {
      title: "Lead Details",
      dataIndex: "leadId",
      key: "leadId",
      render: (text, record) => {
        return (
          <ul>
            {record?.leadName && (
              <li className="">
                <Link
                  to={`/sales/leads-details/${record?.leadId}`}
                  className="table-avatar d-flex align-items-center leade-name-hover"
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ color: "blue" }}>
                    <i className="ti ti-user-up" />
                  </span>
                  <ul style={{ marginLeft: "20px" }}>
                    <li>{record?.leadName.slice(0, 15)}</li>
                  </ul>
                </Link>
              </li>
            )}
            {record?.leadEmail && (
              <li>
                <Link
                  to={`/sales/leads-details/${record?.leadId}`}
                  className="table-avatar d-flex align-items-center"
                >
                  <span
                    //   className="company-img menu-list-icon "
                    style={{ color: "blue" }}
                  >
                    <i className="ti ti-mail" />
                  </span>
                  <ul style={{ marginLeft: "20px" }}>
                    <li>{record?.leadEmail}</li>
                  </ul>
                </Link>
              </li>
            )}
            {record?.leadMobile1 && (
              <li>
                <div className="table-avatar d-flex align-items-center">
                  <span style={{ color: "blue" }}>
                    <i className="ti ti-phone" />
                  </span>
                  <ul style={{ marginLeft: "20px" }}>
                    <li>{record?.leadMobile1}</li>
                  </ul>
                </div>
              </li>
            )}
            {record?.leadMobile2 && (
              <li>
                <div className="table-avatar d-flex align-items-center">
                  <span style={{ color: "blue" }}>
                    <i className="ti ti-phone" />
                  </span>
                  <ul style={{ marginLeft: "20px" }}>
                    <li>{record?.leadMobile2}</li>
                  </ul>
                </div>
              </li>
            )}
            {/* {record?.company?.companyName && ( */}
            <li>
              <div className="table-avatar d-flex align-items-center">
                <span style={{ color: "blue" }}>
                  {/* <i className="ti ti-building" /> */}
                  <i className="ti ti-building" />
                </span>
                <ul style={{ marginLeft: "20px" }}>
                  <p>{record?.company?.companyName || "Individual"}</p>
                </ul>
              </div>
              {/* <ul>   <span className="company-img menu-list-icon">
              <i className="ti ti-company" />
            </span>
            <li>
              
            </li>
          </ul> */}
            </li>
            {/* )} */}
            <li>
              <OverlayTrigger
                placement="top"
                overlay={
                  record?.FollowUp?.[0]?.comment || record?.description ? (
                    <Tooltip id={`${record?.leadId}`}>
                      {record?.FollowUp?.[0]?.comment || record?.description}
                    </Tooltip>
                  ) : (
                    <></>
                  )
                }
              >
                <Link
                  to={`/sales/leads-details/${record?.leadId}`}
                  className="table-avatar d-flex align-items-center"
                >
                  {/* <span className="company-img menu-list-icon "> */}
                  <span
                    // className="company-img menu-list-icon"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "blue",
                    }}
                  >
                    {/* <span>{record?.FollowUp?.length || 1}</span> */}
                    <i className="fa-regular fa-message fa-sm"></i>
                  </span>

                  <ul style={{ marginLeft: "20px" }}>
                    <li>
                      {record?.FollowUp?.[0]?.comment.slice(0, 12) ||
                        record?.description.slice(0, 15)}
                      {"..."}
                    </li>
                  </ul>
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        );
      },
    },
    // {
    //   title: "Last Comment",
    //   dataIndex: "leadId",
    //   key: "leadId",
    //   render: (text, record) => {
    //     return (
    //       <OverlayTrigger
    //         placement="right"
    //         overlay={
    //           record?.FollowUp?.[0]?.comment || record?.description ? (
    //             <Tooltip id={`${record?.leadId}`}>
    //               {record?.FollowUp?.[0]?.comment || record?.description}
    //             </Tooltip>
    //           ) : (
    //             <></>
    //           )
    //         }
    //       >
    //         <Link
    //           to={`/sales/leads-details/${record?.leadId}`}
    //           className="table-avatar d-flex align-items-center"
    //         >
    //           {/* <span className="company-img menu-list-icon "> */}
    //           <span
    //             className="company-img menu-list-icon"
    //             style={{ display: "flex", alignItems: "center", gap: "5px" }}
    //           >
    //             <span>{record?.FollowUp?.length || 1}</span>
    //             <i className="fa-regular fa-message fa-sm"></i>
    //           </span>

    //           <ul>
    //             <li>
    //               {record?.FollowUp?.[0]?.comment.slice(0, 12) ||
    //                 record?.description.slice(0, 15)}
    //               {"..."}
    //             </li>
    //           </ul>
    //         </Link>
    //       </OverlayTrigger>
    //     );
    //   },
    // },
    // {
    //   title: "Lead Email",
    //   dataIndex: "leadId",
    //   key: "leadId",
    //   render: (text, record) => {
    //     return (
    //       <Link
    //         to={`/sales/leads-details/${record?.leadId}`}
    //         className="table-avatar d-flex align-items-center"
    //       >
    //         <span
    //           className="company-img menu-list-icon "
    //           style={{ color: "#e9e9f" }}
    //         >
    //           <i className="ti ti-mail" />
    //         </span>
    //         <ul>
    //           <li>{record?.leadEmail}</li>
    //         </ul>
    //       </Link>
    //     );
    //   },
    // },
    // {
    //   title: "Lead Mobile1",
    //   dataIndex: "mobile1",
    //   key: "mobile1",
    //   render: (text, record) => {
    //     return (
    //       <div className="table-avatar d-flex align-items-center">
    //         <span className="company-img menu-list-icon">
    //           <i className="ti ti-phone" />
    //         </span>
    //         <ul>
    //           <li>{record?.leadMobile1}</li>
    //         </ul>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Lead Mobile2",
    //   dataIndex: "mobile2",
    //   key: "mobile2",
    //   render: (text, record) => {
    //     return (
    //       <div className="table-avatar d-flex align-items-center">
    //         <span className="company-img menu-list-icon">
    //           <i className="ti ti-phone" />
    //         </span>
    //         <ul>
    //           <li>{record?.leadMobile2}</li>
    //         </ul>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Lead Mobile3",
      dataIndex: "mobile3",
      key: "mobile3",
      render: (text, record) => {
        return (
          <div className="table-avatar d-flex align-items-center">
            <span className="company-img menu-list-icon ">
              <i className="ti ti-phone" />
            </span>
            <ul>
              <li>{record?.leadMobile3}</li>
            </ul>
          </div>
        );
      },
    },
    // {
    //   title: "Company Name",
    //   key: "leadId",
    //   render: (text, record) => {
    //     return (
    //       <ul>
    //         <li>
    //           <p>{record?.company?.companyName || "Individual"}</p>
    //         </li>
    //       </ul>
    //     );
    //   },
    // },
    // {
    //   title: "Industry",
    //   key: "leadId",
    //   render: (text, record) => {
    //     return (
    //       <ul>
    //         <li>
    //           <p className="badge badge-tag badge-secondary">
    //             {record?.Category?.name || ""}
    //           </p>
    //         </li>
    //       </ul>
    //     );
    //   },
    // },
    {
      title: "Requirement",
      dataIndex: "leadFor",
      key: "leadFor",
      render: (text, record) => {
        return (
          <ul>
            <li>
              <ul>
                <li>
                  <p className="badge badge-tag badge-secondary ">
                    {record?.Category?.name || ""}
                  </p>
                </li>
              </ul>
            </li>
            <li>
              <ul>
                {record?.leadFor.map((val, index) => {
                  const matchedOption = leadForOpitons.find(
                    (option) => option.value === val
                  );
                  return (
                    <li key={index}>
                      <p className="badge badge-tag badge-secondary mt-1">
                        {matchedOption ? matchedOption.label : val}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <p className="badge badge-tag badge-secondary mt-1">
                    {record?.Service?.name || ""}
                  </p>
                </li>
              </ul>
            </li>
          </ul>
          //   <ul>
          //     {record?.leadFor.map((val, index) => {
          //       const matchedOption = leadForOpitons.find(
          //         (option) => option.value === val
          //       );
          //       return (
          //         <li key={index}>
          //           <p className="badge badge-tag badge-secondary">
          //             {matchedOption ? matchedOption.label : val}
          //           </p>
          //         </li>
          //       );
          //     })}
          //   </ul>
        );
      },
    },
    // {
    //   title: "Service",
    //   dataIndex: "Service",
    //   key: "service",
    //   render: (text, record) => {
    //     return (
    //       <ul>
    //         <li>
    //           <p className="badge badge-tag badge-secondary">
    //             {record?.Service?.name || ""}
    //           </p>
    //         </li>
    //       </ul>
    //     );
    //   },
    // },

    {
      title: "Location",
      dataIndex: "country",
      key: "country",
      render: (text, record) => {
        return (
          <ul>
            {record?.country && (
              <li>
                <div className="table-avatar d-flex align-items-center">
                  <span style={{ color: "blue" }}>
                    <i className="ti ti-flag" />
                  </span>
                  <ul style={{ marginLeft: "10px" }}>
                    <li>{record.country}</li>
                  </ul>
                </div>
              </li>
            )}
            {record?.state?.name && (
              <li>
                <div className="table-avatar d-flex align-items-center">
                  <span style={{ color: "blue" }}>
                    <i className="ti ti-flag" />
                  </span>
                  <ul style={{ marginLeft: "10px" }}>
                    <li>{record?.state?.name || ""}</li>
                  </ul>
                </div>
              </li>
            )}
            {record?.city?.name && (
              <li>
                <div className="table-avatar d-flex align-items-center">
                  <span style={{ color: "blue" }}>
                    <i className="ti ti-flag" />
                  </span>
                  <ul style={{ marginLeft: "10px" }}>
                    <li>{record?.city?.name || ""}</li>
                  </ul>
                </div>
              </li>
            )}
          </ul>
        );
      },
    },

    // {
    //   title: "Country",
    //   dataIndex: "country",
    //   key: "country",
    //   render: (text, record) => {
    //     return (
    //       <div className="table-avatar d-flex align-items-center">
    //         <span className="company-img menu-list-icon ">
    //           <i className="ti ti-flag" />
    //         </span>
    //         <ul>
    //           <li>{record.country}</li>
    //         </ul>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "State",
    //   dataIndex: "State",
    //   key: "id",
    //   render: (text, record) => {
    //     return (
    //       <div className="table-avatar d-flex align-items-center">
    //         <span className="company-img menu-list-icon ">
    //           <i className="ti ti-flag" />
    //         </span>
    //         <ul>
    //           <li>{record?.state?.name || ""}</li>
    //         </ul>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "City",
    //   key: "leadId",
    //   render: (text, record) => {
    //     return (
    //       <div className="table-avatar d-flex align-items-center">
    //         <span className="company-img menu-list-icon ">
    //           <i className="ti ti-flag" />
    //         </span>
    //         <ul>
    //           <li>{record?.city?.name || ""}</li>
    //         </ul>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Category",
      dataIndex: "industry",
      key: "industry",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (text, record) => {
        return (
          <ul>
            {text.map((val, index) => (
              <li key={index}>
                <p className="badge badge-tag badge-purple-light">{val}</p>
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text) => {
        return <span>₹ {text}</span>;
      },
    },

    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (text, record) => {
        return (
          <div
            className="table-avatar d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#assigned_to"
            style={{ courser: "pointer" }}
            onClick={() => {
              setLeadForAssign(record);
            }}
          >
            <div className="grid-footer d-flex justify-content-between">
              <div className="users-group">
                <ul>
                  <li>
                    <Link to="#">
                      {record.staff.profilePic ? (
                        <span className="menu-list-icon ">
                          <img src={record.staff.profilePic} />
                        </span>
                      ) : (
                        <span className="menu-list-icon ">
                          <i className="ion-person" />
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <Link to="#" style={{ marginLeft: "2px" }}>
              {record.assignedTo}
            </Link>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "leadId",
      key: "leadId",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link
              to="#"
              onClick={() => {
                setLeadPreview((prev) => !prev);
                setLeadDetails((prev) => ({ ...record }));
              }}
            >
              <i className=" ti ti-eye me-2"></i>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#create_call"
              onClick={() => {
                setLeadDetails((prev) => ({ ...record }));
              }}
            >
              <i className="ti ti-phone-check me-2"></i>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_notes"
              onClick={() => {
                setLeadDetails((prev) => ({ ...record }));
              }}
            >
              <i className="ti ti-calendar-month me-2"></i>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_comments"
              onClick={() => {
                setLeadDetails((prev) => ({ ...record }));
              }}
            >
              <i className="ti ti-note me-2"></i>
            </Link>
          </li>
          <li>
            <Link
              className=""
              to="#"
              onClick={() => {
                togglePopupTwo(true), onLeadDetails(record);
              }}
            >
              <i className="ti ti-edit me-2" />
            </Link>
          </li>
          <li className="">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip
                  id="call-history-tooltip"
                  className="custom-call-tooltip"
                >
                  Call History
                </Tooltip>
              }
            >
              <Link to={route.callHistory} className=" btn-help">
                <i className="ti ti-history-toggle " />
              </Link>
            </OverlayTrigger>
          </li>
        </div>
      ),
    },
    // {
    //   title: "Updates",
    //   dataIndex: "leadId",
    //   key: "leadId",
    //   render: (text, record, index) => (
    //     <div className="social-links d-flex align-items-center" key={index}>
    //       <li>
    //         <Link
    //           to="#"
    //           onClick={() => {
    //             setLeadPreview((prev) => !prev);
    //             setLeadDetails((prev) => ({ ...record }));
    //           }}
    //         >
    //           <i className=" ti ti-eye me-2"></i>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#create_call"
    //           onClick={() => {
    //             setLeadDetails((prev) => ({ ...record }));
    //           }}
    //         >
    //           <i className="ti ti-phone-check me-2"></i>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#add_notes"
    //           onClick={() => {
    //             setLeadDetails((prev) => ({ ...record }));
    //           }}
    //         >
    //           <i className="ti ti-calendar-month me-2"></i>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#add_comments"
    //           onClick={() => {
    //             setLeadDetails((prev) => ({ ...record }));
    //           }}
    //         >
    //           <i className="ti ti-note me-2"></i>
    //         </Link>
    //       </li>
    //     </div>
    //   ),
    // },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (text, record) => (
        <Link
          data-bs-toggle="modal"
          data-bs-target="#stage_update"
          style={{ cursor: "pointer", display: "grid" }}
          onClick={() => {
            setLeadForAssign(record);
          }}
        >
          <span className="badge bg-outline-dark text-dark">{text}</span>
          {Array.isArray(record?.Customer) &&
            record?.Customer.length > 0 &&
            record?.Customer[0]?.createdAt && (
              <span
                className="badge-day"
                style={{ fontSize: "x-small", margin: "0", maxWidth: "7rem" }}
              >
                {getDate(record?.Customer[0]?.createdAt)},
                {getTime(record?.Customer[0]?.createdAt)}
              </span>
            )}
        </Link>
      ),
      sorter: true,
    },
    {
      title: "Facebook Remarks",
      dataIndex: "remark",

      render: (text, record, index) => {
        let a = record?.remark ?? "";

        // Check if 'a' is a string, and try parsing it as JSON
        if (typeof a === "string") {
          try {
            a = JSON.parse(a); // Convert string to JSON
          } catch (error) {
            console.error("Invalid JSON in remark:", a);
            return "N/A"; // Return empty if parsing fails
          }
        }

        // Ensure 'a' is an array before mapping
        if (!Array.isArray(a)) {
          return "N/A";
        }

        // Function to break text every 'n' words with <br />
        const breakText = (text, n) => {
          const words = text.split(" ");
          return words
            .map((word, i) => (i > 0 && i % n === 0 ? `<br />${word}` : word))
            .join(" ");
        };

        return (
          <div>
            {a.map((item, idx) => {
              // Convert name to a readable format
              const readableName = item.name
                .replace(/_/g, " ") // Replace underscores with spaces
                .replace(/[?&]/g, ""); // Remove special characters

              // Break readableName every 7 words
              const formattedName = breakText(readableName, 7);

              // Break answer every 7 words
              const formattedAnswer = breakText(item.values.join(", "), 7);

              return (
                <div key={idx}>
                  <strong
                    dangerouslySetInnerHTML={{ __html: formattedName }}
                  ></strong>
                  : <br />
                  <span
                    dangerouslySetInnerHTML={{ __html: formattedAnswer }}
                  ></span>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Service",
      dataIndex: "service",
      render: (text, record) => (
        <div className="export-list text-sm-end">
          <ul className="d-flex justify-content-center align-items-center flex-direction-column">
            <li className="me-0">
              <button
                to="#"
                className="btn btn-primary add-popup"
                data-bs-toggle="modal"
                data-bs-target="#create_call"
              >
                <i className="ti ti-square-rounded-plus" />
                Call
              </button>
            </li>

            <li>
              {record?.ProductService?.id ? (
                <button to="#" className="btn btn-primary add-popup" disabled>
                  <i className="ti ti-square-rounded-plus" />
                  Service
                </button>
              ) : (
                <button
                  to="#"
                  className="btn btn-primary add-popup"
                  onClick={() => handleServiceClick(record.leadId)}
                >
                  <i className="ti ti-square-rounded-plus" />
                  Service
                </button>
              )}
              {/* <button
                to="#"
                className="btn btn-primary add-popup"
                onClick={() => handleServiceClick(record.leadId)}
              >
                <i className="ti ti-square-rounded-plus" />
                Service
              </button> */}
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // Service
  const columns2 = [
    {
      title: "SID",
      dataIndex: "sid",
      key: "sid",
      render: (text, record) => (
        <ul>
          <li>
            <Link to="#" className="table-avatar ">
              <Link to="#" className="profile-split d-flex flex-column">
                ID : {record?.id}
              </Link>
            </Link>
          </li>
          <li>
            <strong>HSN :</strong> {record?.serviceHSNcode}
          </li>
        </ul>
      ),
    },

    {
      title: "Services Info",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <strong>{record?.serviceName}</strong>
          </li>
        </ul>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Category",
      dataIndex: "phone",
      render: (text, record) => (
        <ul>
          <li>{record?.productServiceCategory?.name}</li>
          <li>{record?.productServiceSubCategory?.name}</li>
          <li>{record?.productServiceSubSubCategory?.name}</li>
        </ul>
      ),
      sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Service Pic",
      dataIndex: "email",
      render: (text, record) => (
        <div className="product-img">
          <div className="product-img-box">
            <img
              src={record?.serviceImage}
              alt=""
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Service Type",
      dataIndex: "tags",
      render: (text, record) => (
        <ul>
          <li>
            <strong>{record?.serviceType}</strong>
          </li>
        </ul>
      ),

      sorter: (a, b) => a.tags.length - b.tags.length,
    },

    {
      title: "Pricing",
      dataIndex: "tags",
      render: (text, record) => (
        <ul>
          <li>
            <strong>Rate :</strong> {record?.serviceRate}
          </li>
          <li>
            <strong>Discount :</strong> {record?.discountPercentage}
          </li>
          <li>
            <strong>Discount Value :</strong> {record?.discountValue}
          </li>
          <li>
            <strong>Final :</strong> {record?.finalPrice}
          </li>
        </ul>
      ),

      sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "OEM / Brand",
      dataIndex: "location",
      render: (text, record) => (
        <ul>
          <li>{record?.productOEM?.name}</li>
          <li>{record?.productBrand?.name}</li>
        </ul>
      ),
      sorter: (a, b) => a.location.length - b.location.length,
    },

    // {
    //   title: "Action",
    //   render: (text, record, index) => (
    //     <div className="social-links d-flex align-items-center" key={index}>
    //       <li>
    //         <Link
    //           to="#"
    //           onClick={() => {
    //             setLeadPreview((prev) => !prev);
    //             setLeadDetails((prev) => ({ ...record }));
    //           }}
    //         >
    //           <i className=" ti ti-eye me-2"></i>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           className=""
    //           to="#"
    //           onClick={() => handleEditClick(record.id)}
    //         >
    //           <i className="ti ti-edit me-2" />
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           className=""
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#delete_contact"
    //           onClick={() => setServiceDetails(record)}
    //           data-tooltip-id={`tooltip-${index}`}
    //           data-tooltip-content="Delete Service"
    //         >
    //           <i className="ti ti-trash text-danger me-2" />
    //         </Link>
    //       </li>
    //       <li>
    //         <div className="status-toggle">
    //           <input type="checkbox" id="disable" className="check" />
    //           <label htmlFor="disable" className="checktoggle" />
    //         </div>
    //       </li>
    //       <Tooltip id={`tooltip-${index}`} place="top" />
    //     </div>
    //   ),
    // },
    {
      title: "Purchase",
      render: (text, record, index) => (
        <div className="submit-button text-end">
          <Link to="#" className="btn btn-light sidebar-close2">
            Create Purchase
          </Link>
        </div>
      ),
    },
    {
      title: "Sale",
      render: (text, record, index) => (
        <div className="submit-button text-end">
          <Link to="#" className="btn btn-light sidebar-close2">
            Create Sale
          </Link>
        </div>
      ),
    },
  ];

  // Service Get
  const fatchServiceData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-product-service-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setServiceData(response.data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fatchServiceData();
  }, []);

  const modifiedColumns = columns.filter((column, index) => {
    if (index == 0) {
      return column;
    }
    for (const ele in manageColumns) {
      if (column.title == ele && manageColumns[ele] == true) {
        return column;
      }
    }
  });

  return (
    <>
      <div className="table-responsive custom-table">
        <DataTable
          dataSource={data}
          columns={modifiedColumns}
          onSelectionChange={handleSelectedRowKeysChange}
          pageSize={pageSize}
          totalPages={totalPages}
          onFetchRecord={handleFetchData}
        />
      </div>
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="datatable-length" />
        </div>
        <div className="col-md-6">
          <div className="datatable-paginate" />
        </div>
      </div>
      <DeleteData title="Lead" onDeleteHandler={handleDelete} />

      {/* {leadPreview && */}

      <LeadPreview
        leadPreview={leadPreview}
        setLeadPreview={setLeadPreview}
        leadDetails={leadDetails}
        setLeadDetails={setLeadDetails}
      />
      {/* } */}

      <AssignTo leadForAssign={leadForAssign} fetchLeadData={fetchLeadData} />

      <ChangeStage
        leadForAssign={leadForAssign}
        fetchLeadData={fetchLeadData}
      />

      <MultipleAssignTo
        selectedRowKeys={selectedRowKeys}
        fetchLeadData={fetchLeadData}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      {/* add service */}
      <div className={`toggle-popup ${addService ? "sidebar-popup" : ""}`}>
        <div className="sidebar-layout" style={{ maxWidth: "95%" }}>
          <div className="sidebar-header">
            <h4>Make Opportunity For ({selectedRowKeys.length})</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={toggleServicePopup}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="pro-create">
              <div className="table-responsive custom-table">
                <Table
                  columns={columns2}
                  dataSource={serviceData}
                  rowKey={(record) => record.id}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys,
                    onChange: (keys, selectedRows) => {
                      setSelectedRowKeys(keys);

                      // IDs collect karke alag state me store karo
                      const ids = selectedRows.map((row) => row.id);
                      setSelectedServiceIds(ids);
                    },
                  }}
                  scroll={{ x: "max-content" }}
                />
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="datatable-length" />
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p>
                  This Lead will be converted into an opportunity for all
                  selected services - check the <b>‘Opportunity’</b> section of
                  the Lead Flow.
                </p>
              </div>
              <div className="submit-button text-end mt-3">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={toggleServicePopup}
                >
                  Cancel
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddService(data)}
                >
                  Create Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* add service */}

      {/* {data?.length > 0 && (
        <span className="badge border border-dark text-dark">50/Page</span>
      )} */}
    </>
  );
};

export default ManageLeadList;
