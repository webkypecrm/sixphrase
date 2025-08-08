import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditBranch = ({
  setEditBranchToggle,
  editBranchToggle,
  branchId,
  fatchBranchData,
}) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const initialForm2 = {
    typeHQ: "",
    name: "",
    address: "",
    state: "",
    city: "",
    pinCode: "",
    contactPerson: "",
    contactEmail: "",
    contactNumber: "",
    designation: "",
    website: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankAccountIFSC: "",
    bankAddress: "",
  };

  const [branchDataList, setBranchDataList] = useState({ ...initialForm2 });
  const [branchData, setBranchData] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  // get branch by id
  const fatchBranchDataId = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/get-company-branch-list-byid/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setBranchData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

useEffect(() => {
  if (editBranchToggle && branchId) {
    fatchBranchDataId();
  }
}, [editBranchToggle, branchId]);


  useEffect(() => {
    if (branchData) {
      setBranchDataList({
        typeHQ: branchData.typeHQ || "",
        name: branchData.name || "",
        address: branchData.address || "",
        state: branchData.state || "",
        city: branchData.city || "",
        pinCode: branchData.pinCode || "",
        contactPerson: branchData.contactPerson || "",
        contactEmail: branchData.contactEmail || "",
        contactNumber: branchData.contactNumber || "",
        designation: branchData.designation || "",
        website: branchData.website || "",
        bankAccountName: branchData.bankAccountName || "",
        bankAccountNumber: branchData.bankAccountNumber || "",
        bankAccountIFSC: branchData.bankAccountIFSC || "",
        bankAddress: branchData.bankAddress || "",
      });
    }
  }, [branchData]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setBranchDataList((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  //   update branch
  const handelBranchUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const branchRes = await axios.put(
        `${apiUrl}/product/update-company-branch/${branchId}`,
        branchDataList,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      fatchBranchData();
      setEditBranchToggle(!editBranchToggle);
      setBranchDataList({ ...initialForm2 });
      toast.success("Branch updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="sidebar-layout">
        <div className="sidebar-header">
          <h4>Edit Branch</h4>
          <Link
            to="#"
            className="sidebar-close toggle-btn"
            onClick={() => setEditBranchToggle(!editBranchToggle)}
          >
            <i className="ti ti-x" />
          </Link>
        </div>

        <div className="toggle-body">
          <form onSubmit={handelBranchUpdate} className="toggle-height">
            <div className="pro-create">
              <div className="accordion-lists" id="list-accord">
                <div className="user-accordion-item">
                  <div
                    className="accordion-collapse collapse show"
                    id="basic"
                    data-bs-parent="#list-accord"
                  >
                    <div
                      className="content-collapse"
                      style={{ borderTop: "none" }}
                    >
                      <div className="row">
                        {/* <div className="col-md-8">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company Name{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                                value={companeyIdData}
                              disabled
                            />
                          </div>
                        </div> */}
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Type (HO) <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="typeHQ"
                              value={branchDataList.typeHQ}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={branchDataList.name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={branchDataList.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">State</label>
                            <input
                              type="text"
                              className="form-control"
                              name="state"
                              value={branchDataList.state}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              value={branchDataList.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Pincode</label>
                            <input
                              type="number"
                              className="form-control"
                              name="pinCode"
                              value={branchDataList.pinCode}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Contact Person
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="contactPerson"
                              value={branchDataList.contactPerson}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Contact Email{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="contactEmail"
                              value={branchDataList.contactEmail}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Contact Number{" "}
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="contactNumber"
                              value={branchDataList.contactNumber}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Designation{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="designation"
                              value={branchDataList.designation}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Website</label>
                            <input
                              type="text"
                              className="form-control"
                              name="website"
                              value={branchDataList.website}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Bank Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="bankAccountName"
                              value={branchDataList.bankAccountName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Bank Acc No.{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="bankAccountNumber"
                              value={branchDataList.bankAccountNumber}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Bank IFSC <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="bankAccountIFSC"
                              value={branchDataList.bankAccountIFSC}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Bank Address{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="bankAddress"
                              value={branchDataList.bankAddress}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="submit-button text-end">
              <Link
                to="#"
                className="btn btn-light sidebar-close"
                onClick={() => setEditBranchToggle(!editBranchToggle)}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitLoading}
              >
                {isSubmitLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updateing...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditBranch;
