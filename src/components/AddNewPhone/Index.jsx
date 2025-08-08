import React from 'react'
import { Link } from 'react-router-dom'

const AddNewPhone = ({ addNewContent, newContents }) => {
    return (
        <div className="col-md-6" >
            <div className="add-product-new">
                <div className="row align-items-end">
                    <div className="col-md-12">
                        <div className="form-wrap mb-2">
                            <label className="col-form-label">
                                Phone <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue=""
                                onChange={() => {
                                    
                                    handleInputChange({ target: { name: '' } })
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="col-md-6">
                <Link
                    onClick={addNewContent}
                    to="#"
                    className="add-new add-new-phone mb-3 d-block"
                >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add New
                </Link>
            </div>
        </div>
    )
}

export default AddNewPhone