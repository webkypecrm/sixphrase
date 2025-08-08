import React, { Fragment, useEffect, useState } from "react";
import { toWords } from "number-to-words";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const GenerateOffer = () => {
  const [earnings, setEarnings] = useState({});
  const [deductions, setDeductions] = useState({});
  const [staffData, setStaffData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const handleDeductionChange = (key, value) => {
    setDeductions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEarningChange = (key, value) => {
    setEarnings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (staffData?.grade) {
      setEarnings({
        Basic: staffData.grade.basic || "",
        HRA: staffData.grade.hra || "",
        Bonus: staffData.grade.Bonas || "",
        // ... add all others similarly
      });

      setDeductions({
        PF: staffData.grade.pf || "",
        VPF: staffData.grade.vpf || "",
        // ... add all others similarly
      });
    }
  }, [staffData]);

  const styles = {
    container: {
      fontFamily: "'Arial', sans-serif",
      maxWidth: "100%",
      // margin: "50px 300px",
      padding: "20px",
      border: "1px solid #ddd",
      backgroundColor: "#f9f9f9",
      lineHeight: "1.6",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "24px",
      margin: "20px 0",
      color: "#333",
    },
    flexContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    leftSection: {
      width: "48%",
      marginBottom: "0",
    },
    rightSection: {
      width: "48%",
      textAlign: "center",
      marginTop: "40px",
    },
    photo: {
      width: "120px",
      height: "80px",
      marginBottom: "10px",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      fontWeight: "bold",
      marginBottom: "2px",
      display: "inline-block",
    },
    sectionContent: {
      marginBottom: "5px",
    },
    tableContainer: {
      overflowX: "auto",
      marginTop: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      border: "1px solid #ddd",
      padding: "4px",
      backgroundColor: "#f2f2f2",
      textAlign: "left",
      fontWeight: "bold",
      color: "#333",
    },
    td: {
      border: "1px solid #ddd",
      padding: "2px",
      textAlign: "left",
      whiteSpace: "nowrap",
      width: "5rem",
    },
    input: {
      width: "5rem",
      padding: "4px",
      boxSizing: "border-box",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    footer: {
      marginTop: "30px",
      fontSize: "14px",
      color: "#555",
      borderTop: "1px solid #ddd",
      paddingTop: "20px",
    },
    totalAmount: {
      fontWeight: "bold",
      fontSize: "16px",
    },
  };

  // get staff data
  const getStaffData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/staff-details/${id}`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      setStaffData(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getStaffData();
  }, []);

  console.log("alldata", staffData);

  const totalEarnings = Object.values(earnings).reduce(
    (a, b) => a + (parseFloat(b) || 0),
    0
  );

  const totalDeductions = Object.values(deductions).reduce(
    (a, b) => a + (parseFloat(b) || 0),
    0
  );

  const netSalary = totalEarnings - totalDeductions;

  // update salary
  const handleUpdateSalary = async () => {
    // event.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/master/edit-grade`,
        {
          id: staffData?.gradeId,
          Bonas: earnings.Bonus || "",
          hra: earnings.HRA || "",
          basic: earnings.Basic || "",
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      console.log("response from view", response);

      getStaffData();
      toast.success("Salary updated successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  // share
  const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: "Check this page out!",
        url: `${apiUrl}/hrms/generate-offer-latter/${id}`,
      });
      toast.success("Shared successfully!");
    } catch (error) {
      toast.error("Share canceled or failed");
    }
  } else {
    // Fallback for unsupported browsers
    try {
      await navigator.clipboard.writeText(`${apiUrl}/hrms/generate-offer-latter/${id}`);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Could not copy the link.");
    }
  }
};

  return (
    <Fragment>
      <div className="offer-letter-main-container d-flex flex-column">
        <div className="containerr" style={{ padding: "20px 40px" }}>
          {/* Company Header */}
          <div className="text-center mb-8">
            <img
              src="/assets/img/caasaa-logo-website.png"
              alt=""
              style={{ width: "170px", height: "100px", objectFit: "contain" }}
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {staffData?.userCompany?.companyName}
            </h1>
            <p className="text-gray-600 mb-1">
              Email: hr@caasaa.com | Phone: 8130352808
            </p>
            <p className="text-gray-600 mb-1">
              Add: {staffData?.userCompany?.address}
            </p>
            <p className="text-gray-600">
              Website:{" "}
              <a
                href="http://www.caasaa.com"
                className="text-blue-600 hover:underline"
              >
                {staffData?.userCompany?.website}
              </a>
            </p>
          </div>
          <hr className="my-8 border-gray-300" />
          <h2 className="text-2xl font-bold text-center mb-6">OFFER LETTER</h2>
          <p className="text-right text-gray-700 mb-3">
            Date: {dayjs(staffData?.createdAt).format("DD-MM-YYYY")}
          </p>
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-1">
              To, {staffData?.name}
            </p>
            <p className="text-gray-700 mb-1">Email: {staffData?.email}</p>
            <p className="text-gray-700 mb-1">Address: {staffData?.address}</p>
            <p className="text-gray-700 mb-4">Phone No: {staffData?.mobile}</p>
          </div>
          <p className="font-semibold text-gray-800 mb-4">
            Subject: Offer of Employment as{" "}
            <strong>{staffData?.role?.name}</strong> at{" "}
            <strong>{staffData?.userCompany?.companyName}</strong>
          </p>
          <p className="mb-1">
            Dear <strong>{staffData?.name}</strong>,
          </p>
          <p className="mb-6">
            Following our discussions, we are delighted to formally offer you
            the position of{" "}
            <span className="font-semibold">
              <strong>{staffData?.role?.name}</strong>
            </span>{" "}
            at <strong>{staffData?.userCompany?.companyName}</strong>. We are
            confident that your expertise and commitment will be instrumental in
            our continued growth and success, and we eagerly anticipate your
            valuable contributions to our team.
          </p>
          {/* 1. Joining Details */}
          <h3 className="section-title">1. Joining Details:</h3>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>Date of Joining:</strong>{" "}
              {dayjs(staffData?.createdAt).format("DD-MM-YYYY")}
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>Company:</strong> {staffData?.userCompany?.companyName}.
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>Reporting Manager:</strong>{" "}
              {staffData?.companyBranch?.contactPerson}
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>Working Hours:</strong> {staffData?.workShift?.name}{" "}
              (Monday to Friday)
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>Work Location:</strong>{" "}
              {staffData?.companyBranch?.address}
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>Saturday Rule:</strong> 1st Saturday Off of every month,
              (Rest All Saturday Work from Home)
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              <strong>On probation:</strong> Follow the rules and policies of
              the probation period.
            </li>
          </ul>
          {/* 2. Salary Structure & Terms */}
          <h3 className="section-title">2. Salary Structure &amp; Terms:</h3>
          <p className="mb-4">
            Your compensation package has been carefully structured to reflect
            your skills, experience, and the responsibilities associated with
            this role. The exact breakdown will be confidentially detailed in
            your official salary slip upon joining.
          </p>
          <div className="overflow-x-auto rounded-lg shadow-md mb-6">
            <div style={styles.container}>
              {/* <h2 style={styles.heading}>PAY SLIP FOR OCTOBER 2024</h2> */}
              <div style={styles.flexContainer}></div>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Component </th>
                      <th style={styles.th}>Amount (A)</th>
                      {/* <th style={styles.th}></th> */}
                      <th style={styles.th}>Deductions </th>
                      <th style={styles.th}>Amount (B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.td}>Basic</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Basic"] || ""}
                          onChange={(e) =>
                            handleEarningChange("Basic", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>PF</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["PF"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("PF", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>HRA</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["HRA"] || ""}
                          onChange={(e) =>
                            handleEarningChange("HRA", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>VPF</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["VPF"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("VPF", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Bonus</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Bonus"] || ""}
                          onChange={(e) =>
                            handleEarningChange("Bonus", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>P.Tax</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["P.Tax"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("P.Tax", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Medical Reim.</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Medical Reim."] || ""}
                          onChange={(e) =>
                            handleEarningChange("Medical Reim.", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>ESI</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["ESI"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("ESI", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Special Allowance</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Special Allowance"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Special Allowance",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}>Salary Adv</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["Salary Adv"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("Salary Adv", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Conveyance</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Conveyance"] || ""}
                          onChange={(e) =>
                            handleEarningChange("Conveyance", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>TDS</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["TDS"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("TDS", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>OR</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["OR"] || ""}
                          onChange={(e) =>
                            handleEarningChange("OR", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>Car Loan</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["Car Loan"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("Car Loan", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Skilled Based pay</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Skilled Based pay"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Skilled Based pay",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}>C/Bank Loan</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["C/Bank Loan"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("C/Bank Loan", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Quality Incentives</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Quality Incentives"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Quality Incentives",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}>Mobile Ded</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["Mobile Ded"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("Mobile Ded", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>EVIS</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["EVIS"] || ""}
                          onChange={(e) =>
                            handleEarningChange("EVIS", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>Hostel Recovery</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["Hostel Recovery"] || ""}
                          onChange={(e) =>
                            handleDeductionChange(
                              "Hostel Recovery",
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Hold Release</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Hold Release"] || ""}
                          onChange={(e) =>
                            handleEarningChange("Hold Release", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>Other Ded</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["Other Ded"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("Other Ded", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Relocation Allowance</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Relocation Allowance"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Relocation Allowance",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}>Gratuity</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={deductions["Gratuity"] || ""}
                          onChange={(e) =>
                            handleDeductionChange("Gratuity", e.target.value)
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Comp-Off Encashments</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Comp-Off Encashments"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Comp-Off Encashments",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Comp-Off Encash Arrears</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Comp-Off Encash Arrears"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Comp-Off Encash Arrears",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Performance Pay</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Performance Pay"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Performance Pay",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Spl Incentives</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Spl Incentives"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Spl Incentives",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Spiff Incentives</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Spiff Incentives"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Spiff Incentives",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Leave Encashments</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Leave Encashments"] || ""}
                          onChange={(e) =>
                            handleEarningChange(
                              "Leave Encashments",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>

                    <tr>
                      <td style={styles.td}>Arrears</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          style={styles.input}
                          value={earnings["Arrears"] || ""}
                          onChange={(e) =>
                            handleEarningChange("Arrears", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}></td>
                      <td style={styles.td}></td>
                    </tr>
                    <tr>
                      <td style={styles.td}>
                        <strong>Total</strong>
                      </td>
                      <td style={styles.td}>
                        <strong>₹ {totalEarnings.toFixed(2)}</strong>
                      </td>
                      {/* <td style={styles.td}></td> */}
                      <td style={styles.td}>
                        <strong>Total</strong>
                      </td>
                      <td style={styles.td}>
                        <strong>₹ {totalDeductions.toFixed(2)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.td} colSpan="3">
                        <strong>Net Salary</strong>
                      </td>
                      <td style={styles.td}>
                        <strong>₹ {netSalary.toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={styles.footer}>
                <p>
                  This is a system generated salary slip. For any query or
                  concerns please contact HR.
                </p>
                <p style={styles.totalAmount}>
                  In Figures:{" "}
                  {(toWords(Math.floor(netSalary)) + " rupees only")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
              </div>
            </div>
          </div>
          <p className="mb-4 mt-2 font-semibold text-gray-800">
            Final Take Home Salary:{" "}
            {(toWords(Math.floor(netSalary)) + " rupees only")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
          <ul className="list-disc list-inside">
            <li className="mb-2">
              The total Cost to Company (CTC) offered is{" "}
              <span className="font-semibold">
                {"{"}
                {"{"}ctc_per_month{"}"}
                {"}"} per month
              </span>
              , comprising Basic Salary, Allowances, and Employer’s PF
              contribution as detailed in Annexure A.
            </li>
            <li className="mb-2">
              The salary will be paid every month, typically on or before the
              7th working day of each month, directly to the employee’s
              designated bank account.
            </li>
            <li className="mb-2">
              Any applicable statutory deductions (e.g., Provident Fund,
              Professional Tax, Income Tax, etc.) will be made as per prevailing
              laws.
            </li>
            <li className="mb-2">
              Salary revisions, increments, or bonuses are{" "}
              <span className="font-semibold">not automatic</span> and will be
              at the sole discretion of the management, based on the employee’s
              performance, company policy, and market conditions.
            </li>
            <li className="mb-2">
              The company reserves the right to deduct from salary any amount
              that the employee owes to the company, including but not limited
              to advances, recoverable expenses, or penalties as per policy.
            </li>
            <li className="mb-2">
              Any leave taken more than entitlement will be adjusted against the
              salary.
            </li>
            <li className="mb-2">
              In the event of joining or resignation in the middle of a month,
              the salary for that month will be calculated on a pro-rata basis
              for the days worked.
            </li>
            <li className="mb-2">
              Upon termination or resignation, the company will settle all dues
              (including accrued leave encashment, if applicable) within{" "}
              <span className="font-semibold">30 days</span> of the employee’s
              clearance from all relevant departments.
            </li>
            <li className="mb-2">
              The company reserves the right to recover any outstanding dues
              before releasing the final settlement.
            </li>
            <li className="mb-2">
              Any performance-based incentives or bonuses, if applicable, will
              be{" "}
              <span className="font-semibold">
                separate from the fixed salary
              </span>{" "}
              and subject to performance evaluation and company policy.
            </li>
            <li className="mb-6">
              Payment of incentives shall not create a right to claim them as
              part of regular pay.
            </li>
          </ul>
          {/* 3. Leave Structure & Terms */}
          <h3 className="section-title">3. Leave Structure &amp; Terms:</h3>
          <p className="mb-4">
            Caasaa AI Innovations Pvt Ltd believes in fostering a healthy
            work-life balance. Our leave policy is designed to support your
            well-being and is detailed as follows:
          </p>
          <div className="overflow-x-auto rounded-lg shadow-md mb-6">
            <table>
              <thead>
                <tr>
                  <th>LEAVE TYPE</th>
                  <th>NUMBER OF DAYS PER YEAR</th>
                  <th>ELIGIBILITY CRITERIA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="LEAVE TYPE">Casual Leave (CL)</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">12 Days</td>
                  <td data-label="ELIGIBILITY CRITERIA">Post Probation</td>
                </tr>
                <tr>
                  <td data-label="LEAVE TYPE">Sick Leave (SL)</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">6 Days</td>
                  <td data-label="ELIGIBILITY CRITERIA">Immediate</td>
                </tr>
                <tr>
                  <td data-label="LEAVE TYPE">Earned Leave (EL)</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">15 Days</td>
                  <td data-label="ELIGIBILITY CRITERIA">After 1 Year</td>
                </tr>
                <tr>
                  <td data-label="LEAVE TYPE">Maternity Leave</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">26 Weeks</td>
                  <td data-label="ELIGIBILITY CRITERIA">As per Govt. Rules</td>
                </tr>
                <tr>
                  <td data-label="LEAVE TYPE">Paternity Leave</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">5 Days</td>
                  <td data-label="ELIGIBILITY CRITERIA">
                    As per Company Policy
                  </td>
                </tr>
                <tr>
                  <td data-label="LEAVE TYPE">Bereavement Leave</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">3 Days</td>
                  <td data-label="ELIGIBILITY CRITERIA">
                    Immediate Family Only
                  </td>
                </tr>
                <tr>
                  <td data-label="LEAVE TYPE">Compensatory Off</td>
                  <td data-label="NUMBER OF DAYS PER YEAR">
                    As per Work Policy
                  </td>
                  <td data-label="ELIGIBILITY CRITERIA">With Prior Approval</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4">
            During the probation period, employees are eligible for Sick Leave
            (SL) only.
          </p>
          <p className="mb-6">
            Casual Leave (CL) will be credited only after confirmation of
            employment.
          </p>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Leave Approval Process:
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              All leave requests must be submitted at least 3 days in advance
              (except for emergencies such as sick leave).
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              Leaves must be approved by the Reporting Manager and HR.
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              Failure to obtain prior approval may result in the leave being
              marked as unpaid.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Carry Forward &amp; Encashment:
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              Casual Leave (CL) and Sick Leave (SL) cannot be carried forward to
              the next calendar year.
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              Earned Leave (EL) can be carried forward up to a maximum of 30
              days and may be encashed as per company policy during final
              settlement.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Unpaid Leave (Loss of Pay):
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              If the leave entitlement is exhausted, any additional leave taken
              will be considered Leave Without Pay (LWP) and will result in a
              proportionate salary deduction.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Holiday &amp; Weekly Offs:
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              Weekly offs and public holidays (as per the company holiday
              calendar) will not be deducted from leave balances.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Emergency Leave:
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              In case of sudden illness or emergency, the employee must inform
              the Reporting Manager within 24 hours and provide supporting
              documentation (medical certificate, etc.) where applicable.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Leave During Notice Period:
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              Leaves during the notice period are generally not allowed unless
              approved by the Reporting Manager.
            </li>
            <li style={{ marginBottom: "0.2rem" }}>
              Any unapproved leave during notice period will be treated as
              unpaid leave and may extend the notice duration.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Leave Encashment on Exit:
          </h4>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.2rem" }}>
              At the time of resignation/termination, unused Earned Leave (EL),
              if any, will be encashed as per company policy. Casual and Sick
              Leave will not be encashed.
            </li>
          </ul>
          {/* 4. Probation Period */}
          <h3 className="section-title">4. Probation Period:</h3>
          <p className="mb-4">
            Your employment will commence with a probation period of{" "}
            <span className="font-semibold">
              {"{"}
              {"{"}probation_period{"}"}
              {"}"}
            </span>{" "}
            from your date of joining. This period serves as a mutual assessment
            opportunity for both you and Caasaa AI Innovations Pvt Ltd to
            evaluate your suitability for the role and integration into our
            organizational culture. Your performance will be rigorously
            evaluated based on the following key criteria:
          </p>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Work Understanding:</strong> Demonstrating a comprehensive
              grasp of project requirements, assigned tasks, and adherence to
              company workflows and methodologies.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Punctuality &amp; Attendance:</strong> Consistent
              adherence to designated working hours, timely logins, and
              maintaining exemplary attendance records.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Work Quality:</strong> Producing work that consistently
              meets high standards of accuracy, efficiency, attention to detail,
              and overall professional excellence.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Speed &amp; Performance:</strong> Ability to complete
              tasks effectively within established deadlines while maintaining
              the highest quality standards.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Team Collaboration &amp; Effort:</strong> Actively
              engaging in collaborative efforts, contributing positively to
              group projects, and fostering a supportive and productive work
              environment.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Client Management:</strong> Exhibiting professional and
              effective communication and management skills when interacting
              with clients and addressing their requirements.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Communication Skills:</strong> Maintaining clarity,
              responsiveness, and effectiveness in all internal and external
              communications, both written and verbal.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Technical Skills &amp; Problem-Solving:</strong> Applying
              advanced technical knowledge, demonstrating strong problem-solving
              abilities, and showing adaptability to new tools, technologies,
              and challenges.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Adherence to Company Policies:</strong> Strict compliance
              with all company rules, security protocols, ethical guidelines,
              and established procedures.
            </li>
          </ul>
          <p className="mb-6">
            A formal performance review will be conducted after the probation
            period. Based on this comprehensive assessment, your employment will
            either be confirmed, extended for a further evaluation period, or,
            if performance expectations are not met, your employment may be
            terminated. Throughout this period, you will receive constructive
            feedback and support to facilitate your development and integration.
          </p>
          {/* 5. Employment Terms & Conditions */}
          <h3 className="section-title">
            5. Employment Terms &amp; Conditions:
          </h3>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            5.1 Confidentiality Clause:
          </h4>
          <ul className="list-disc list-inside">
            <li className="mb-2">
              During the course of your employment and indefinitely thereafter,
              you shall maintain the strictest confidentiality regarding all
              proprietary, business, and client-related information of Caasaa AI
              Innovations Pvt Ltd. This encompasses, but is not limited to,
              source code, algorithms, project details, business strategies,
              financial data, trade secrets, client data, internal
              communications, intellectual property, and any other sensitive or
              non-public information belonging to the company or its affiliates.
            </li>
            <li className="mb-2">
              You are expressly prohibited from disclosing, sharing, or
              utilizing any confidential information for personal gain, for the
              benefit of any third party, or in any manner that could
              potentially harm the interests, reputation, or competitive
              standing of Caasaa AI Innovations Pvt Ltd.
            </li>
            <li className="mb-2">
              All employees are mandated to use company-provided systems,
              software, and email accounts exclusively for legitimate
              business-related activities. Any unauthorized use of company
              resources for external, personal, or non-business purposes is
              strictly prohibited and may lead to disciplinary action.
            </li>
            <li className="mb-2">
              Should you receive any request for confidential information from
              an unauthorized individual or external entity, you are required to
              immediately notify your designated reporting manager and the Human
              Resources department.
            </li>
            <li className="mb-2">
              Upon the cessation of your employment, whether by termination or
              resignation, you are obligated to promptly return all company
              assets, including but not limited to laptops, mobile devices,
              storage devices, physical documents, access credentials, and any
              other materials or intellectual property related to company
              projects. You are strictly prohibited from retaining any copies,
              electronic or otherwise, of company information.
            </li>
            <li className="mb-6">
              Any violation of this confidentiality agreement will be met with
              strict legal action, which may include, but is not limited to,
              immediate termination of employment, imposition of monetary
              penalties, and civil or criminal prosecution to the fullest extent
              permitted by applicable laws and regulations.
            </li>
            <li className="mb-4">
              By accepting this offer, you explicitly acknowledge your
              understanding of and agreement to the terms of this comprehensive
              confidentiality clause, and you commit to abiding by its
              provisions during and after your tenure with Caasaa AI Innovations
              Pvt Ltd.
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            5.2 Non-Compete Clause:
          </h4>
          <ul className="list-disc list-inside">
            <li className="mb-2">
              To protect the legitimate business interests and client
              relationships of Caasaa AI Innovations Pvt Ltd, you are strictly
              prohibited from directly or indirectly joining, engaging with, or
              providing services to any existing or past clients of Caasaa AI
              Innovations Pvt Ltd with whom you had direct interaction or access
              to confidential information during your employment, for a period
              of{" "}
              <span className="font-semibold">
                {"{"}
                {"{"}non_compete_period{"}"}
                {"}"}
              </span>{" "}
              following the effective date of your resignation or termination.
            </li>
            <li className="mb-2">
              Engagement in any such prohibited activities will be considered a
              material violation of company policies and may result in severe
              legal implications, including but not limited to the pursuit of
              injunctive relief, monetary penalties, and civil lawsuits for
              damages incurred by the company.
            </li>
            <li className="mb-4">
              Caasaa AI Innovations Pvt Ltd reserves the unequivocal right to
              take appropriate disciplinary action, including legal proceedings,
              against any employee found to be in breach of this clause.
            </li>
          </ul>

          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            5.3 Termination Clause:
          </h4>
          <ul className="list-disc list-inside">
            <li className="mb-2">
              During the stipulated probation period, either party (Caasaa AI
              Innovations Pvt Ltd or the Employee) reserves the right to
              terminate the employment relationship by providing a{" "}
              <span className="font-semibold">
                {"{"}
                {"{"}probation_notice_period{"}"}
                {"}"} written notice
              </span>
              .
            </li>
            <li className="mb-2">
              Subsequent to the successful confirmation of employment, either
              party may terminate the employment by providing a{" "}
              <span className="font-semibold">
                {"{"}
                {"{"}post_probation_notice_period{"}"}
                {"}"} written notice period
              </span>
              , or, at the sole discretion of the company, by making a payment
              in lieu of such notice.
            </li>
            <li className="mb-2">
              Notwithstanding the above, employment may be subject to immediate
              dismissal without notice in cases of gross misconduct, material
              breach of contract, violation of company policies, fraudulent
              activities, misuse of company resources, or infringement of
              intellectual property or confidentiality agreements.
            </li>
            <li className="mb-2">
              The company explicitly reserves the right to terminate employment
              if the employee consistently fails to meet performance
              expectations, engages in activities detrimental to the company's
              interests, or violates any terms outlined in this offer letter or
              the company's employee handbook.
            </li>
            <li className="mb-2">
              Upon termination of employment, the employee is required to
              promptly return all company assets, documents, and intellectual
              property. It is imperative to ensure that no copies of company
              information, in any format, are retained.
            </li>
            <li className="mb-4">
              The final settlement, encompassing pending salary, accrued leave
              encashment (if applicable), and any other legitimate dues, will be
              processed within 30 days following the comprehensive clearance
              from all relevant departments. Any deductions for damages,
              misconduct, or breaches of contract will be adjusted accordingly.
            </li>
          </ul>
          {/* 6. Acceptance of Offer */}
          <h3 className="section-title">6. Acceptance of Offer:</h3>
          <p className="mb-4">
            To formally accept this offer of employment and acknowledge your
            understanding and agreement to the terms and conditions outlined
            herein, please sign and return a copy of this letter by{" "}
            <span className="font-semibold">
              {"{"}
              {"{"}acceptance_deadline{"}"}
              {"}"}
            </span>
          </p>
          <p className="mb-6">
            We are genuinely excited about the prospect of you joining{" "}
            {staffData?.userCompany?.companyName} and contributing to our
            innovative endeavours.
          </p>
          <p className="mb-2">Sincerely,</p>
          <img
            src="/SignCEO.png"
            alt=""
            className="signature-img"
            style={{ width: "125px", height: "90px", objectFit: "contain" }}
          />
          <p className="font-semibold text-gray-800">
            {staffData?.companyBranch?.contactPerson}
          </p>
          <p className="text-gray-700">
            {staffData?.companyBranch?.designation}{" "}
            {staffData?.userCompany?.companyName}
          </p>
          <p className="text-gray-700">{staffData?.companyBranch?.address}</p>
          <div className="footer-info text-center">
            <p>
              © {dayjs(staffData?.createdAt).format("YYYY")}{" "}
              {staffData?.userCompany?.companyName}. All rights reserved.
            </p>
          </div>
        </div>
        <div className="submit-button text-end mt-3 no-print w-100 pe-5">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdateSalary}
            // onClick={() => setGradeToggle(false)}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleShare}
          >
            {/* {isLoading ? "Updating..." : "Update"} */}
            Share
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default GenerateOffer;
