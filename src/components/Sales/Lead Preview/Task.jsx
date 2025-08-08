import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Empty } from 'antd';
import axios from 'axios';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';

const Task = ({ leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [taskList, setTaskList] = useState([]);
    const [taskDetailsToggle, setTaskDetailsToggle] = useState(false);
    const [taskDetails, setTaskDetails] = useState({})

    function handleTaskToggle(data) {
        setTaskDetailsToggle(prev => !prev)
        setTaskDetails((prev) => ({ ...data }))
    }

    const fetchTaskListByLeadid = async () => {
        try {
            const response = await axios.get(`${apiUrl}/task/task-list-by-leadid/${leadDetails.leadId}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const taskLists = response.data.data.map((task)=>({
                ...task,
                tags: JSON.parse(task.tags)
            }))
            setTaskList((prev) => [...taskLists])
            setTaskDetailsToggle(false)
        } catch (error) {
            toast.error(error.message)
        }
    };

    useEffect(() => {

        if (leadDetails.leadId) {
            fetchTaskListByLeadid();
        }

    }, [leadDetails.leadId])

    return (<>
        <div className="tab-pane fade" id="task">
            <div className="view-header">
                <h4>Task {taskList.length}</h4>
            </div>
            {taskList.length === 0 ? <Empty description={false} /> :
                <div className="calls-activity">
                    <div className="contact-activity" style={{ cursor: 'pointer' }}>
                        {taskList.map((item) => (
                            <TaskList
                                key={item.taskId}
                                data={item}
                                onTaskToggle={handleTaskToggle}
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
        {/* {
            taskDetails &&
            <TaskDetails
                taskToggle={taskDetailsToggle}
                setTaskToggle={setTaskDetailsToggle}
                data={taskDetails}
                fetchTaskData={fetchTaskListByLeadid}
            />
        } */}

    </>
    )
}

export default Task