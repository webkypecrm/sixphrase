import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../Table/DataTable.jsx"
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";



const ManageStaffList = ({
  togglePopup,
  setStaffDetails,
  data,
  setData,
  handleRefreshData,
  manageColumns,
  pageSize,
  totalPages,
  staffData
}) => {
  const [stars, setStars] = useState({});
  const [staffId, setStaffId] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';


  const initializeStarsState = () => {
    const starsState = {};
    data.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };


  const handleFetchData = (page) => {
    handleRefreshData(page);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'staffId',
      render: (text, record) => (
        <Link to="#"
          className="table-avatar d-flex align-items-center">
          {record?.profilePic ?
            <Link to="#" className="avatar">
              <img src={record.profilePic} alt="UserImage" />
            </Link>
            :
            <Link to="#" className="avatar bg-pending">
              <i className="ti ti-user" />
            </Link>
          }

          <Link
            to="#"
            className="profile-split d-flex flex-column"
          >
            {record.name}
            <span>id : {record.staffId}</span>
          </Link>
        </Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Leads",
      dataIndex: "totalLeads",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Customers",
      dataIndex: "totalCustomers",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Appointments",
      dataIndex: "totalAppointment",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Paid",
      dataIndex: "totalPaid",
      key: "staffId",
      // sorter: true,
    },
    {
      title: "Total Due",
      dataIndex: "totalDue",
      key: "staffId",
      // sorter: true,
    },

  ];

  // const modifiedColumns = columns.filter((column, index) => {
  //   if (index == 0) {
  //     return column
  //   }

  //   for (const ele in manageColumns) {
  //     if (column.title == ele && manageColumns[ele] == true) {
  //       return column
  //     }
  //   }
  // })

  useEffect(() => {
    initializeStarsState();
  }, []);

  // console.log('data in StaffList =>', data)

  return <>
    {data.length !== 0 &&
      <>
        <div className="table-responsive custom-table">
          <DataTable
            dataSource={data}
            columns={columns}
            // onSelectionChange={handleSelectedRowKeysChange}
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

  </>
}


export default ManageStaffList