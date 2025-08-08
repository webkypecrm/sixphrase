import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LeadPipelineInDasboard = ({ stageOptions, handleStatusChange, totalStageDataCount, getStageId }) => {
    const [linkActive, setLinkActive] = useState(1);

    useEffect(() => {
        if (getStageId !== null) {
            setLinkActive(getStageId)
        }
    }, [getStageId])



    return (
        <div className="col-md-12">
            <div className="contact-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="pipeline-list">
                    <ul>
                        {stageOptions.map((stage, index) => <li key={stage?.value}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                handleStatusChange(String(stage.value));
                                setLinkActive(stage.value);
                            }}
                        >
                            <Link to="/sales/leads" className={linkActive == stage?.value ? `bg-pending` : ``}
                            >
                                {stage?.label} {"("} {totalStageDataCount ? totalStageDataCount[stage?.value] : ''} {")"}

                            </Link>
                        </li>)}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default LeadPipelineInDasboard