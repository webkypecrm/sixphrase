import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const UploadeKYC = ({ kycToggle, setKycToggle, staffId }) => {
  const [formData, setFormData] = useState({
    cheque: null,
    resume: null,
    aadharDocFront: null,
    aadharDocBack: null,
    aadharPdf: null,
    panDoc: null,
  });

  const [fileKeys, setFileKeys] = useState({
    cheque: Date.now(),
    resume: Date.now(),
    aadharFront: Date.now(),
    aadharDocBack: Date.now(),
    aadharPdf: Date.now(),
    panDoc: Date.now(),
  });

  const [documentType, setDocumentType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const Token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const documentOptions = [
    { value: "Aadhar Card", label: "Aadhar Card" },
    { value: "Pan Card", label: "Pan Card" },
  ];

  const handleDocumentTypeChange = (selectedOption) => {
    setDocumentType(selectedOption);
  };

  const handleFileChange = (fieldName) => (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("File size exceeds 1MB");
        return;
      }

      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PDF, DOC, or image files.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const removeFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFileKeys((prev) => ({
      ...prev,
      [fieldName]: Date.now(),
    }));
  };

  const uploadeKYC = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      if (formData.cheque instanceof File) {
        formDataToSend.append("cheque", formData.cheque);
      }

      if (formData.resume instanceof File) {
        formDataToSend.append("resume", formData.resume);
      }

      if (documentType?.value === "Aadhar Card") {
        if (formData.aadharPdf instanceof File) {
          formDataToSend.append("aadharDoc", formData.aadharPdf);
        } else {
          if (formData.aadharFront instanceof File) {
            formDataToSend.append("aadharDocFront", formData.aadharFront);
          }
          if (formData.aadharDocBack instanceof File) {
            formDataToSend.append("aadharDocBack", formData.aadharDocBack);
          }
        }
      }

      if (documentType?.value === "Pan Card" && formData.panDoc instanceof File) {
        formDataToSend.append("panDoc", formData.panDoc);
      }

      const res = await axios.post(
        `${apiUrl}/staff/staff-kyc/${staffId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("KYC documents uploaded successfully!");
      setKycToggle(false);

      setFormData({
        cheque: null,
        resume: null,
        aadharFront: null,
        aadharDocBack: null,
        aadharPdf: null,
        panDoc: null,
      });

      setFileKeys({
        cheque: Date.now(),
        resume: Date.now(),
        aadharFront: Date.now(),
        aadharDocBack: Date.now(),
        aadharPdf: Date.now(),
        panDoc: Date.now(),
      });

      setDocumentType(null);
    } catch (error) {
      console.error("Error uploading KYC:", error);
      toast.error(error.response?.data?.message || "Failed to upload KYC documents");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className={kycToggle ? "toggle-popup sidebar-popup" : "toggle-popup"}>
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Upload KYC Documents</h4>
            <Link to="#" className="sidebar-close toggle-btn" onClick={() => setKycToggle(false)}>
              <i className="ti ti-x" />
            </Link>
          </div>

          <div className="toggle-body">
            <form onSubmit={uploadeKYC}>
              <div className="pro-create">
                <div className="row">
                  {/* Cancelled Cheque */}
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Cancelled Cheque (Image or PDF) <span className="text-danger">*</span>
                      </label>
                      <div className="drag-attach">
                        <input
                          key={fileKeys.cheque}
                          type="file"
                          onChange={handleFileChange("cheque")}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <div className="img-upload">
                          <i className="ti ti-file-broken" />
                          {formData.cheque ? formData.cheque.name : "Upload File"}
                        </div>
                      </div>
                      {formData.cheque && (
                        <button className="btn btn-light" type="button" onClick={() => removeFile("cheque")}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resume */}
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Resume (Doc or PDF) <span className="text-danger">*</span>
                      </label>
                      <div className="drag-attach">
                        <input
                          key={fileKeys.resume}
                          type="file"
                          onChange={handleFileChange("resume")}
                          accept=".pdf,.doc,.docx"
                        />
                        <div className="img-upload">
                          <i className="ti ti-file-broken" />
                          {formData.resume ? formData.resume.name : "Upload File"}
                        </div>
                      </div>
                      {formData.resume && (
                        <button className="btn btn-light" type="button" onClick={() => removeFile("resume")}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Document Type */}
                  <div className="col-md-7">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Document Type <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        options={documentOptions}
                        placeholder="Select Document Type"
                        value={documentType}
                        onChange={handleDocumentTypeChange}
                      />
                    </div>
                  </div>

                  {/* Aadhar Card Section */}
                  {documentType?.value === "Aadhar Card" && (
                    <>
                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Aadhar Front Image <span className="text-danger">*</span>
                          </label>
                          <div className="drag-attach">
                            <input
                              key={fileKeys.aadharFront}
                              type="file"
                              onChange={handleFileChange("aadharFront")}
                              accept=".jpg,.jpeg,.png"
                            />
                            <div className="img-upload">
                              <i className="ti ti-file-broken" />
                              {formData.aadharFront ? formData.aadharFront.name : "Upload File"}
                            </div>
                          </div>
                          {formData.aadharFront && (
                            <button className="btn btn-light" type="button" onClick={() => removeFile("aadharFront")}>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Aadhar Back Image <span className="text-danger">*</span>
                          </label>
                          <div className="drag-attach">
                            <input
                              key={fileKeys.aadharDocBack}
                              type="file"
                              onChange={handleFileChange("aadharDocBack")}
                              accept=".jpg,.jpeg,.png"
                            />
                            <div className="img-upload">
                              <i className="ti ti-file-broken" />
                              {formData.aadharDocBack ? formData.aadharDocBack.name : "Upload File"}
                            </div>
                          </div>
                          {formData.aadharDocBack && (
                            <button className="btn btn-light" type="button" onClick={() => removeFile("aadharDocBack")}>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-center fw-bold my-2">Or Upload PDF</div>

                      <div className="col-md-8">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Aadhar PDF <span className="text-danger">*</span>
                          </label>
                          <div className="drag-attach">
                            <input
                              key={fileKeys.aadharPdf}
                              type="file"
                              onChange={handleFileChange("aadharPdf")}
                              accept=".pdf"
                            />
                            <div className="img-upload">
                              <i className="ti ti-file-broken" />
                              {formData.aadharPdf ? formData.aadharPdf.name : "Upload File"}
                            </div>
                          </div>
                          {formData.aadharPdf && (
                            <button className="btn btn-light" type="button" onClick={() => removeFile("aadharPdf")}>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PAN Card Section */}
                  {documentType?.value === "Pan Card" && (
                    <div className="col-md-8">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Upload PAN (Image or PDF) <span className="text-danger">*</span>
                        </label>
                        <div className="drag-attach">
                          <input
                            key={fileKeys.panDoc}
                            type="file"
                            onChange={handleFileChange("panDoc")}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <div className="img-upload">
                            <i className="ti ti-file-broken" />
                            {formData.panDoc ? formData.panDoc.name : "Upload File"}
                          </div>
                        </div>
                        {formData.panDoc && (
                          <button className="btn btn-light" type="button" onClick={() => removeFile("panDoc")}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="submit-button text-end mt-3">
                <Link to="#" className="btn btn-light sidebar-close me-2" onClick={() => setKycToggle(false)}>
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UploadeKYC;
