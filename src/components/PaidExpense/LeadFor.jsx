import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

const LeadFor = ({ setFormData, formData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [isLoading, setIsLoading] = useState(false);
    const [filterBySource, setFilterBySource] = useState([]);
    const [option, setOption] = useState([]);

    const handleChange = (newValue) => {
        setFilterBySource(newValue ? newValue.map((option) => option.value) : []);
        setFormData((prevData) => ({
            ...prevData,
            leadFor: newValue ? newValue.map((option) => option.value) : []
        }))
    };
    const handleRefresh = () => {
        fetchLeadForData()
    }
    const handleCreate = async (inputValue) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${apiUrl}/master/add-lead-for`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + Token
                },
                body: JSON.stringify({ name: String(inputValue) })
            })
            const resData = await response.json();
            handleRefresh()

            setOption((prevOptions) => [...prevOptions, resData.data]);
            setFilterBySource((prevSource) => [...prevSource, resData.data.id]);

            setFormData((prevData) => ({
                ...prevData,
                leadFor: [...prevData.leadFor, resData.data.id]
            }))

            toast.success(resData.message)
            setIsLoading(false);
        } catch (error) {
            toast.error(error.message)
            setIsLoading(false);
        }

        // const newOption = { value: inputValue, label: inputValue };
        // setOption((prevOptions) => [...prevOptions, newOption]);
        // setFilterBySource((prevSource) => [...prevSource, inputValue]);
    };

    const fetchLeadForData = async () => {
        try {
            const response = await fetch(`${apiUrl}/master/lead-for-list`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            const formattedData = resData.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setOption(formattedData);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchLeadForData()
    }, [])

    useEffect(() => {

        if (formData?.leadFor?.length > 0) {
            setFilterBySource(() => ([...formData.leadFor]))
        }

    }, [formData])

    // console.log("filterBySource =>", filterBySource)
    // console.log("option =>", option)

    // console.log("formData in lead for =>", formData)


    const CustomOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div
                ref={innerRef}
                {...innerProps}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <span>{data.label}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent select dropdown from closing
                        handleDelete(data.value);
                    }}
                    style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    <i className="ti ti-trash text-danger" />
                </button>
            </div>
        );
    };

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            maxHeight: "200px", // Set max height for the dropdown
            overflowY: "auto", // Enable vertical scrolling
            cursor: 'pointer'
        }),
    };

    return (
        <div className="col-md-12">
            <div className="form-wrap">
                <label className="col-form-label">
                    Lead For <span className="text-danger">*</span>
                </label>
                <CreatableSelect
                    isMulti
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    classNamePrefix="react-select"
                    className="basic-multi-select"
                    value={option.filter((option) =>
                        filterBySource.includes(option.value)
                    )}
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    options={option}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                // components={{ Option: CustomOption }} // Use the custom Option
                // styles={customStyles} // Apply custom styles
                // menuPlacement="auto" // Automatically adjust the dropdown position
                // // menuPortalTarget={document.body} // Render dropdown in the portal
                // menuShouldScrollIntoView={false} // Avoid automatic scrolling into view
                // onMenuScrollToBottom={true}
                // onMenuScrollToTop={true}
                />
            </div>
        </div>
    );
};

export default LeadFor;