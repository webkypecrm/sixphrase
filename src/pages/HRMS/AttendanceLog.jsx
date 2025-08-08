import React, { Suspense, useState, lazy, useEffect } from 'react';
import PageHeader from '../../components/Layouts/PageHeader';
import ContentLoader from '../../components/Layouts/ContentLoader/Index';
// import { ManageUpcomingAppoinmentList } from '../../components/Sales/UpcomingAppointment/ManageUpcomingAppoinmentList';
const ManageAttendanceLog = lazy(() => import("../../components/Sales/AttendanceLog/ManageAttendanceLog"));
import { Empty } from 'antd';
import axios from "axios";
import SearchSection from '../../components/Sales/AttendanceLog/SearchSection';
import dayjs from 'dayjs';

const AttendanceLog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [result, setResult] = useState(0);
  const pageSize = 800;
  const initialFilter = {
    // from: '2025-04-29 18:30:00.000',
    // to: '2025-04-30 17:29:00.000',
    from: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS'),
    to: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS'),
    source: [],
    industry: [],
    country: [],
    state: [],
    city: [],
    stage: [],
    company: [],
    leadOwner: [],
    assignedTo: [],
    leadFor: [],
    search: "",
    status: "",
    workPlace: '',
    timeFlag: ''
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const [staffOptions, setStaffOptions] = useState([]);

  function handleRefreshPage() {
    window.location.reload()
  }
  const safeJSONParse = (str, defaultValue = []) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultValue;
    }
  };

  // console.log("filterByObj =>", filterByObj)

  const fetchAttendanceLogData = async (page) => {
    try {
      let { from, to, industry, source, country, state, city, stage, leadOwner, assignedTo, leadFor, search, status, workPlace, timeFlag } = filterByObj;

      // let url = `${apiUrl}/staff/attendance-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
      //           &industry=${industry}&source=${source}&country=${country}&state=${state}&city=${city}&stage=${stage}&leadOwner=${leadOwner}&assignedTo=${assignedTo}&leadFor=${leadFor}&search=${search}`

      //let url = `${apiUrl}/staff/attendance-list?page=${page ? page : 1}`

      let url = `${apiUrl}/staff/attendance-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
       &industry=${industry}&source=${source}&country=${country}&state=${state}&city=${city}&stage=${stage}&leadOwner=${leadOwner}&assignedTo=${assignedTo}&leadFor=${leadFor}&search=${search}&status=${status}&workPlace=${workPlace}&timeFlag=${timeFlag}`


      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });

      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.leadId,
      }));

      setData(formattedData);
      setTotalPages(formattedData.length);
      setResult(formattedData.length);

    } catch (error) {
      console.log(error)
    }
  };



  useEffect(() => {
    fetchAttendanceLogData();

  }, [])

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/staff/staff-list`, {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });
        const formattedData = response.data.data.map((item) => ({
          label: item.name,
          value: item.staffId
        }));
        setStaffOptions(() => [{ label: 'Select', value: '' }, ...formattedData]);

      } catch (error) {
        console.log(error)
      }
    };

    fetchStaffData()
  }, [])

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <PageHeader title="Attendance Log" count={totalPages} pageRefresh={handleRefreshPage} />

            {/* /Page Header */}

            <div className="card main-card">
              <div className="card-body">

                {/* Search */}
                <SearchSection
                  fetchUpcomintAppointmentData={fetchAttendanceLogData}
                  filterByObj={filterByObj}
                  setFilterByObj={setFilterByObj}
                  staffOptions={staffOptions}
                />
                {/* /Search */}



                <Suspense fallback={data.length > 0 ? <ContentLoader /> : <Empty />}>
                  <ManageAttendanceLog
                    data={data}
                    pageSize={pageSize}
                    totalPages={result}
                    fetchUpcomintAppointmentData={fetchAttendanceLogData}
                  />
                </Suspense>

                {/* <ManageUpcomingAppointmentList /> */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceLog