import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const SalarySlip = () => {
  //  const { empid } = useParams();
  const [salarySlip, setSalarySlip] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const styles = {
    container: {
      fontFamily: "'Arial', sans-serif",
      maxWidth: "700px",
      margin: "0 auto",
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
      fontSize: "20px",
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
      marginBottom: "-2px",
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
      padding: "5px",
      backgroundColor: "#f2f2f2",
      textAlign: "left",
      fontWeight: "bold",
      color: "#333",
    },
    ths: {
      border: "1px solid #ddd",
      paddingTop: "2px",
      paddingBottom: "2px",
      paddingLeft: "30px",

      backgroundColor: "#f2f2f2",

      fontWeight: "bold",
      color: "#333",
      boxSizing: "content-box",
    },

    td: {
      border: "1px solid #ddd",
      padding: "2px 10px",
      textAlign: "left",
    },
    tdRightAlign: {
      border: "1px solid #ddd",
      padding: "2px 10px",
      textAlign: "right",
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

  useEffect(() => {
    async function getEmp() {
      const url = `${apiUrl}/salery/getSingleEntry?id=5`;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      response = await response.json();

      if (response.status === "success") {
        setSalarySlip(response.data);
      }
    }

    getEmp();
  }, []);

  const getCurrentMonthYear = () => {
    const now = new Date();
    const options = { month: "long", year: "numeric" };
    return now.toLocaleDateString("en-US", options).toUpperCase();
  };

  const currentMonthYear = getCurrentMonthYear();

  return (
    <Fragment>
      <div>
      </div>
      <div style={styles.container}>
        <h2 style={styles.heading}>PAY SLIP FOR {currentMonthYear}</h2>
        <div style={styles.flexContainer}>
          <div style={styles.leftSection}>
            <p style={styles.sectionContent}>Aman</p>
            <p style={styles.sectionContent}>Sales Manager</p>
            <p style={styles.sectionContent}>Caasaa AI Innovations Pvt Ltd</p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>Employee Code:</span> N/A
            </p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>PAN No.:</span>{" "}
              {salarySlip &&
                salarySlip.employee &&
                `${salarySlip.employee.panNumber || "N/A"}`}
            </p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>Account No:</span>{" "}
              {salarySlip &&
                salarySlip.employee &&
                `${salarySlip.employee.accountNumber || "N/A"}`}
            </p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>PF Acc No:</span> N/A
            </p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>Salary of Month:</span> N/A
            </p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>Payable days:</span>{" "}
              {salarySlip.numberOfDaysInMonth}
            </p>
            <p style={styles.sectionContent}>
              <span style={styles.sectionTitle}>Leave taken:</span>{" "}
              {salarySlip.totalLeave}
            </p>
          </div>
          <div style={styles.rightSection}>
            <img
              src="/assets/img/caasaa-logo-website.png"
              alt=""
              style={{ width: "170px", height: "100px", objectFit: "contain" }}
            />
            <p>Caasaa AI Innovations Pvt Ltd</p>
            <p>
              {" "}
              Noida
            </p>
          </div>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Component #</th>
                <th style={styles.ths}>Amount (A)</th>
                {/* Empty header cell for spacing */}
                <th
                  style={{
                    ...styles.th,
                    width: "40px",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></th>
                <th style={styles.th}>Deductions</th>
                <th style={styles.ths}>Amount (B)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Basic</td>
                <td style={styles.tdRightAlign}>{salarySlip.monthlySalery}</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>PF</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>HRA</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>VPF</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Bonus</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>P.Tax</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Medical Reim.</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>ESI</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Special Allowance</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>Salary Adv</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Conveyance</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>TDS</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>OR</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>Car Loan</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Skilled Based pay</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>C/Bank Loan</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Quality Incentives</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>Mobile Ded</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>EVIS</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>Hostel Recovery</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Hold Release</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>Other Ded</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Relocation Allowance</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>Gratuity</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Comp-Off Encashments</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>0</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Comp-Off Encash Arrears</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>0</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Performance Pay</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>0</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Spl Incentives</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>0</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>
              <tr>
                <td style={styles.td}>Spiff Payout</td>
                <td style={styles.tdRightAlign}>0</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>0</td>
                <td style={styles.tdRightAlign}>0</td>
              </tr>

              <tr>
                <td style={styles.td}>Total</td>
                <td style={styles.tdRightAlign}>{salarySlip.monthlySalery}</td>
                <td
                  style={{
                    ...styles.td,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                ></td>
                <td style={styles.td}>0</td>
                <td style={styles.tdRightAlign}>
                  {salarySlip.deductionInSalery}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={styles.footer}>
          <p>
            This is a system generated salary slip, No need of any signature and
            seal. For any query or concerns please contact HR department.{" "}
          </p>
          <p style={styles.totalAmount}>
            Net Salary: ₹ {salarySlip.totalAmount}{" "}
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default SalarySlip;
