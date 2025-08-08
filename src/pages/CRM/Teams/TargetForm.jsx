import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DataTable from "../../../components/Table/DataTable.jsx";

const TargetForm = ({ title, onCancel, staffId , onQuarterSummary}) => {
  const [targetData, setTargetData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialForm = {
    year: "2025",
    quarter: "Q1",
    month: "April",
    salePrice: "",
    saleUnit: "",
  };
  const [form, setForm] = useState(initialForm);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = 2025 + i;
    return { value: year, label: year.toString() };
  });

  const quarterOptions = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
  ];

  const monthOptions = [
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
  ];

  const ratingOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  const getQuarter = (month) => {
    const q1 = ["April", "May", "June"];
    const q2 = ["July", "August", "September"];
    const q3 = ["October", "November", "December"];
    const q4 = ["January", "February", "March"];
    if (q1.includes(month)) return "Q1";
    if (q2.includes(month)) return "Q2";
    if (q3.includes(month)) return "Q3";
    if (q4.includes(month)) return "Q4";
    return "";
  };


    // ✅ Get target data
  const getTarget = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/target-list?teamMemberId=${staffId}&month=&year=`,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      const data = res.data.data || [];
      setTargetData(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ Calculate and send Q1–Q4 totals to parent
  useEffect(() => {
    if (!targetData.length) return;

    const quarterTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

    targetData.forEach((item) => {
      const q = getQuarter(item.month);
      if (q) quarterTotals[q] += parseFloat(item.salePrice || 0);
    });

    if (onQuarterSummary) {
      onQuarterSummary(quarterTotals);
    }
  }, [targetData]);

  useEffect(() => {
    if (staffId) getTarget();
  }, [staffId]);

  const prepareTableData = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const quarter = getQuarter(item.month);
      const key = `${item.year}-${quarter}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    const sortedKeys = Object.keys(grouped).sort(); // sort by year-Q1..Q4
    const finalData = [];

    sortedKeys.forEach((key, index) => {
      const records = grouped[key];

      finalData.push(...records);

      const totalSalePrice = records.reduce(
        (sum, r) => sum + parseFloat(r.salePrice || 0),
        0
      );
      const totalSaleUnit = records.reduce(
        (sum, r) => sum + parseFloat(r.saleUnit || 0),
        0
      );

      finalData.push({
        isSummary: true,
        key: `summary-${key}`,
        quarter: key.split("-")[1],
        year: key.split("-")[0],
        salePrice: totalSalePrice,
        saleUnit: totalSaleUnit,
      });

      // ✅ Only insert header if there is a next quarter group
      if (index < sortedKeys.length - 1) {
        finalData.push({
          isSpacer: true,
          key: `spacer-${sortedKeys[index + 1]}`,
        });
        finalData.push({
          isHeader: true,
          key: `header-${sortedKeys[index + 1]}`,
        });
      }
    });

    return finalData;
  };

  const columns = [
    {
      title: "Month/Year",
      key: "monthYear",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          <strong>Total</strong>
        ) : record.isHeader ? (
          <strong>Month/Year</strong>
        ) : (
          <span>
            {record?.month}-{record?.year}
          </span>
        ),
    },
    {
      title: "QTR",
      key: "qtr",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isHeader ? (
          <strong>Qtr</strong>
        ) : (
          <span>{record?.quarter || "-"}</span>
        ),
    },
    {
      title: "Sales Target",
      key: "target",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          <strong>{record.salePrice}</strong>
        ) : record.isHeader ? (
          <strong>Sales Target</strong>
        ) : (
          <span>{record?.salePrice}</span>
        ),
    },
    {
      title: "Sales Unit",
      key: "unit",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          <strong>{record.saleUnit}</strong>
        ) : record.isHeader ? (
          <strong>Sales Unit</strong>
        ) : (
          <span>{record?.saleUnit}</span>
        ),
    },
    {
      title: "Achievement",
      key: "achievement",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          "0"
        ) : record.isHeader ? (
          <strong>Achievement</strong>
        ) : (
          record.staff?.email || "0"
        ),
    },
    {
      title: "Achieve Unit",
      key: "achieveUnit",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          "0"
        ) : record.isHeader ? (
          <strong>Achieve Unit</strong>
        ) : (
          record.staff?.department?.name || "0"
        ),
    },
    {
      title: "Rating",
      width: 80,
      key: "rating",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? null : record.isHeader ? (
          <strong>Rating</strong>
        ) : (
          <Select
            options={ratingOptions}
            placeholder="Select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              container: (base) => ({
                ...base,
                width: 80,
                fontSize: "12px",
              }),
              control: (base) => ({
                ...base,
                minHeight: 25,
                height: 25,
                fontSize: "12px",
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 25,
              }),
              valueContainer: (base) => ({
                ...base,
                height: 25,
                padding: "0 8px",
                fontSize: "12px",
              }),
              singleValue: (base) => ({
                ...base,
                fontSize: "12px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "12px",
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        ),
    },
  ];

  const onFormChange = (updatedData) => {
    let updatedForm = { ...form, ...updatedData };
    if (updatedData.month) {
      updatedForm.quarter = getQuarter(updatedData.month);
    }
    setForm(updatedForm);
  };

  // Add Target
  const addTarget = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/product/add-target/${staffId}`,
        form,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      toast.success(res.data.message);
      setForm(initialForm);
      getTarget();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get Target
  // const getTarget = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${apiUrl}/product/target-list?teamMemberId=${staffId}&month=&year=`,
  //       { headers: { Authorization: `Bearer ${Token}` } }
  //     );
  //     setTargetData(res.data.data);
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  // useEffect(() => {
  //   if (!staffId) return;
  //   getTarget();
  // }, [staffId]);

  const selectCustomStyles30 = {
    control: (base) => ({
      ...base,
      minHeight: 30,
      height: 30,
      fontSize: "12px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 30,
      display: "flex",
      alignItems: "center", // ✅ Center the dropdown icon vertically
    }),
    valueContainer: (base) => ({
      ...base,
      height: 30,
      padding: "0 8px",
      display: "flex",
      alignItems: "center", // ✅ Center the text vertically
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "12px",
      lineHeight: "30px", // optional
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base) => ({
      ...base,
      fontSize: "12px",
    }),
  };

  return (
    <Fragment>
      <div className="sidebar-layout" style={{ maxWidth: "72%" }}>
        <div
          className="sidebar-header"
          style={{ backgroundColor: "#2f5796", padding: "5px 20px" }}
        >
          <h6 style={{ color: "#fff" }}>{title}</h6>
          <Link to="#" className="sidebar-close toggle-btn" onClick={onCancel}>
            <i className="ti ti-x" />
          </Link>
        </div>

        <div className="toggle-body">
          <form onSubmit={addTarget}>
            <div className="row">
              <div className="col-md-2">
                <div className="form-wrap">
                  <label
                    className="col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    Year <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={yearOptions}
                    value={yearOptions.find(
                      (y) => y.value === Number(form.year)
                    )}
                    onChange={(option) =>
                      onFormChange({
                        ...form,
                        year: option?.value?.toString() || "",
                      })
                    }
                    // isClearable
                    styles={selectCustomStyles30}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-wrap">
                  <label
                    className="col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    Quarter
                  </label>
                  <Select
                    options={quarterOptions}
                    value={quarterOptions.find((q) => q.value === form.quarter)}
                    onChange={(option) =>
                      onFormChange({ ...form, quarter: option?.value || "" })
                    }
                    // isClearable
                    styles={selectCustomStyles30}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-wrap">
                  <label
                    className="col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    Month <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={monthOptions}
                    value={monthOptions.find((m) => m.value === form.month)}
                    onChange={(option) =>
                      onFormChange({ ...form, month: option?.value || "" })
                    }
                    // isClearable
                    styles={selectCustomStyles30}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-wrap">
                  <label
                    className="col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    Sales (Rs)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.salePrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value))
                        onFormChange({ ...form, salePrice: value });
                    }}
                    placeholder="Enter sales"
                    style={{
                      minHeight: "31px",
                      fontSize: "12px",
                      padding: "0.2rem 0.85rem",
                    }}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-wrap">
                  <label
                    className="col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    Unit (Qty)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.saleUnit}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value))
                        onFormChange({ ...form, saleUnit: value });
                    }}
                    placeholder="Enter units"
                    style={{
                      minHeight: "31px",
                      fontSize: "12px",
                      padding: "0.2rem 0.85rem",
                    }}
                  />
                </div>
              </div>

              <div className="col-md-2" style={{ marginTop: "27px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ padding: "5px 20px", fontSize: "12px" }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="row mt-3 p-2">
            <div className="table-responsive custom-table-css target-table p-0 mb-4">
              <DataTable
                dataSource={prepareTableData(targetData)}
                columns={columns}
                disableSelection={true}
                pagination={false}
                rowClassName={(record) =>
                  record.isSummary
                    ? "table-summary-row"
                    : record.isHeader
                    ? "table-header-repeat table-header-spacing"
                    : ""
                }
              />
            </div>
          </div>
          <div className="submit-button text-end mt-3">
            <Link
              to="#"
              className="btn btn-light sidebar-close"
              onClick={onCancel}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TargetForm;
