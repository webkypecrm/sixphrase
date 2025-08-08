import React, { useState, useEffect, useContext } from "react";
import PageHeader from "../../components/Layouts/PageHeader";
import { Link } from "react-router-dom";
import AddStaff from "../../components/HRMS/AddStaff";
import ManageStaffList from "../../components/Reports/Staff/ManageStaffList"
import EditStaff from "../../components/HRMS/EditStaff";
import SearchSection from "../../components/Reports/Staff/SearchSection";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import Filter from "../../components/HRMS/Filter";
import axios from "axios";
import { Empty } from "antd";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthProvider";


const StaffReportPage = () => {
  const { staffData } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const staffType = localStorage.getItem('type') || '';
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adduser, setAdduser] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null)
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const [workShiftOptions, setWorkShiftOptions] = useState([])
  const [jobTypeOptions, setJobTypeOptions] = useState([])
  const [filterSlider, setFilterSlider] = useState(false);
  const [manageColumns, setManageColumns] = useState({
    "Name": true,
    "Email": true,
    "Mobile": true,
    "Gender": false,
    "Created By": false,
    "Department": true,
    "Role": true,
    "Emergency Contact": false,
    "Address": false,
    "Group": true,
    "Job Type": true,
    "Work Shift": true,
    "Created Date": true,
    "Status": true,
    "Action": true,
  });
  const [totalPages, setTotalPages] = useState(0);
  // const [pageSize, setPageSize] = useState(2);
  const pageSize = 50

  const initialFilter = {
    from: "",
    to: "",
    source: [],
    industry: [],
    country: [],
    stage: [],
    company: [],
    leadOwner: [],
    search: "",
    staffId: null,
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);

  console.log('filterByObj =>', filterByObj)


  const togglePopup = () => {
    setAdduser(!adduser);
  };

  const fetchData = async (page) => {
    try {
      const { from, to, industry, source, country, stage, company, leadOwner, search, staffId } = filterByObj;
      console.log('search =>', search)
      const response = await axios.get(`${apiUrl}/staff/staff-report?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
          &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });

      const filterStaffData = response.data.data.filter((item) => !(parseInt(staffType) === 0 && item?.staffType === 1))

      const formattedData = filterStaffData.map((item) => ({
        ...item,
        key: item.staffId,
      }));
      setData(formattedData);
      setTotalPages(response.data.totalCount)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/department-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
        id: item.id
      }));
      setDepartmentOptions(formattedData);

    } catch (error) {
      toast.error(error.message)
    }
  };

  const fetchGroupData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/group-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setGroupOptions(formattedData);
    } catch (error) {
      toast.error(error.message)
    }
  };

  const fetchJobTypeData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/job-type-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setJobTypeOptions(formattedData);
    } catch (error) {
      toast.error(error.message)
    }
  };

  const fetchWorkShiftData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/work-shift-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setWorkShiftOptions(formattedData);
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleRefreshData = (page) => {
    fetchData(page)
  }

  function handleRefreshPage() {
    window.location.reload()
  }

  useEffect(() => {
    fetchData();
    fetchDepartmentData();
    fetchGroupData();
    fetchJobTypeData();
    fetchWorkShiftData();
  }, []);

  // console.log('data =>', data)

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader title="Staff Reports" count={totalPages} pageRefresh={handleRefreshPage} />
              {/* /Page Header */}
              {/* Campaign Status */}
              {/* <CampaignStatus /> */}
              {/* /Campaign Status */}
              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  {/* <SearchSection
                    togglePopup={togglePopup}
                    onManageColumns={setManageColumns}
                    manageColumns={manageColumns}
                    fetchData={handleRefreshData}
                    setFilterSlider={setFilterSlider}
                    filterByObj={filterByObj}
                    setFilterByObj={setFilterByObj}
                    data={data}
                    staffData={staffData}
                  /> */}
                  {/* /Search */}

                  {/* Manage Users List */}
                  {isLoading &&
                    <ContentLoader />
                  }
                  {error &&
                    <ErrorLoader title={error.name} message={error.message} />
                  }
                  {data.length > 0 && !error &&
                    <ManageStaffList
                      togglePopup={togglePopup}
                      setStaffDetails={setStaffDetails}
                      data={data}
                      setData={setData}
                      handleRefreshData={handleRefreshData}
                      manageColumns={manageColumns}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      staffData={staffData}
                    />
                  }
                  {
                    data.length === 0 && !isLoading && !error && <Empty />
                  }
                  {/* /Manage Users List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Staff */}
      {/* {!staffDetails &&
        <AddStaff
          adduser={adduser}
          togglePopup={togglePopup}
          departmentOptions={departmentOptions}
          groupOptions={groupOptions}
          workShiftOptions={workShiftOptions}
          jobTypeOptions={jobTypeOptions}
          handleRefreshData={handleRefreshData}
        />
      } */}
      {/* /Add Staff */}
      {/* /Edit Staff */}
      {/* {staffDetails &&
        <EditStaff
          staffDetails={staffDetails}
          setStaffDetails={setStaffDetails}
          adduser={adduser}
          togglePopup={togglePopup}
          departmentOptions={departmentOptions}
          groupOptions={groupOptions}
          workShiftOptions={workShiftOptions}
          jobTypeOptions={jobTypeOptions}
          handleRefreshData={handleRefreshData}
        />
      } */}
      {/* /Edit Staff */}

      {/* <div className="form-sorts dropdown">
        <Filter
          filterSlider={filterSlider}
          setFilterSlider={setFilterSlider}
          sourceOptions={[]}
          industryOptions={[]}
          countryOptions={[]}
          setFilterByObj={setFilterByObj}
        // fetchLeadData={fetchLeadData}

        />
      </div> */}

    </>
  );
};

export default StaffReportPage;
