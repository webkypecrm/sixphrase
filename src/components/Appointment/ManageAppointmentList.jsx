import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import DataTable from "../../components/Table/DataTable"
import moment from 'moment';
import DeleteData from '../DeleteData/DeleteData';
import { toast } from "react-toastify";
import axios from "axios";
// import LeadPreview from './Lead Preview/LeadPreview';
// import AssignTo from './AssignTo';
// import ChangeStage from './ChangeStage';
// import MultipleAssignTo from './MultipleAssignTo';
import { useNavigate } from "react-router-dom"
import ChangeAppointmentStatus from '../Sales/ChangeAppointmentStatus';
import RescheduleAppointment from '../Sales/LeadDetails/RescheduleAppointment';


const ManageAppointmentList = ({
    data,
    onLeadDetails,
    togglePopup,
    fetchAppointmentData,
    setEditCompany,
    setCompanyDetails,
    manageColumns,
    pageSize,
    totalPages,
    handleRefresh,
    leadData,
    counselorOptions
}) => {
    const navigate = useNavigate();
    const [stars, setStars] = useState({});
    const [appointmentId, setAppointmentId] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [leadPreview, setLeadPreview] = useState(false);
    const [leadDetails, setLeadDetails] = useState({});
    const [leadForAssign, setLeadForAssign] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [appointmentStatus, setAppointmentStatus] = useState({})

    // console.log('data in list =>', appointmentStatus);
    // console.log('onLeadDetails in list =>', onLeadDetails);


    const togglePopupTwo = () => {
        togglePopup((prev) => !prev);
    };
    const togglePopupThree = () => {
        setEditCompany((prev) => !prev)
    }

    const handleDelete = async () => {
        if (appointmentId) {
            try {
                await axios.delete(`${apiUrl}/appointment/delete/${appointmentId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                })
                fetchAppointmentData()
                toast.success('Appointment deleted successfully!')
                setAppointmentId(null)
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleFetchData = (page) => {
        fetchLeadData(page);
    }

    let columns = [
        {
            title: () => {
                return <div
                    data-bs-toggle="modal"
                    data-bs-target="#multiple_assigned_to"
                    style={{ cursor: 'pointer' }}
                >
                    {selectedRowKeys.length > 0 ? "🔂" : ''}
                </div>
            },
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => {
                return moment(text).format("DD MMM YYYY, hh:mm a")
            }
        },
        {
            title: "Appointment Date",
            key: "id",
            render: (text, record) => {
                return (
                    <div>
                        {record?.appointmentDate} {record?.appointmentTime}
                    </div>
                )
            }
        },
        {
            title: "Details",
            key: "name",
            render: (text, record, index) => (
                <div className="table-avatar d-flex align-items-center" >
                    <ul>
                        <li>
                            Name -  {record?.name}
                        </li>
                        <li>
                            Counselor -  {counselorOptions?.find(option => option.value == record?.counselorId)?.label || "Not Selected"}
                        </li>
                        <li>
                            Treatment -  {record?.treatment}
                        </li>
                        <li>
                            Category - {record?.Category?.name}
                        </li>

                    </ul>
                </div>
            ),

        },
        // {
        //     title: "Treatment",
        //     dataIndex: "treatment",
        //     key: "id",
        // },
        // {
        //     title: "Category",
        //     dataIndex: "category",
        //     key: "id",
        //     render: (text, record) => {
        //         return (
        //             <div>
        //                 {record?.Category?.name}
        //             </div>
        //         )
        //     }
        // },
        // {
        //     title: "Counselor",
        //     dataIndex: "counselorName",
        //     key: "id",
        // },

        {
            title: "Message",
            dataIndex: "message",
            key: "message",
        },
        {
            title: "Assign To",
            dataIndex: "assignedTo",
            key: "assignedTo",
        },

        {
            title: "Status",
            dataIndex: "status",
            key: 'status',
            render: (text, record) => (
                <div
                    data-bs-toggle="modal"
                    data-bs-target="#reschedule_appointment"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setAppointmentStatus(record) }}
                >
                    {text}
                </div>
            ),
            sorter: true,
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => (
                <Link
                    // className="dropdown-item"
                    // data-bs-toggle="modal"
                    // data-bs-target="#delete_contact"
                    // onClick={() => setAppointmentId(record.id)}
                >
                    <i className="ti ti-trash text-danger"></i>
                </Link>
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


    return (
        <>
            <div className="table-responsive custom-table">
                <DataTable
                    dataSource={data}
                    columns={modifiedColumns}
                    onSelectionChange={handleSelectedRowKeysChange}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    onFetchRecord={handleFetchData}
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
            <DeleteData title="Appointment" onDeleteHandler={handleDelete} />

            {/* <LeadPreview
                leadPreview={leadPreview}
                setLeadPreview={setLeadPreview}
                leadDetails={leadDetails} 
                setLeadDetails={setLeadDetails}
            /> */}

            {/* <AssignTo
                leadForAssign={leadForAssign}
                fetchLeadData={fetchLeadData}
            />

            <ChangeStage
                leadForAssign={leadForAssign}
                fetchLeadData={fetchLeadData}
            />

            <MultipleAssignTo
                selectedRowKeys={selectedRowKeys}
                fetchLeadData={fetchLeadData}
                setSelectedRowKeys={setSelectedRowKeys}
            /> */}


            <ChangeAppointmentStatus
                data={appointmentStatus}
                handleRefreshData={handleRefresh}
                leadData={leadData}

            // followUpStage={stageHistoryOptions}
            />

            {/* <RescheduleAppointment
                leadDetails={data}
                fetchLeadDetails={fetchLeadDetails}
                fetchLeadFollowupData={fetchLeadFollowupData}
                counselorOptions={counselorOptions}
                fetchStageHistoryData={fetchStageHistoryData}
                appointmentData={appointmentData}
            /> */}



        </>
    )
}

export default ManageAppointmentList