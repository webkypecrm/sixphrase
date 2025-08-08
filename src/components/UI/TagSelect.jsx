import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const TagSelect = ({ label, setOption, option }) => {
  const [filterBySource, setFilterBySource] = useState([]);

  const handleChange = (newValue) => {
    setFilterBySource(newValue ? newValue.map((option) => option.value) : []);
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOption((prevOptions) => [...prevOptions, newOption]);
    setFilterBySource((prevSource) => [...prevSource, inputValue]);
  };

  return (
    <div className="col-md-12">
      <div className="form-wrap">
        <label className="col-form-label">
          {label} <span className="text-danger">*</span>
        </label>
        <CreatableSelect
          isMulti
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
        />
      </div>
    </div>
  );
};

export default TagSelect;