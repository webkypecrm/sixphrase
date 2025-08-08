import React from 'react'
import { Link } from 'react-router-dom'

const FileList = ({ file }) => {

    // console.log("file in filelist =>", file)

    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    function getTime(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Get time (hours and minutes)
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime
    }

    const getYouTubeVideoId = (url) => {
        const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    return (
        <div className="files-wrap" >
            <div className="row align-items-center">
                <div className="col-md-8">
                    <div className="file-info">
                        <div className="file-user" >
                            <div style={{ display: 'flex' }}>
                                <img
                                    src={file?.staff?.profilePicUrl}
                                    alt="img"
                                />
                            </div>
                            <div style={{ display: 'grid' }}>
                                <p>{file?.staff?.name} uploaded file</p>
                                <p style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>
                                    {getDate(file?.leadDocument?.createdAt)},{getTime(file?.leadDocument?.createdAt)}
                                </p>
                            </div>

                        </div>
                        <h4>{file?.leadDocument?.fileName}</h4>
                        <p>
                            {file?.leadDocument?.comment}
                        </p>
                        <p>
                            {/* {file?.leadDocument?.createdAt} */}
                        </p>
                    </div>
                </div>
                <div className="col-md-4 text-md-end">
                    <ul className="file-action">
                        <li>
                            <Link className="badge badge-tag badge-danger-light" to={file?.leadDocument?.fileType === 'video' ? file?.leadDocument?.language : file?.leadDocument?.attachment1Url}>

                                <span>{file?.leadDocument?.fileType}</span>
                                {file?.leadDocument?.fileType == 'image' &&
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                <img src={file?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                            </span>
                                        </div>

                                    </div>
                                }
                                {file?.leadDocument?.fileType == 'jpg' &&
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                <img src={file?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                            </span>
                                        </div>
                                    </div>
                                }
                                {file?.leadDocument?.fileType == 'png' &&
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                <img src={file?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                            </span>
                                        </div>

                                    </div>
                                }

                                {file?.leadDocument?.fileType == 'pdf' &&
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                <img src="/assets/img/pdf-icon.png" alt="Preview" style={{ width: '100px', height: '100px' }} />
                                            </span>
                                        </div>
                                    </div>
                                }
                                {file?.leadDocument?.fileType === 'video' && file?.leadDocument?.language && (
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                {file.leadDocument.language.includes("youtube.com") || file.leadDocument.language.includes("youtu.be") ? (
                                                    // YouTube video
                                                    <iframe
                                                        width="100%"
                                                        height="100px"
                                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(file.leadDocument.language)}`}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : (
                                                    // Non-YouTube video
                                                    <video width="100%" height="100px" controls>
                                                        <source src={file.leadDocument.language} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}


                                {file?.leadDocument?.fileType === 'zip' && (
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                <img src="/assets/img/zip-icon.png" alt="Preview" style={{ width: '100px', height: '100px' }} />
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {file?.leadDocument?.fileType === 'csv' && (
                                    <div className="note-download">
                                        <div className="note-info">
                                            <span className="note-icon">
                                                <img src="/assets/img/excel-icon.png" alt="Preview" style={{ width: '100px', height: '100px' }} />
                                            </span>
                                        </div>
                                    </div>
                                )}

                            </Link>
                        </li>
                        <li>
                            <div className="dropdown action-drop">
                                <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="ti ti-dots-vertical" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a
                                        className="dropdown-item"
                                        href={file?.leadDocument?.language ? file?.leadDocument?.leadDocument : file?.leadDocument?.attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="ti ti-download text-info" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FileList