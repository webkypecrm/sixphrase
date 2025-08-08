import React from 'react'

const Modal = ({id, children }) => {
    return (
        <div className="modal custom-modal fade" id={id} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal