import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { all_routes } from "../Router/all_routes";
import Select from "react-select";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../components/Table/DataTable";
import { companiesData } from "../../data/companiesData";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const Services = () => {
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [addTogglePopupTwo, setAddTogglePopupTwo] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [multiImages, setMultiImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);
  const [productBrandOptions, setProductBrandOptions] = useState([]);
  const [productOEMOptions, setProductOEMOptions] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [count, setCount] = useState(0);
  const [serviceDetails, setServiceDetails] = useState({});
  const [currentEditId, setCurrentEditId] = useState(null);

  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };
  // const [selectedDate1, setSelectedDate1] = useState(new Date());
  // const handleDateChange1 = (date) => {
  //   setSelectedDate1(date);
  // };

  const data = companiesData;
  const route = all_routes;

  const [leadPreview, setLeadPreview] = useState(false);
  const [leadDetails, setLeadDetails] = useState({});

  // main photo
  const fileInputRef = useRef(null);
  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  //more photos
  const multiImageRef = useRef(null);
  const handleMultipleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Total allowed is 10
    const remainingSlots = 10 - multiImages.length;

    if (remainingSlots <= 0) {
      toast.warn("You can only upload up to 10 images.");
      return;
    }

    if (newFiles.length > remainingSlots) {
      toast.warn(`Only ${remainingSlots} image(s) can be added.`);
    }

    const limitedNewFiles = newFiles.slice(0, remainingSlots);
    setMultiImages((prev) => [...prev, ...limitedNewFiles]);

    // Reset input field to allow re-uploading the same image if removed
    e.target.value = null;
  };

  // remove image
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = multiImages.filter((_, i) => i !== indexToRemove);
    setMultiImages(updatedImages);
  };

  // ------------------------------------APIS---------------------------------------
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    const serviceRate = parseFloat(updated.serviceRate) || 0;
    const discountPercent = parseFloat(updated.discountPercentage) || 0;

    const discountValue = Math.round((serviceRate * discountPercent) / 100);
    updated.discountValue = discountValue.toString();

    const finalPrice = Math.round(serviceRate - discountValue);
    updated.finalPrice = finalPrice.toString();

    // GST value update if gstPercentage already selected
    const gstPercent = parseFloat(updated.gstPercentage) || 0;
    const gstValue = Math.round((finalPrice * gstPercent) / 100);
    updated.gstValue = gstValue.toString();

    const priceAfterDiscount = finalPrice + gstValue;
  updated.priceAfterDiscount = priceAfterDiscount.toString();

    setFormData(updated);
  };

   const handleGstChange = (selectedOption) => {
  const gstPercentage = selectedOption.value;
  const finalPrice = parseFloat(formData.finalPrice) || 0;
  const gstValue = Math.round((finalPrice * parseFloat(gstPercentage)) / 100);
  const priceAfterDiscount = finalPrice + gstValue;

  setFormData((prevData) => ({
    ...prevData,
    gstPercentage,
    gstValue: gstValue.toString(),
    priceAfterDiscount: priceAfterDiscount.toString(),
  }));
};


  const initialForm = {
    productServiceCategoryId: null,
    productServiceSubCategoryId: null,
    productServiceSubSubCategoryId: null,
    productBrandId: null,
    productOEMId: null,
    serviceName: "",
    serviceHSNcode: "",
    serviceType: "",
    serviceRate: "",
    discountPercentage: "",
    discountValue: "",
    finalPrice: "",
    gstPercentage: "",
    gstValue: "",
    priceAfterDiscount: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSelectChange = (name, selectedOption) => {
    if (name === "productBrand") {
      setFormData((prev) => ({
        ...prev,
        productBrandId: selectedOption?.value || null,
      }));
    } else if (name === "productOEMId") {
      setFormData((prev) => ({
        ...prev,
        productOEMId: selectedOption?.value || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption?.value || null,
      }));
    }
  };

  const handleSelectChange2 = (field, option) => {
    const selectedValue = option ? Number(option.value) : 0;

    setFormData((prev) => ({
      ...prev,
      [field]: selectedValue,
    }));

    if (field === "productServiceCategoryId") {
      setFormData((prev) => ({
        ...prev,
        productServiceSubCategoryId: null,
        productServiceSubSubCategoryId: null,
      }));
      fetchSubCategories(selectedValue);
    }

    if (field === "productServiceSubCategoryId") {
      setFormData((prev) => ({
        ...prev,
        productServiceSubSubCategoryId: null,
      }));
      fetchSubSubCategories(selectedValue);
    }
  };

  // Category
  const fatchCategory = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-service-category-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const formattedOptions = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setCategoryOptions(formattedOptions);
    } catch (error) {
      setError(error.message);
    }
  };

  // sub category
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-service-sub-category-list-by-product-service-category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const formattedOptions = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
        categoryId: item.categoryId,
      }));
      setSubCategoryOptions(formattedOptions);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch subcategories");
    }
  };

  //sub sub category
  const fetchSubSubCategories = async (subCategoryId) => {
    if (!subCategoryId) return;
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-service-sub-sub-category-list-by-product-service-sub-category/${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const formattedOptions = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
        subCategoryId: item.subCategoryId,
      }));
      setSubSubCategoryOptions(formattedOptions);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch sub-subcategories");
    }
  };

  //Product Brand
  const fatchProductBrand = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/getProductBrand-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const productBrandOptions = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setProductBrandOptions(productBrandOptions);
    } catch (error) {
      setError(error.message);
    }
  };

  //Product OEM
  const fatchProductOEM = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product/getProductOEM-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });

      const productOEMOptions = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setProductOEMOptions(productOEMOptions);
    } catch (error) {
      setError(error.message);
    }
  };

  // Service Post

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const form = new FormData();

    // Helper: append only if value is valid
    const appendIfValid = (key, value, isNumber = false) => {
      if (value !== null && value !== undefined && value !== "") {
        form.append(key, isNumber ? Number(value) : value);
      }
    };

    // Always-required fields
    appendIfValid(
      "productServiceCategoryId",
      formData.productServiceCategoryId,
      true
    );
    appendIfValid("serviceName", formData.serviceName);
    appendIfValid("serviceHSNcode", formData.serviceHSNcode);
    appendIfValid("serviceType", formData.serviceType);
    appendIfValid("serviceRate", formData.serviceRate, true);
    appendIfValid("discountPercentage", formData.discountPercentage, true);
    appendIfValid("discountValue", formData.discountValue, true);
    appendIfValid("finalPrice", formData.finalPrice, true);
    appendIfValid("gstPercentage", formData.gstPercentage, true);
    appendIfValid("gstValue", formData.gstValue, true);
    appendIfValid("priceAfterDiscount", formData.priceAfterDiscount, true);
    appendIfValid("description", formData.description);

    // Optional foreign key fields
    appendIfValid(
      "productServiceSubCategoryId",
      formData.productServiceSubCategoryId,
      true
    );
    appendIfValid(
      "productServiceSubSubCategoryId",
      formData.productServiceSubSubCategoryId,
      true
    );
    appendIfValid("productBrandId", formData.productBrandId, true);
    appendIfValid("productOEMId", formData.productOEMId, true);

    // Add image(s)
    if (imageFile) form.append("serviceImage", imageFile);
    multiImages.forEach((file) => {
      form.append("serviceImages", file);
    });

    try {
      const res = await axios.post(
        `${apiUrl}/product/addproduct-service`,
        form,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setFormData(initialForm);
      setImageFile(null);
      setImage(null);
      setMultiImages([]);
      // ✅ Reset file input manually using refs
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      if (multiImageRef.current) {
        multiImageRef.current.value = null;
      }
      setActivityToggle(false);
      fatchServiceData();
      toast.success("Service added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Service Get
  const fatchServiceData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-product-service-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setServiceData(response.data.data);
      setCount(response.data.totalCount);
    } catch (error) {
      setError(error.message);
    }
  };

  // Service Delete
  const handleDelete = async (e) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/product/delete-productservice/${serviceDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setServiceDetails({});
      fatchServiceData();
      toast.success("Service deleted successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  useEffect(() => {
    fatchCategory();
    fatchProductBrand();
    fatchProductOEM();
    fatchServiceData();
  }, []);

  // service Edit
  const handleEditClick = async (serviceId) => {
    setActivityToggleTwo(true);
    try {
      const res = await axios.get(
        `${apiUrl}/product/get-product-service-by-id/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${Token}` },
        }
      );

      const data = res.data.data;
      console.log("first", data);
      setCurrentEditId(serviceId);
      setFormData({
        ...initialForm,
        ...data, // prefill form
      });
    } catch (err) {
      toast.error(err);
      console.error("Error fetching property types:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const form = new FormData();

    const allowedKeys = [
      "productServiceCategoryId",
      "productServiceSubCategoryId",
      "productBrandId",
      "productOEMId",
      "serviceName",
      "serviceHSNcode",
      "serviceType",
      "serviceRate",
      "discountPercentage",
      "discountValue",
      "finalPrice",
      "description",
    ];

    allowedKeys.forEach((key) => {
      form.append(key, formData[key] ?? "");
    });

    if (
      subSubCategoryOptions.length > 0 &&
      formData.productServiceSubSubCategoryId !== null &&
      formData.productServiceSubSubCategoryId !== undefined &&
      formData.productServiceSubSubCategoryId !== ""
    ) {
      form.append(
        "productServiceSubSubCategoryId",
        formData.productServiceSubSubCategoryId
      );
    }

    // Add image(s)
    if (imageFile) form.append("serviceImage", imageFile);
    multiImages.forEach((file) => {
      form.append("serviceImages", file);
    });

    try {
      const res = await axios.post(
        `${apiUrl}/product/addproduct-service`,
        form,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setFormData(initialForm);
      setImageFile(null);
      setMultiImages([]);
      setActivityToggleTwo(false);
      fatchServiceData();
      toast.success("Service Update successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitLoading(false);
    }
  };
  // ------------------------------------------

  const columns = [
    {
      title: "SID",
      dataIndex: "",
      render: (text, record) => (
        <ul>
          <li>
            <Link to="#" className="table-avatar ">
              <Link to="#" className="profile-split d-flex flex-column">
                ID : {record?.id}
              </Link>
            </Link>
          </li>
          <li>
            <strong>HSN :</strong> {record?.serviceHSNcode}
          </li>
        </ul>
      ),
    },

    {
      title: "Services Info",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <strong>{record?.serviceName}</strong>
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Category",
      dataIndex: "phone",
      render: (text, record) => (
        <ul>
          <li>{record?.productServiceCategory?.name}</li>
          <li>{record?.productServiceSubCategory?.name}</li>
          <li>{record?.productServiceSubSubCategory?.name}</li>
        </ul>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Service Pic",
      dataIndex: "email",
      render: (text, record) => (
        <div className="product-img">
          <div className="product-img-box">
            <img
              src={record?.serviceImage}
              alt=""
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Service Type",
      dataIndex: "tags",
      render: (text, record) => (
        <ul>
          <li>
            <strong>{record?.serviceType}</strong>
          </li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },

    {
      title: "Pricing",
      dataIndex: "tags",
      render: (text, record) => (
        <ul>
          <li>
            <strong>Rate :</strong> {record?.serviceRate}
          </li>
          <li>
            <strong>Discount :</strong> {record?.discountPercentage}
          </li>
          <li>
            <strong>Discount Value :</strong> {record?.discountValue}
          </li>
          <li>
            <strong>Final :</strong> {record?.finalPrice}
          </li>
          {/* <li>
            <strong>Final :</strong> {record?.priceAfterDiscount}
          </li> */}
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "OEM / Brand",
      dataIndex: "location",
      render: (text, record) => (
        <ul>
          <li>{record?.productOEM?.name}</li>
          <li>{record?.productBrand?.name}</li>
        </ul>
      ),
      // sorter: (a, b) => a.location.length - b.location.length,
    },

    {
      title: "Action",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link
              to="#"
              onClick={() => {
                setLeadPreview((prev) => !prev);
                setLeadDetails((prev) => ({ ...record }));
              }}
            >
              <i className=" ti ti-eye me-2"></i>
            </Link>
          </li>
          <li>
            <Link
              className=""
              to="#"
              onClick={() => handleEditClick(record.id)}
            >
              <i className="ti ti-edit me-2" />
            </Link>
          </li>
          <li>
            <Link
              className=""
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
              onClick={() => setServiceDetails(record)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Service"
            >
              <i className="ti ti-trash text-danger me-2" />
            </Link>
          </li>
          <li>
            <div className="status-toggle">
              <input type="checkbox" id="disable" className="check" />
              <label htmlFor="disable" className="checktoggle" />
            </div>
          </li>
          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
    {
      title: "Purchase",
      render: (text, record, index) => (
        <div className="submit-button text-end">
          <Link to="#" className="btn btn-light sidebar-close2">
            Create Purchase
          </Link>
        </div>
      ),
    },
    {
      title: "Sale",
      render: (text, record, index) => (
        <div className="submit-button text-end">
          <Link to="#" className="btn btn-light sidebar-close2">
            Create Sale
          </Link>
        </div>
      ),
    },
  ];

  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"),
    timePicker: false,
  };

  // Gst Options
  const gstOptions = [
    { value: 5, label: "5%" },
    { value: 12, label: "12%" },
    { value: 18, label: "18%" },
    { value: 28, label: "28%" },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-4">
                    <h4 className="page-title">
                      Services<span className="count-title">123</span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div
                        className="col-md-5 col-sm-4"
                        style={{ width: "20%" }}
                      >
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Services"
                          />
                        </div>
                      </div>
                      <div
                        className="col-md-7 col-sm-8"
                        style={{ width: "80%" }}
                      >
                        <div className="export-list text-sm-end">
                          <ul>
                            <li>
                              <div className=" icon-form">
                                <span className="form-icon">
                                  <i className="ti ti-calendar" />
                                </span>
                                <DateRangePicker
                                  initialSettings={initialSettings}
                                >
                                  <input
                                    className="form-control bookingrange"
                                    type="text"
                                  />
                                </DateRangePicker>
                              </div>
                            </li>

                            <li>
                              <div className="manage-dropdwon">
                                <Link
                                  to="#"
                                  className="btn btn-purple-light"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="false"
                                >
                                  <i className="ti ti-columns-3" />
                                  {/* Manage Columns */}
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-md-end">
                                  <h4>Want to manage datatables?</h4>
                                  <p>
                                    Please drag and drop your column to reorder
                                    your table and enable see option as you
                                    want.
                                  </p>
                                  <ul>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Name
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-name"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-name"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Phone
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-phone"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-phone"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Email
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-email"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-email"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Location
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-tag"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-tag"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Created Date
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-loc"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-loc"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Last Activity
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-rate"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-rate"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Status
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-owner"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-owner"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Action
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-contact"
                                          className="check"
                                          defaultChecked={true}
                                        />
                                        <label
                                          htmlFor="col-contact"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>

                            <li>
                              <div className="export-dropdwon ">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="ti ti-package-export" />
                                  {/* Export */}
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-pdf text-danger" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-xls text-green" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="form-sorts dropdown">
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="false"
                                >
                                  <i className="ti ti-filter-share" />
                                  {/* Filter */}
                                </Link>
                                <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end">
                                  <div className="filter-set-view">
                                    <div className="filter-set-head">
                                      <h4>
                                        <i className="ti ti-filter-share" />
                                        Filter
                                      </h4>
                                    </div>

                                    <div
                                      className="accordion"
                                      id="accordionExample"
                                    >
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="true"
                                            aria-controls="collapseTwo"
                                          >
                                            Country
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse show"
                                          id="collapseTwo"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                              <span className="form-icon">
                                                <i className="ti ti-search" />
                                              </span>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search Country"
                                              />
                                            </div>
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>India</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>USA</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>France</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>United Kingdom</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>UAE</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Italy</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Japan</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Germany</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#owner"
                                            aria-expanded="false"
                                            aria-controls="owner"
                                          >
                                            Owner
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="owner"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                              <span className="form-icon">
                                                <i className="ti ti-search" />
                                              </span>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search Owner"
                                              />
                                            </div>
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Hendry</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Guillory</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Jami</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Theresa</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Espinosa</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#Status"
                                            aria-expanded="false"
                                            aria-controls="Status"
                                          >
                                            Status
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="Status"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Active</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Inactive</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                          >
                                            Rating
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="collapseOne"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <span>5.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <span>4.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>3.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>2.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>1.0</span>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree"
                                            aria-expanded="false"
                                            aria-controls="collapseThree"
                                          >
                                            Tags
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="collapseThree"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Promotion</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Rated</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Rejected</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Collab</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Calls</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="filter-reset-btns">
                                      <div className="row">
                                        <div className="col-6">
                                          <Link
                                            to="#"
                                            className="btn btn-light"
                                          >
                                            Reset
                                          </Link>
                                        </div>
                                        <div className="col-6">
                                          <Link
                                            to={route.contactList}
                                            className="btn btn-primary"
                                          >
                                            Filter
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggle(!activityToggle)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add Services
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}

                  {/* Contact List */}
                  <div className="table-responsive custom-table">
                    <DataTable columns={columns} dataSource={serviceData} disableSelection={true}/>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                  {/* /Contact List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add service */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "60%" }}>
          <div className="sidebar-header">
            <h4>Add New Service</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(!activityToggle)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form onSubmit={handleSubmit} className="toggle-height">
              <div className="pro-create">
                <div className="accordion-lists" id="list-accor">
                  {/* Basic Info */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#basic"
                      style={{ backgroundColor: "#f4f9f1" }}
                    >
                      <span>
                        <i className="ti ti-user-plus" />
                      </span>
                      Category
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="basic"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Select Category{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Select
                                className="select"
                                options={categoryOptions}
                                placeholder="Choose"
                                classNamePrefix="react-select"
                                value={
                                  categoryOptions.find(
                                    (o) =>
                                      o.value ===
                                      formData.productServiceCategoryId
                                  ) || null
                                }
                                onChange={(opt) =>
                                  handleSelectChange2(
                                    "productServiceCategoryId",
                                    opt
                                  )
                                }
                              />
                            </div>
                          </div>
                          {subCategoryOptions.length > 0 && (
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Select Sub Category{" "}
                                </label>
                                <Select
                                  className="select"
                                  options={subCategoryOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={
                                    subCategoryOptions.find(
                                      (o) =>
                                        o.value ===
                                        formData.productServiceSubCategoryId
                                    ) || null
                                  }
                                  onChange={(opt) =>
                                    handleSelectChange2(
                                      "productServiceSubCategoryId",
                                      opt
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                          {subSubCategoryOptions.length > 0 && (
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Select Sub Sub Category{" "}
                                </label>
                                <Select
                                  className="select"
                                  options={subSubCategoryOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={
                                    subSubCategoryOptions.find(
                                      (o) =>
                                        o.value ===
                                        formData.productServiceSubSubCategoryId
                                    ) || null
                                  }
                                  onChange={(opt) =>
                                    handleSelectChange2(
                                      "productServiceSubSubCategoryId",
                                      opt
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}
                  {/* Address Info */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#address"
                    >
                      <span>
                        <i className="ti ti-photo" />
                      </span>
                      Details
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="address"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Service Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="serviceName"
                                value={formData.serviceName}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Service Brand / Partner{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <Select
                                className="select"
                                options={productBrandOptions}
                                placeholder="Choose"
                                classNamePrefix="react-select"
                                value={
                                  productBrandOptions.find(
                                    (o) => o.value === formData.productBrandId
                                  ) || null
                                }
                                onChange={(opt) =>
                                  handleSelectChange("productBrand", opt)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Product HSN Code
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="serviceHSNcode"
                                value={formData.serviceHSNcode}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#access"
                    >
                      <span>
                        <i className="ti ti-wallet" />
                      </span>
                      Price
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="access"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="radio-wrap form-wrap">
                              <label className="col-form-label">Type</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="public"
                                    name="serviceType"
                                    value="Hourly"
                                    checked={formData.serviceType === "Hourly"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="public">Hourly</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="private"
                                    name="serviceType"
                                    value="Weekly"
                                    checked={formData.serviceType === "Weekly"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="private">Weekly</label>
                                </div>
                                <div
                                  className="radio-btn"
                                  data-bs-toggle="modal"
                                  data-bs-target="#access_view"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="people"
                                    name="serviceType"
                                    value="Monthly"
                                    checked={formData.serviceType === "Monthly"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="people">Monthly</label>
                                </div>
                                <div
                                  className="radio-btn"
                                  data-bs-toggle="modal"
                                  data-bs-target="#access_view"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="onetime"
                                    name="serviceType"
                                    value="Onetime"
                                    checked={formData.serviceType === "Onetime"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="onetime">Onetime</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Service Rate
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="serviceRate"
                                value={formData.serviceRate}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                  if (
                                    ["e", "E", "+", "-", "."].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Discount (%)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                  if (
                                    ["e", "E", "+", "-", "."].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Discount Value
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleInputChange}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Total Rate
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="finalPrice"
                                value={formData.finalPrice}
                                onChange={handleInputChange}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">GST (%)</label>
                              <Select
                                options={gstOptions}
                                placeholder="Select"
                                name="gstPercentage"
                                value={gstOptions.find((opt) => opt.value === formData.gstPercentage) || null}
                                onChange={handleGstChange}
                                
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                GST Value
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="gstValue"
                                value={formData.gstValue}
                                onChange={handleInputChange}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Final Rate
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="priceAfterDiscount"
                                value={formData.priceAfterDiscount}
                                onChange={handleInputChange}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#description"
                    >
                      <span>
                        <i className="ti ti-user" />
                      </span>
                      Description
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="description"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "300px" }}>
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Description
                              </label>
                              <ReactQuill
                                theme="snow"
                                style={{ height: "230px" }}
                                name="description"
                                value={formData.description}
                                onChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    description: value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#photos"
                    >
                      <span>
                        <i className="ti ti-camera" />
                      </span>
                      Photos
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="photos"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Upload Main Photo
                              </label>
                              <div className="profile-upload">
                                <div className="profile-upload-img">
                                  {!image && (
                                    <span>
                                      <i className="ti ti-photo" />
                                    </span>
                                  )}

                                  {image && (
                                    <img
                                      src={image}
                                      alt="Preview"
                                      style={{
                                        borderRadius: "5px",
                                        width: "110px",
                                        height: "110px",
                                        maxWidth: "101px",
                                      }}
                                    />
                                  )}

                                  <button
                                    type="button"
                                    className="profile-remove"
                                    onClick={() => setImage(null)}
                                  >
                                    <i className="ti ti-x" />
                                  </button>
                                </div>

                                <div className="profile-upload-content">
                                  <label className="profile-upload-btn">
                                    <i className="ti ti-file-broken" /> Upload
                                    File
                                    <input
                                      type="file"
                                      className="input-img"
                                      onChange={handleMainImageChange}
                                      accept="image/*"
                                      ref={fileInputRef}
                                    />
                                  </label>
                                  {/* <p>JPG, GIF or PNG. Max size of 800K</p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Upload More Photos (upto 10)
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*"
                                disabled={multiImages.length >= 10}
                                onChange={handleMultipleImagesChange}
                                ref={multiImageRef}
                              />

                              {/* Display Image Previews */}
                              {/* <div className="image-preview mt-2">
                                {multiImages.map((img, index) => (
                                  <img
                                    key={index}
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    style={{ width: "100px", margin: "5px" }}
                                  />
                                ))}
                              </div> */}
                              <div className="image-preview mt-2 d-flex flex-wrap">
                                {multiImages.map((img, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      position: "relative",
                                      margin: "5px",
                                    }}
                                  >
                                    <img
                                      src={URL.createObjectURL(img)}
                                      alt="preview"
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      style={{
                                        position: "absolute",
                                        top: "-8px",
                                        right: "-8px",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                      }}
                                      title="Remove"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-button text-end">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={() => setActivityToggle(!activityToggle)}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Create
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Company */}
      {/* Edit service */}
      <div
        className={
          activityToggleTwo ? "toggle-popup1 sidebar-popup" : "toggle-popup1"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "60%" }}>
          <div className="sidebar-header">
            <h4>Edit Service</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggleTwo(!activityToggleTwo)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form onSubmit={handleUpdate} className="toggle-height">
              <div className="pro-create">
                <div className="accordion-lists" id="list-accor">
                  {/* Basic Info */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#basic"
                      style={{ backgroundColor: "#f4f9f1" }}
                    >
                      <span>
                        <i className="ti ti-user-plus" />
                      </span>
                      Category
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="basic"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Select Category{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Select
                                className="select"
                                options={categoryOptions}
                                placeholder="Choose"
                                classNamePrefix="react-select"
                                value={categoryOptions.find(
                                  (o) =>
                                    o.value ===
                                    formData.productServiceCategoryId
                                )}
                                onChange={(opt) =>
                                  handleSelectChange2(
                                    "productServiceCategoryId",
                                    opt
                                  )
                                }
                              />
                            </div>
                          </div>
                          {subCategoryOptions.length > 0 && (
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Select Sub Category{" "}
                                </label>
                                <Select
                                  className="select"
                                  options={subCategoryOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={subCategoryOptions.find(
                                    (o) =>
                                      o.value ===
                                      formData.productServiceSubCategoryId
                                  )}
                                  onChange={(opt) =>
                                    handleSelectChange2(
                                      "productServiceSubCategoryId",
                                      opt
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                          {subSubCategoryOptions.length > 0 && (
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Select Sub Sub Category{" "}
                                </label>
                                <Select
                                  className="select"
                                  options={subSubCategoryOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={subSubCategoryOptions.find(
                                    (o) =>
                                      o.value ===
                                      formData.productServiceSubSubCategoryId
                                  )}
                                  onChange={(opt) =>
                                    handleSelectChange2(
                                      "productServiceSubSubCategoryId",
                                      opt
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}
                  {/* Address Info */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#address"
                    >
                      <span>
                        <i className="ti ti-photo" />
                      </span>
                      Details
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="address"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Service Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="serviceName"
                                value={formData.serviceName}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Product OEM{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <Select
                                className="select"
                                options={productOEMOptions}
                                placeholder="Choose"
                                classNamePrefix="react-select"
                                value={productOEMOptions.find(
                                  (o) => o.value === formData.productOEMId
                                )}
                                onChange={(opt) =>
                                  handleSelectChange("productOEMId", opt)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Product Brand{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <Select
                                className="select"
                                options={productBrandOptions}
                                placeholder="Choose"
                                classNamePrefix="react-select"
                                value={productBrandOptions.find(
                                  (o) => o.value === formData.productBrandId
                                )}
                                onChange={(opt) =>
                                  handleSelectChange("productBrand", opt)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Product HSN Code
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="serviceHSNcode"
                                value={formData.serviceHSNcode}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#access"
                    >
                      <span>
                        <i className="ti ti-wallet" />
                      </span>
                      Price
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="access"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="radio-wrap form-wrap">
                              <label className="col-form-label">Type</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="public"
                                    name="serviceType"
                                    value="Hourly"
                                    checked={formData.serviceType === "Hourly"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="public">Hourly</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="private"
                                    name="serviceType"
                                    value="Weekly"
                                    checked={formData.serviceType === "Weekly"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="private">Weekly</label>
                                </div>
                                <div
                                  className="radio-btn"
                                  data-bs-toggle="modal"
                                  data-bs-target="#access_view"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="people"
                                    name="serviceType"
                                    value="Monthly"
                                    checked={formData.serviceType === "Monthly"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="people">Monthly</label>
                                </div>
                                <div
                                  className="radio-btn"
                                  data-bs-toggle="modal"
                                  data-bs-target="#access_view"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="onetime"
                                    name="serviceType"
                                    value="Onetime"
                                    checked={formData.serviceType === "Onetime"}
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="onetime">Onetime</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Service Rate
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="serviceRate"
                                value={formData.serviceRate}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Discount (%)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Discount Value
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">FInal</label>
                              <input
                                type="number"
                                className="form-control"
                                name="finalPrice"
                                value={formData.finalPrice}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#description"
                    >
                      <span>
                        <i className="ti ti-user" />
                      </span>
                      Description
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="description"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "300px" }}>
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Description
                              </label>
                              <ReactQuill
                                theme="snow"
                                style={{ height: "230px" }}
                                name="description"
                                value={formData.description}
                                onChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    description: value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#photos"
                    >
                      <span>
                        <i className="ti ti-camera" />
                      </span>
                      Photos
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="photos"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Upload Main Photo
                              </label>
                              <div className="profile-upload">
                                <div className="profile-upload-img">
                                  {!image && (
                                    <span>
                                      <i className="ti ti-photo" />
                                    </span>
                                  )}

                                  {image && (
                                    <img
                                      src={image}
                                      alt="Preview"
                                      style={{
                                        borderRadius: "5px",
                                        width: "110px",
                                        height: "110px",
                                        maxWidth: "101px",
                                      }}
                                    />
                                  )}

                                  <button
                                    type="button"
                                    className="profile-remove"
                                    onClick={() => setImage(null)}
                                  >
                                    <i className="ti ti-x" />
                                  </button>
                                </div>

                                <div className="profile-upload-content">
                                  <label className="profile-upload-btn">
                                    <i className="ti ti-file-broken" /> Upload
                                    File
                                    <input
                                      type="file"
                                      className="input-img"
                                      onChange={handleMainImageChange}
                                      accept="image/*"
                                    />
                                  </label>
                                  <p>JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Upload More Photos (upto 10)
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*"
                                // disabled={multiImages.length >= 10}
                                onChange={handleMultipleImagesChange}
                              />

                              {/* Display Image Previews */}
                              <div className="image-preview mt-2">
                                {multiImages.map((img, index) => (
                                  <img
                                    key={index}
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    style={{ width: "100px", margin: "5px" }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-button text-end">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={() => setActivityToggleTwo(!activityToggleTwo)}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Update
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit service */}
      {/* Delete service */}
      <div
        className="modal custom-modal fade"
        id="delete_contact"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered justify-content-center">
          <div className="modal-content" style={{ width: "80%" }}>
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
                <h3>Are You Sure Remove Service?</h3>
                {/* <p className="del-info">
                  Company ”NovaWaveLLC” from your Account.
                </p> */}
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    // to={route.companies}
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={handleDelete}
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete service */}
    </>
  );
};

export default Services;
