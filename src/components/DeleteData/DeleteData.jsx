
import { Link } from "react-router-dom"

const DeleteData = ({ title,  onDeleteHandler }) => {


    return <div
        className="modal custom-modal fade"
        id="delete_contact"
        role="dialog"
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header border-0 m-0 justify-content-end">
                    <button
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    >
                        <i className="ti ti-x" />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="success-message text-center">
                        <div className="success-popup-icon">
                            <i className="ti ti-trash-x" />
                        </div>
                        <h3>Remove {title}?</h3>
                        <p className="del-info">Are you sure you want to remove it.</p>
                        <div className="col-lg-12 text-center modal-btn">
                            <Link
                                to="#"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </Link>
                            <Link
                                to="#"
                                onClick={onDeleteHandler}
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                            >
                                Yes, Delete it
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


export default DeleteData