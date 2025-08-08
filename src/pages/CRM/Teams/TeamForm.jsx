import React from "react";
import Select from "react-select";
import { Link } from "react-router-dom";

const TeamForm = ({
  title,
  formData,
  companyOptions,
  branchOptions,
  managerOptions,
  staffOptions,
  imagePreview,
  onLogoChange,
  onFormChange,
  onSubmit,
  onCancel,
  isLoading,
  debouncedGetStaff,
}) => {
  return (
    <div className="sidebar-layout">
      <div className="sidebar-header">
        <h4>{title}</h4>
        <Link to="#" className="sidebar-close toggle-btn" onClick={onCancel}>
          <i className="ti ti-x" />
        </Link>
      </div>

      <div className="toggle-body">
        <form onSubmit={onSubmit}>
          <div className="row">

            {/* Team Name */}
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Team Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.teamName}
                  onChange={(e) =>
                    onFormChange({ ...formData, teamName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">Company</label>
                <Select
                  options={companyOptions}
                  value={companyOptions.find((c) => c.value === formData.teamCompanyId) || null}
                  onChange={(option) =>
                    onFormChange({
                      ...formData,
                      teamCompanyId: option?.value || null,
                      branchId: null,
                      teamManagerId: null,
                      teamMemberIds: [],
                    })
                  }
                  placeholder="Select company"
                />
              </div>
            </div>

            {/* Branch */}
            {branchOptions.length > 0 && (
              <div className="col-md-6">
                <div className="form-wrap">
                  <label className="col-form-label">Branch</label>
                  <Select
                    options={branchOptions}
                    value={branchOptions.find((b) => b.value === formData.branchId) || null}
                    onChange={(option) =>
                      onFormChange({
                        ...formData,
                        branchId: option?.value || null,
                        teamMemberIds: [],
                      })
                    }
                    placeholder="Select branch"
                  />
                </div>
              </div>
            )}

            {/* Manager */}
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">Team Manager</label>
                <Select
                  options={managerOptions}
                  value={managerOptions.find((m) => m.value === formData.teamManagerId) || null}
                  onChange={(option) =>
                    onFormChange({
                      ...formData,
                      teamManagerId: option?.value || null,
                    })
                  }
                  onInputChange={(inputValue, { action }) => {
                    if (action === "input-change") {
                      // You can optionally call getManagerData from parent
                    }
                  }}
                  isClearable
                  placeholder="Search manager"
                />
              </div>
            </div>

            {/* Members */}
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">Team Members</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  options={staffOptions}
                  value={staffOptions.filter((opt) =>
                    formData.teamMemberIds.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    onFormChange({
                      ...formData,
                      teamMemberIds: selected ? selected.map((s) => s.value) : [],
                    })
                  }
                  onInputChange={debouncedGetStaff}
                  placeholder="Search members"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">Team Logo</label>
                <div className="profile-upload">
                  <div className="profile-upload-img">
                    {!imagePreview ? (
                      <span><i className="ti ti-photo" /></span>
                    ) : (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: 115,
                            height: 115,
                            borderRadius: 6,
                          }}
                        />
                        <button
                          type="button"
                          className="profile-remove"
                          onClick={() => {
                            onFormChange({ ...formData, logo: "" });
                          }}
                        >
                          <i className="ti ti-x" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="profile-upload-content">
                    <label className="profile-upload-btn">
                      <i className="ti ti-file-broken" /> Upload Logo
                      <input
                        type="file"
                        className="input-img"
                        accept="image/*"
                        onChange={onLogoChange}
                      />
                    </label>
                    <p>JPG, GIF or PNG. Max size 800KB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="submit-button text-end mt-3">
              <Link to="#" className="btn btn-light sidebar-close" onClick={onCancel}>
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
