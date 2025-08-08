import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Empty } from "antd";
import axios from "axios";
import ContentLoader from "../../Layouts/ContentLoader/Index";
import ErrorLoader from "../../Layouts/ErrorLoader/Index";
import DataTable from "../../Table/DataTable";
import moment from 'moment';
import { toast } from "react-toastify";
import { convertToAmPm, getDate } from '../../../selectOption/selectFunction';
import Payment from "../../Customer/Payment";


const PaymentHistoryTab = ({ leadData, fetchLeadDetails }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const [addLead, setAddLead] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [editCompany, setEditCompany] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [filterSlider, setFilterSlider] = useState(false);
  const [stageOptions, setStageOptions] = useState([]);
  const [manageColumns, setManageColumns] = useState({
    "Payment Date Time": true,
    "Payment Details": true,
    "Services": true,
    "Payment Amounts": true,
    "Counselor": true,
    "Appointment Date": true,
    "Message": true,
    "Assigned To": true,
    "Created Date": true,
    "Status": true,
    "Action": true,
  });
  const [totalPages, setTotalPages] = useState(0);
  // const [pageSize, setPageSize] = useState(2);
  const pageSize = 500
  const [counselorOptions, setCounselorOptions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [addPayment, setAddPayment] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // const employeeId = localStorage.getItem('staffId') || '';
  const staffType = localStorage.getItem('type') || '';


  // console.log("data in appointment List =>", data)
  // console.log("lead data =>", leadData)

  const initialFilter = {
    from: "",
    to: "",
    search: "",
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);

  const togglePopup = () => {
    setAddLead(prev => !prev);
  };

  function leadDetailsHandler(data) {
    setLeadDetails(data)
  }

  const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleFetchData = (page) => {
    fetchPaymentHistoryData(page);
  }

  const fetchPaymentHistoryData = async (page, customerId) => {
    try {
      if (!customerId) {
        console.log("Customer ID is missing, skipping fetch");
        return;
      }

      let url = `${apiUrl}/customer/get-payment-history?page=${page ? page : 1}&pageSize=${pageSize}&customerId=${customerId}`
      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });
      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.id,
      }));
      setData(formattedData);
      setTotalPages(response.data.totalCount)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  };

  const handleRefreshPage = () => {

    // setRefresh(true)

    const customerId = leadData?.Customer?.[0]?.customerId;

    if (!customerId) {
      console.warn("handleRefreshPage: No customerId found!");
      return;
    }

    console.log("handleRefreshPage Hit");
    console.log("customerId =>", customerId);

    fetchPaymentHistoryData(1, customerId);
  };

  useEffect(() => {
    if (leadData?.leadId) {
      fetchPaymentHistoryData(1, leadData?.Customer[0]?.customerId)
    }
  }, [leadData]);

  // useEffect(() => {
  //   if (refresh) {
  //   }

  // }, [refresh])

  // console.log("leadData =>", leadData)

  let columns = [
    // {
    //   title: () => {
    //     return <div
    //       data-bs-toggle="modal"
    //       data-bs-target="#multiple_assigned_to"
    //       style={{ cursor: 'pointer' }}
    //     >
    //       {selectedRowKeys.length > 0 ? "🔂" : ''}
    //     </div>
    //   },
    // },
    {
      title: "Payment Details",
      key: "name",
      render: (text, record, index) => (
        <div className="table-avatar d-flex align-items-center" >
          <ul>
            <li>
              Payment Date&Time:  {getDate(record?.paymentDate)} {convertToAmPm(record?.paymentTime)}
            </li>
            <li>
              Payment Method:  {record?.paymentMethod}
            </li>
            <li>
              Transaction Number: {record?.transactionNum ? record?.transactionNum : "Not Mentioned"}
            </li>
            <li>
              Created Date&Time - {moment(record.createdAt).format("DD MMM YYYY, hh:mm a")}
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Payment Amounts",
      key: "name",
      render: (text, record, index) => (
        <div className="table-avatar d-flex align-items-center" >
          <ul>
            <li>
              Service Amount: ₹{record?.totalAmount}
            </li>
            <li>
              Amount Paid:  ₹{record?.amountPaid}
            </li>
            <li>
              Amount Due: ₹{record?.amountDue}
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Services",
      key: "id",
      render: (text, record, index) => (
        <div className="table-avatar d-flex align-items-center" >
          <ul>
            {/* <li>
              Lead For -  {record?.LeadFor?.name}
            </li> */}
            <li>
              Service:{record?.Service?.name}
            </li>
            <li>
              Remark: {record?.remark.slice(0, 16)}
            </li>
            <li>
              {record?.remark.slice(16, 30)}
            </li>
            <li>
              {record?.remark.slice(30, 45)}
            </li>
          </ul>
        </div>
      ),
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (text, record, index) => (
    //     <div className="table-avatar d-flex align-items-center" >
    //       <ul>
    //         <li>
    //           {moment(text).format("DD MMM YYYY")}
    //         </li>
    //         <li>
    //           {moment(text).format("hh:mm a")}
    //         </li>
    //       </ul>
    //     </div>
    //     // render: (text) => {
    //     //   return moment(text).format("DD MMM YYYY, hh:mm a")
    //     // }
    //   )
    // },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            {record?.attachmentUrl ?
              <a
                className="dropdown-item"
                href={record?.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-download text-info" />
                Download
              </a>

              :
              <span>No Image</span>
            }



          </div>
        </div>
      ),
    },
  ];

  const modifiedColumns = columns.filter((column, index) => {
    if (index == 0) {
      return column
    }

    for (const ele in manageColumns) {
      if (column.title == ele && manageColumns[ele] == true) {
        return column
      }
    }
  })

  return (<>
    <div className="row">
      {/* <div className="col-md-12"> */}
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-header" style={{ width: '80%' }}>
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="page-title">
                Payment History
              </h4>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* <div className="tab-pane fade" id="lead-appointment"> */}
        <div className="view-header" style={{ borderBottom: 'none' }}>
          <ul>
            <li>
              <Link
                to="#"
                className="btn btn-primary add-popup"
                onClick={() => {
                  setAddPayment(true)
                }}
              >
                <i className="ti ti-circle-plus me-1" />
                Add New
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Manage Users List */}
      {isLoading &&
        <ContentLoader />
      }
      {error &&
        <ErrorLoader title={error.name} message={error.message} />
      }
      {data.length > 0 && !error &&
        <>
          <div className="table-responsive custom-table">
            <DataTable
              dataSource={data}
              columns={modifiedColumns}
              onSelectionChange={handleSelectedRowKeysChange}
              pageSize={pageSize}
              totalPages={totalPages}
              onFetchRecord={handleFetchData}
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
        </>
      }
      {
        data.length === 0 && !isLoading && !error && <Empty />
      }
      {/* /Manage Users List */}


      {/* </div> */}
    </div>

    {leadData?.Customer[0]?.customerId &&
      <Payment
        customerDetails={leadData?.Customer[0]}
        // handleRefresh={fetchLeadDetails}
        fetchLeadDetails={fetchLeadDetails}
        addPayment={addPayment}
        setAddPayment={setAddPayment}
        setCustomerDetails={() => { console.log("setCustomerDetails") }}
      />
    }


    {/* <AddInvoice
      activityToggle={activityToggle}
      setActivityToggle={setActivityToggle}
      handleRefresh={handleRefreshPage}
      customerDetails={leadData?.Customer[0]}
    /> */}



  </>
  )


}


export default PaymentHistoryTab