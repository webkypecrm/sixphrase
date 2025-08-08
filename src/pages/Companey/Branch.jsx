import React, { Fragment, useEffect, useState } from "react";
import { Await, Link } from "react-router-dom";
import { all_routes } from "../Router/all_routes";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../components/Table/DataTable";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import EditBranch from "./EditBranch";

const Branch = () => {
  const [branchData, getBranchData] = useState();
  const [count, setCount] = useState(0);
  const [branchId, setBranchId] = useState();
  const [editBranchToggle, setEditBranchToggle] = useState(false);

  const route = all_routes;
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  //   Get all Branch
  const fatchBranchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/product/get-company-with-branch`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      getBranchData(res.data.data);
      setCount(res.data.totalCount);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    fatchBranchData();
  }, []);


  //   Delete Branch
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${apiUrl}/product/delete-company-branch/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      fatchBranchData();
      toast.success("Branch deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <div>ID : {record?.userCompany?.companyID}</div>
          </li>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link to="#" className="company-img">
                <img
                  src={record?.userCompany?.logo}
                  alt=""
                  style={{ height: "100%", width: "100%" }}
                />
              </Link>
            </div>
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Company",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link
                to="#"
                //  {route.companyDetails}
                className="profile-split"
              >
                {record?.userCompany?.companyName}
              </Link>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Type :</span>{" "}
              {record?.userCompany?.companyType}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>GST :</span>{" "}
              {record?.userCompany?.companyGST}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>PAN :</span>{" "}
              {record?.userCompany?.companyPAN}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Website</span> :{" "}
              <a
                href={
                  record?.userCompany?.website.startsWith("http")
                    ? record?.userCompany?.website
                    : `${record?.userCompany?.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {record?.website}
              </a>
            </div>
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Branch Address",
      dataIndex: "status",
      render: (text, record) => {
        const fullAddress = record?.address || "";
        const words = fullAddress.split(" ");
        const shortAddress =
          words.length > 4 ? words.slice(0, 4).join(" ") + "..." : fullAddress;

        return (
          <ul>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>Name</span> : {record?.name}
              </div>
            </li>
            <li>
              <div
                data-tooltip-id={`address`}
                data-tooltip-content={fullAddress}
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontWeight: "500" }}>Head Office</span> :{" "}
                {shortAddress}
              </div>
            </li>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>Total Staff</span> :{" "}
                {record?.totalStaff}
              </div>
            </li>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>Website</span> :{" "}
                {record?.website}
              </div>
            </li>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>State</span> :{" "}
                {record?.state}
              </div>
            </li>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>City</span> : {record?.city}
              </div>
            </li>
            <Tooltip
              id={`address`}
              place="top"
              style={{
                maxWidth: "320px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                position: "absolute",
                zIndex: 9999,
                fontSize: "13px",
              }}
            />
          </ul>
        );
      },
    },

    {
      title: "Primary Bank",
      dataIndex: "phone",
      render: (text, record) => (
        <ul>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Acc No</span> :{" "}
              {record?.bankAccountNumber}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Bank</span> :{" "}
              {record?.bankAccountName}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Branch</span> :{" "}
              {record?.bankAddress}
            </div>
          </li>
        </ul>
      ),
    },
    {
      title: "Contact Person",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>{record?.contactPerson}</span>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>{record?.contactNumber}</span>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>{record?.designation}</span>
            </div>
          </li>
          {/* <li>
            <div>
              <span style={{ fontWeight: "500" }}>Website</span> :{" "}
              <Link to="#">gajenn@webkype.com</Link>
            </div>
          </li> */}
        </ul>
      ),
    },
    {
      title: "Action",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link
              className=""
              to="#"
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Edit Branch"
              onClick={() => {
                setEditBranchToggle(true);
                setBranchId(record.id);
              }}
            >
              <i className="ti ti-edit me-2" />
            </Link>
          </li>
          <li>
            <Link
              className=""
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_branch"
              onClick={() => setBranchId(record.id)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Branch"
            >
              <i className="ti ti-trash text-danger me-2" />
            </Link>
          </li>
          <li>
            <div className="status-toggle">
              <input
                type="checkbox"
                id={`disable-${index}`}
                className="check"
              />
              <label htmlFor={`disable-${index}`} className="checktoggle" />
            </div>
          </li>
          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-4">
                    <h4 className="page-title">
                      Branches<span className="count-title">{count}</span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              <div className="card main-card">
                <div className="card-body">
                  {/* Contact List */}
                  <div className="table-responsive custom-table">
                    <DataTable
                      columns={columns}
                      dataSource={branchData}
                      disableSelection={true}
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
                  {/* /Contact List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Branch Modal */}
      <div className="modal custom-modal fade" id="delete_branch" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Remove Branch?</h3>
                <p className="del-info">Are you sure you want to remove it.</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    // onClick={handleDelete}
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Branch Modal */}

      {/* edit Branch */}
      <div
        className={
          editBranchToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <EditBranch
          editBranchToggle={editBranchToggle}
          setEditBranchToggle={setEditBranchToggle}
          branchId={branchId}
          fatchBranchData={fatchBranchData}
        />
      </div>
      {/* edit Branch */}
    </Fragment>
  );
};

export default Branch;
