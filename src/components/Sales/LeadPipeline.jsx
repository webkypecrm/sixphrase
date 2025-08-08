import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LeadPipeline = ({ stageOptions, handleStatusChange, totalStageDataCount, getStageId, result }) => {
    const [linkActive, setLinkActive] = useState(1);
    // console.log("totalStageDataCount =>", totalStageDataCount)

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
                            <Link to="#" className={linkActive == stage?.value ? `bg-pending` : ``}

                            >
                                {stage?.label} {"("} {totalStageDataCount ? totalStageDataCount[stage?.value] : ''} {")"}

                            </Link>
                        </li>)}

                    </ul>
                </div>
                <span className="badge border border-dark text-dark"  >
                    search counts: {result}
                </span>
            </div>
        </div>
    )
}

export default LeadPipeline