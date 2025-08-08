import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from "xlsx";
import axios from "axios";

const SearchSection = ({
    manageColumns,
    data,
    filterByObj
}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffType = localStorage.getItem('type');

    const handlePaymentExport = async () => {
        try {
            let { from, to, customerId, search, staffId, leadForId, serviceId } = filterByObj;

            let url = `${apiUrl}/customer/export-payment-report?search=${search}&from=${from}&to=${to}&customerId=${customerId}&staffId=${staffId}&serviceId=${serviceId}&leadForId=${leadForId}`
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            const fileUrl = response.data.data.fileURL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
            } else {
                console.error("File URL is missing");
            }
        } catch (error) {
            console.log(error)
        }
    }

    console.log("data =>", data);

    const exportExcel = () => {
        const tableData = data?.map((item) => ({
            "Customer": manageColumns["Customer"] ? item.Customer.customerName || "N/A" : null,
            "Service": manageColumns["Service"] ? item.Service.name || "N/A" : null,
            "Total Amount": manageColumns["Total Amount"] ? item.totalAmount || "N/A" : null,
            "Paid Amount": manageColumns["Paid Amount"] ? item.amountPaid || "N/A" : null,
            "Due Amount": manageColumns["Due Amount"] ? item.amountDue || "N/A" : null,
            // "Invoice Count": manageColumns["Invoice Count"] ? item.invoiceCount || "N/A" : null,
            "Invoice Requested": manageColumns["Invoice Requested"] ? item.invoiceRequested || "N/A" : null,
            "Invoice Paid": manageColumns["Invoice Paid"] ? item.invoicePaid || "N/A" : null,
            "Created Date": manageColumns["Created Date"] ? item.createdAt || "N/A" : null,
            "Assigned Staff": manageColumns["Assigned Staff"] ? item.assignedTo || "N/A" : null,
        }));

        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Account Report");
        XLSX.writeFile(wb, "account-report.xlsx");
    };

    return (
        <div className="search-section">
            <div className="row">
                <div className="col-md-7 col-sm-8" style={{ width: '80%' }}>
                    <div className="export-list text-sm-end">
                        <ul>
                            {/* {staffData?.staffType == 1 && */}
                            <li>
                                <div className="export-dropdwon " style={{ height: '2.3rem' }}>
                                    <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                    >
                                        <i className="ti ti-package-export" />
                                    </Link>
                                    <div className="dropdown-menu  dropdown-menu-end" style={{ width: '13rem' }}>
                                        <ul>
                                            {/* <li>
                                                <Link
                                                    // to="#"
                                                    onClick={exportExcel}
                                                >
                                                    <i className="ti ti-file-type-xls text-green" />
                                                    Export Current Data{" "}
                                                </Link>
                                            </li> */}
                                            <li>
                                                <Link to="#"
                                                    onClick={handlePaymentExport}
                                                >
                                                    <i className="ti ti-file-type-xls text-green" />
                                                    Export Data{" "}
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            {/* } */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSection