import React from 'react';
import Select from 'react-select';

const Dropdown = ({ label, name, value, isMandatory, onChange, options, placeholder }) => {

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'white', // Ensures the options have a white background
            zIndex: 9999 // Prevents overlap issues
        })
    };

    return (
        <div className="form-wrap">
            <label className="col-form-label">{label}
                {isMandatory ? <span className="text-danger">*</span> : null}
            </label>
            <Select
                classNamePrefix="react-select"
                className="select"
                required={isMandatory}
                name={name}
                placeholder={placeholder}
                value={options.find(option => option.value === value) || null} // to reset the value
                onChange={(event) => {
                    let { value } = event
                    onChange({ target: { name, value } })
                }}
                options={options}
                styles={customStyles}
            />
        </div>
    )
}

export default Dropdown