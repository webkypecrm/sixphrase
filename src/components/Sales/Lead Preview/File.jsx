import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import 'react-datepicker/dist/react-datepicker.css';
import FileList from "./FileList";
import AddDocuments from "../LeadDetails/AddDocuments";



const File = ({ leadFollowupData, fetchLeadFollowupData, leadDetails }) => {
    // const [fileData, setFileData] = useState([]);

    // console.log('fileData in File =>', leadFollowupData)

    const fileData = leadFollowupData.filter((item) => item.type == 'fileUpdate')



    return (
        <>
            <div className="tab-pane fade" id="files">
                <div className="view-header">
                    <h4>Files</h4>
                </div>
                <div className="files-activity">
                    <div className="files-wrap">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <div className="file-info">
                                    <h4>Manage Documents</h4>
                                    <p>
                                        Send customizable quotes, proposals and
                                        contracts to close deals faster.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                                <ul className="file-action">
                                    <li>
                                        <Link
                                            to="#"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#create_lead_file"
                                        >
                                            Create Document
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {fileData.map((file) =>
                        <FileList
                            key={file.id}
                            file={file}
                        />
                    )}
                </div>
            </div>

            <AddDocuments fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={leadDetails} />

        </>
    )
}

export default File