
// eslint-disable-next-line react/prop-types
const Input = ({ label, isMandatory, type, name, value, onChange, ...prop }) => {
    return (
        <div className="form-wrap">
            <label className="col-form-label">{label}
                {isMandatory ? <span className="text-danger">*</span> : null}
            </label>
            <input
                type={type}
                name={name}
                required={isMandatory}
                value={value}
                onChange={onChange}
                className="form-control"
                disabled={prop.disabled}
                min={prop.min}
            />
        </div>
    )
}

export default Input