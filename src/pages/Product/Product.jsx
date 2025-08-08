import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import { Link, useParams } from "react-router-dom";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { all_routes } from "../Router/all_routes";
import Select from "react-select";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../components/Table/DataTable";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const Product = () => {
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [addTogglePopupTwo, setAddTogglePopupTwo] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [multiImages, setMultiImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);
  const [productBrandOptions, setProductBrandOptions] = useState([]);
  const [productOEMOptions, setProductOEMOptions] = useState([]);
  const [productData, setProductData] = useState([]);
  const [count, setCount] = useState(0);
  const [productDetails, setProductDetails] = useState({});
  const [currentEditId, setCurrentEditId] = useState(null);

  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };
  // const [selectedDate1, setSelectedDate1] = useState(new Date());
  // const handleDateChange1 = (date) => {
  //   setSelectedDate1(date);
  // };
  const { id } = useParams();

  const route = all_routes;
  const [leadPreview, setLeadPreview] = useState(false);
  const [leadDetails, setLeadDetails] = useState({});
  const togglePopupTwo = () => {
    togglePopup((prev) => !prev);
  };
  const columns = [
    {
      title: "PID",
      dataIndex: "",
      render: (text, record) => (
        <ul>
          <li>
            <Link
              to="#"
              // className="table-avatar d-flex align-items-center"
              className="table-avatar "
            >
              <Link to="#" className="profile-split d-flex flex-column">
                ID : {record?.id}
              </Link>
            </Link>
          </li>

          <li>
            <strong>SKU :</strong> {record?.productSKU}
          </li>
          <li>
            <strong>Barcode :</strong> {record?.productBarcode}
          </li>
          <li>
            <strong>HSN :</strong> {record?.productHSNcode}
          </li>
        </ul>
      ),
    },

    {
      title: "Produduct Info",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <strong>{record?.productName}</strong>
          </li>
          <li>
            <strong>Size :</strong> {record?.productSize}
          </li>
          <li>
            <strong>Color/Variant :</strong> {record?.productColor}
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
          <li>{record?.productCategory?.name}</li>
          <li>{record?.productSubCategory?.name}</li>
          <li>{record?.productSubSubCategory?.name}</li>
        </ul>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Product Pic",
      dataIndex: "email",
      render: (text, record) => (
        <div className="product-img">
          <div className="product-img-box">
            <img
              src={record?.productImage}
              alt=""
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
          </div>
        </div>
      ),
      // sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Unit Economics",
      dataIndex: "tags",
      render: (text, record) => (
        <ul>
          <li>
            <strong>Purchase Cost :</strong> {record?.sellprice}
          </li>
          <li>
            <strong>Margin :</strong> {record?.productMarginPercentage}% (
            {record?.productMarginValue})
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
            <strong>MRP :</strong> {record?.productMRP}
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
      title: "Stock",
      dataIndex: "rating",
      render: (text, record) => (
        <ul>
          <li>
            <strong>Warehouse :</strong> {record?.wareHouseLocation}
          </li>
          <li>
            <strong>Stock :</strong> {record?.productQuantity}
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.rating.length - b.rating.length,
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
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Edit Product"
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
              onClick={() => setProductDetails(record)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Product"
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
          <Link to="#" className="btn btn-light sidebar-close2 ">
            <i className="ti ti-square-rounded-plus me-1" />
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
            <i className="ti ti-square-rounded-plus me-1" />
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
    startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
    timePicker: false,
  };

  // main photo
  const fileInputRef = useRef(null);

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);

      // Reset input so same file can be selected again
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

  // Category
  const fatchCategory = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/productCategoryList`,
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
        `${apiUrl}/product/productSubCategoryList-by-productcategory/${categoryId}`,
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
        `${apiUrl}/product/productSubSubCategoryList-by-productSubCategory/${subCategoryId}`,
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
    setFormData((prev) => ({
      ...prev,
      [field]: option ? option.value : 0,
    }));

    if (field === "productCategoryId") {
      setFormData((prev) => ({
        ...prev,
        productSubCategoryId: null,
        productSubSubCategoryId: null,
      }));
      fetchSubCategories(option?.value);
    }

    if (field === "productSubCategoryId") {
      setFormData((prev) => ({
        ...prev,
        productSubSubCategoryId: null,
      }));
      fetchSubSubCategories(option?.value);
    }
  };

  const handleGstChange = (selectedOption) => {
    const gstPercentage = selectedOption.value;
    const finalPrice = parseFloat(formData.finalPrice) || 0;
    const gstValue = Math.round((finalPrice * parseFloat(gstPercentage)) / 100);
    const priceAfterDiscount = finalPrice + gstValue;

    setFormData((prev) => ({
      ...prev,
      gstPercentage,
      gstValue: gstValue.toString(),
      priceAfterDiscount: priceAfterDiscount.toString(),
    }));
  };

  // Add new product POST API
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    const pgChargesPercent = parseFloat(updated.pgCharges) || 0;
    const purchasePrice = parseFloat(updated.purchasePrice) || 0;
    const adminCharges = parseFloat(updated.adminCharges) || 0;
    const marketingCost = parseFloat(updated.marketingCost) || 0;
    const shippingCost = parseFloat(updated.shippingCost) || 0;
    const packagingCost = parseFloat(updated.packagingCost) || 0;
    const otherCost = parseFloat(updated.otherCost) || 0;
    const productCost = parseFloat(updated.productCost) || 0;
    const productMarginPercentage =
      parseFloat(updated.productMarginPercentage) || 0;
    const discountPercent = parseFloat(updated.discountPercentage) || 0;

    const pgValue = Math.round((purchasePrice * pgChargesPercent) / 100);
    updated.pgValue = pgValue.toString();

    const sellprice = Math.round(
      purchasePrice +
        pgValue +
        adminCharges +
        marketingCost +
        shippingCost +
        packagingCost +
        otherCost +
        productCost
    );
    updated.sellprice = sellprice.toString();

    const marginValue = Math.round((sellprice * productMarginPercentage) / 100);
    updated.productMarginValue = marginValue.toString();

    const productMRP = Math.round(sellprice + marginValue);
    updated.productMRP = productMRP.toString();

    const discountValue = Math.round((productMRP * discountPercent) / 100);
    updated.discountValue = discountValue.toString();

    const finalPrice = Math.round(productMRP - discountValue);
    updated.finalPrice = finalPrice.toString();

    // GST logic
    const gstPercent = parseFloat(updated.gstPercentage) || 0;
    const gstValue = Math.round((finalPrice * gstPercent) / 100);
    updated.gstValue = gstValue.toString();

    const priceAfterDiscount = finalPrice + gstValue;
    updated.priceAfterDiscount = priceAfterDiscount.toString();

    setFormData(updated);
  };

  const initialForm = {
    productCategoryId: null,
    productSubCategoryId: null,
    productSubSubCategoryId: null,
    productName: "",
    productOEMId: null,
    productBrandId: null,
    productSKU: "",
    productBarcode: "",
    productHSNcode: "",
    productSize: "",
    productColor: "",
    productWeight: "",
    lengthBreadthHeight: "",
    wareHouseLocation: "",
    productQuantity: "",
    purchasePrice: "",
    pgCharges: "",
    pgValue: "",
    adminCharges: "",
    marketingCost: "",
    shippingCost: "",
    packagingCost: "",
    otherCost: "",
    productCost: "",
    sellprice: "",
    productMarginPercentage: "",
    productMarginValue: "",
    productMRP: "",
    discountPercentage: "",
    discountValue: "",
    finalPrice: "",
    gstPercentage: "",
    gstValue: "",
    priceAfterDiscount: "",
    description: "",
    productImage: "",
    productImages: [],
  };

  const [formData, setFormData] = useState(initialForm);

  // Product Post
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

    // Main form fields
    const allowedKeys = [
      "productCategoryId",
      "productSubCategoryId",
      "productName",
      "productSKU",
      "productBarcode",
      "productHSNcode",
      "productSize",
      "productColor",
      "productWeight",
      "lengthBreadthHeight",
      "wareHouseLocation",
      "productQuantity",
      "purchasePrice",
      "pgCharges",
      "pgValue",
      "adminCharges",
      "marketingCost",
      "shippingCost",
      "packagingCost",
      "otherCost",
      "productCost",
      "sellprice",
      "productMarginPercentage",
      "productMarginValue",
      "productMRP",
      "discountPercentage",
      "discountValue",
      "finalPrice",
      "gstPercentage",
      "gstValue",
      "priceAfterDiscount",
      "description",
    ];

    // Fields that should be numbers
    const numericKeys = [
      "productCategoryId",
      "productSubCategoryId",
      "productSubSubCategoryId",
      "productBrandId",
      "productOEMId",
      "productQuantity",
      "purchasePrice",
      "pgCharges",
      "pgValue",
      "adminCharges",
      "marketingCost",
      "shippingCost",
      "packagingCost",
      "otherCost",
      "productCost",
      "sellprice",
      "productMarginPercentage",
      "productMarginValue",
      "productMRP",
      "discountPercentage",
      "discountValue",
      "finalPrice",
      "gstPercentage",
      "gstValue",
      "priceAfterDiscount",
    ];

    // Append all allowed fields
    allowedKeys.forEach((key) => {
      appendIfValid(key, formData[key], numericKeys.includes(key));
    });

    // Conditionally append optional foreign keys
    appendIfValid(
      "productSubSubCategoryId",
      formData.productSubSubCategoryId,
      true
    );
    appendIfValid("productBrandId", formData.productBrandId, true);
    appendIfValid("productOEMId", formData.productOEMId, true);

    // Add images
    if (imageFile) form.append("productImage", imageFile);
    multiImages.forEach((file) => {
      form.append("productImages", file);
    });

    try {
      const res = await axios.post(`${apiUrl}/product/add-product`, form, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      setFormData({ ...initialForm });
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
      fatchProductData();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Product Get
  const fatchProductData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product/product-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });
      setProductData(response.data.data);
      setCount(response.data.totalCount);
    } catch (error) {
      setError(error.message);
    }
  };

  // Product delete
  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/product/delete-product/${productDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setProductDetails({});
      fatchProductData();
      toast.success("Product deleted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fatchCategory();
    fatchProductData();
    fatchProductBrand();
    fatchProductOEM();
  }, []);

  // // product Edit
  const handleEditClick = async (productId) => {
    setActivityToggleTwo(true);
    try {
      const res = await axios.get(`${apiUrl}/product/product/${productId}`, {
        headers: { Authorization: `Bearer ${Token}` },
      });

      const data = res.data.data;
      setCurrentEditId(productId);
      setFormData({
        ...initialForm,
        ...data, // prefill form
      });
    } catch (err) {
      toast.error("Failed to load product");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const form = new FormData();

    const allowedKeys = [
      "productCategoryId",
      "productSubCategoryId",
      "productName",
      "productSKU",
      "productBarcode",
      "productHSNcode",
      "productSize",
      "productColor",
      "productWeight",
      "lengthBreadthHeight",
      "wareHouseLocation",
      "productQuantity",
      "purchasePrice",
      "pgCharges",
      "pgValue",
      "adminCharges",
      "marketingCost",
      "shippingCost",
      "packagingCost",
      "otherCost",
      "productCost",
      "sellprice",
      "productMarginPercentage",
      "productMarginValue",
      "productMRP",
      "discountPercentage",
      "discountValue",
      "finalPrice",
      "description",
      "productBrandId",
      "productOEMId",
    ];

    allowedKeys.forEach((key) => {
      form.append(key, formData[key] ?? "");
    });

    if (
      subSubCategoryOptions.length > 0 &&
      formData.productSubSubCategoryId !== null &&
      formData.productSubSubCategoryId !== undefined &&
      formData.productSubSubCategoryId !== ""
    ) {
      form.append("productSubSubCategoryId", formData.productSubSubCategoryId);
    }

    // Add image(s)
    if (imageFile) form.append("productImage", imageFile);
    multiImages.forEach((file) => {
      form.append("productImages", file);
    });

    try {
      const res = await axios.put(
        `${apiUrl}/product/update-product/${formData.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setActivityToggleTwo(false);
      setFormData(initialForm);
      setImageFile(null);
      setMultiImages([]);
      fatchProductData();
      toast.success("Product edit successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitLoading(false);
    }
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
                      Product<span className="count-title">{count}</span>
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

              {/* /Campaign Status */}

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
                            placeholder="Search Product"
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
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file text-primary" />
                                        Import Inventory
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
                                onClick={() => {
                                  setFormData(initialForm);
                                  setImageFile(null);
                                  setMultiImages([]);
                                  setCurrentEditId(null);
                                  setActivityToggle(true);
                                }}
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add Product
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
                    <DataTable
                      columns={columns}
                      dataSource={productData}
                      disableSelection={true}
                    />
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
      {/* Add Product */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "60%" }}>
          <div className="sidebar-header">
            <h4>Add New Product</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn "
              onClick={() => setActivityToggle(!activityToggle)}
              style={{ background: "red", color: "white" }}
            >
              <i className="ti ti-x " />
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
                      Product Details
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="basic"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="form-wrap mt-2">
                              <p>
                                Select Category :{" "}
                                <span className="text-danger">*</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <Select
                                  className="select"
                                  options={categoryOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={
                                    categoryOptions.find(
                                      (o) =>
                                        o.value === formData.productCategoryId
                                    ) || null
                                  }
                                  onChange={(opt) =>
                                    handleSelectChange2(
                                      "productCategoryId",
                                      opt
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {subCategoryOptions.length > 0 && (
                          <div className="row" style={{ height: "50px" }}>
                            <div className="col-md-6">
                              <div className="setting-title mt-2">
                                <p>Select Sub Category :</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <div className="">
                                  <Select
                                    className="select"
                                    options={subCategoryOptions}
                                    placeholder="Choose"
                                    classNamePrefix="react-select"
                                    value={
                                      subCategoryOptions.find(
                                        (o) =>
                                          o.value ===
                                          formData.productSubCategoryId
                                      ) || null
                                    }
                                    onChange={(opt) =>
                                      handleSelectChange2(
                                        "productSubCategoryId",
                                        opt
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {subSubCategoryOptions.length > 0 && (
                          <div className="row" style={{ height: "50px" }}>
                            <div className="col-md-6">
                              <div className="setting-title mt-2">
                                <p>Select Sub Sub Category :</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <div className="">
                                  <Select
                                    className="select"
                                    options={subSubCategoryOptions}
                                    placeholder="Choose"
                                    classNamePrefix="react-select"
                                    value={
                                      subSubCategoryOptions.find(
                                        (o) =>
                                          o.value ===
                                          formData.productSubSubCategoryId
                                      ) || null
                                    }
                                    onChange={(opt) =>
                                      handleSelectChange2(
                                        "productSubSubCategoryId",
                                        opt
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>
                                Product Name :{" "}
                                <span className="text-danger">*</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productName"
                                  value={formData.productName}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product OEM :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <Select
                                  className="select"
                                  options={productOEMOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={
                                    productOEMOptions.find(
                                      (o) => o.value === formData.productOEMId
                                    ) || null
                                  }
                                  onChange={(opt) =>
                                    handleSelectChange("productOEMId", opt)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Brand :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product SKU :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productSKU"
                                  value={formData.productSKU}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Barcode :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productBarcode"
                                  value={formData.productBarcode}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product HSN Code :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productHSNcode"
                                  value={formData.productHSNcode}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Size :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productSize"
                                  value={formData.productSize}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Color/Variant :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productColor"
                                  value={formData.productColor}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Weight (k.g.):</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productWeight"
                                  value={formData.productWeight}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>LxBxH :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="lengthBreadthHeight"
                                  value={formData.lengthBreadthHeight}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Warehouse :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <Select
                                  className="select"
                                  options={[
                                    {
                                      value: "GREENESCAPES-ALIGARH",
                                      label: "GREENESCAPES-ALIGARH",
                                    },
                                    {
                                      value: "NOIDA SEC 137",
                                      label: "NOIDA SEC 137",
                                    },
                                  ]}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={
                                    [
                                      {
                                        value: "GREENESCAPES-ALIGARH",
                                        label: "GREENESCAPES-ALIGARH",
                                      },
                                      {
                                        value: "NOIDA SEC 137",
                                        label: "NOIDA SEC 137",
                                      },
                                    ].find(
                                      (opt) =>
                                        opt.value === formData.wareHouseLocation
                                    ) || null
                                  }
                                  onChange={(selectedOption) =>
                                    handleSelectChange(
                                      "wareHouseLocation",
                                      selectedOption
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Quantity / Stock :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control"
                                  name="productQuantity"
                                  value={formData.productQuantity}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}
                  {/* Address Info */}

                  {/* Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#access"
                      style={{ backgroundColor: "#f4f9f1" }}
                    >
                      <span>
                        <i className="ti ti-wallet" />
                      </span>
                      Purchase Cost
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="access"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Purchase Price :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="purchasePrice"
                                  value={formData.purchasePrice}
                                  onChange={handleInputChange}
                                  onWheel={(e) => e.target.blur()}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>PG Charges (%) :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="pgCharges"
                                  value={formData.pgCharges}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>PG Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  disabled
                                  name="pgValue"
                                  value={formData.pgValue}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Admin Charges :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="adminCharges"
                                  value={formData.adminCharges}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Marketing Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="marketingCost"
                                  value={formData.marketingCost}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Shipping Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="shippingCost"
                                  value={formData.shippingCost}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Packaging Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="packagingCost"
                                  value={formData.packagingCost}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Others Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="otherCost"
                                  value={formData.otherCost}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productCost"
                                  value={formData.productCost}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Sell Price :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="sellprice"
                                  value={formData.sellprice}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Margin (%) :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productMarginPercentage"
                                  value={formData.productMarginPercentage}
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Margin Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productMarginValue"
                                  value={formData.productMarginValue}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap "
                      style={{ backgroundColor: "#f4f9f1" }}
                    >
                      <span>
                        <i className="ti ti-photo" />
                      </span>
                      Selling Price
                    </Link>
                    <div className="accordion-collapse collapse show">
                      <div className="content-collapse">
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>MRP :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productMRP"
                                  value={formData.productMRP}
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Discount (%) :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Discount Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap text-end">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="discountValue"
                                  value={formData.discountValue}
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Total Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="finalPrice"
                                  value={formData.finalPrice}
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>GST :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <Select
                                  options={gstOptions}
                                  placeholder="Select"
                                  name="gstPercentage"
                                  value={
                                    gstOptions.find(
                                      (opt) =>
                                        opt.value === formData.gstPercentage
                                    ) || null
                                  }
                                  onChange={handleGstChange}
                                  styles={{
                                    singleValue: (base) => ({
                                      ...base,
                                      textAlign: "right", // align selected value text
                                      width: "100%",
                                      display: "block",
                                    }),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>GST Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="gstValue"
                                  value={formData.gstValue}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Final Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="priceAfterDiscount"
                                  value={formData.priceAfterDiscount}
                                  readOnly
                                />
                              </div>
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
                      data-bs-target="#description"
                      style={{ backgroundColor: "#f4f9f1" }}
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
                      style={{ backgroundColor: "#f4f9f1" }}
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
                                Upload More Photos (10 Photos)
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
                                {multiImages.map((img, i) => (
                                  <img
                                    key={i}
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    width="80"
                                    className="me-2 mb-2"
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
      {/* /Add Product */}
      {/* Edit Product */}
      <div
        className={
          activityToggleTwo ? "toggle-popup1 sidebar-popup" : "toggle-popup1"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Edit Company</h4>
            <Link
              to="#"
              className="sidebar-close1 toggle-btn"
              onClick={() => setActivityToggleTwo(false)}
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
                      Product Details
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="basic"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="form-wrap mt-2">
                              <p>
                                Select Category :{" "}
                                <span className="text-danger">*</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <Select
                                  className="select"
                                  options={categoryOptions}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={categoryOptions.find(
                                    (o) =>
                                      o.value === formData.productCategoryId
                                  )}
                                  onChange={(opt) =>
                                    handleSelectChange2(
                                      "productCategoryId",
                                      opt
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {subCategoryOptions.length > 0 && (
                          <div className="row" style={{ height: "50px" }}>
                            <div className="col-md-6">
                              <div className="setting-title mt-2">
                                <p>Select Sub Category :</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <div className="">
                                  <Select
                                    className="select"
                                    options={subCategoryOptions}
                                    placeholder="Choose"
                                    classNamePrefix="react-select"
                                    value={subCategoryOptions.find(
                                      (o) =>
                                        o.value ===
                                        formData.productSubCategoryId
                                    )}
                                    onChange={(opt) =>
                                      handleSelectChange2(
                                        "productSubCategoryId",
                                        opt
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {subSubCategoryOptions.length > 0 && (
                          <div className="row" style={{ height: "50px" }}>
                            <div className="col-md-6">
                              <div className="setting-title mt-2">
                                <p>Select Sub Sub Category :</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <div className="">
                                  <Select
                                    className="select"
                                    options={subSubCategoryOptions}
                                    placeholder="Choose"
                                    classNamePrefix="react-select"
                                    value={subSubCategoryOptions.find(
                                      (o) =>
                                        o.value ===
                                        formData.productSubSubCategoryId
                                    )}
                                    onChange={(opt) =>
                                      handleSelectChange2(
                                        "productSubSubCategoryId",
                                        opt
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>
                                Product Name :{" "}
                                <span className="text-danger">*</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productName"
                                  value={formData.productName}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product OEM :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Brand :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
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
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product SKU :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productSKU"
                                  value={formData.productSKU}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Barcode :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productBarcode"
                                  value={formData.productBarcode}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product HSN Code :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productHSNcode"
                                  value={formData.productHSNcode}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Size :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productSize"
                                  value={formData.productSize}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Color/Variant :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productColor"
                                  value={formData.productColor}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Weight (k.g.):</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="productWeight"
                                  value={formData.productWeight}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>LxBxH :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="lengthBreadthHeight"
                                  value={formData.lengthBreadthHeight}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Warehouse :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <Select
                                  className="select"
                                  options={[
                                    {
                                      value: "GREENESCAPES-ALIGARH",
                                      label: "GREENESCAPES-ALIGARH",
                                    },
                                    {
                                      value: "NOIDA SEC 137",
                                      label: "NOIDA SEC 137",
                                    },
                                  ]}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                  value={
                                    [
                                      {
                                        value: "GREENESCAPES-ALIGARH",
                                        label: "GREENESCAPES-ALIGARH",
                                      },
                                      {
                                        value: "NOIDA SEC 137",
                                        label: "NOIDA SEC 137",
                                      },
                                    ].find(
                                      (opt) =>
                                        opt.value === formData.wareHouseLocation
                                    ) || null
                                  }
                                  onChange={(selectedOption) =>
                                    handleSelectChange(
                                      "wareHouseLocation",
                                      selectedOption
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Quantity / Stock :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control"
                                  name="productQuantity"
                                  value={formData.productQuantity}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}
                  {/* Address Info */}

                  {/* Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap"
                      // data-bs-toggle="collapse"
                      // data-bs-target="#access"
                      style={{ backgroundColor: "#f4f9f1" }}
                    >
                      <span>
                        <i className="ti ti-wallet" />
                      </span>
                      Purchase Cost
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="access"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Purchase Price :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="purchasePrice"
                                  value={formData.purchasePrice}
                                  onChange={handleInputChange}
                                  onWheel={(e) => e.target.blur()}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>PG Charges (%) :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="pgCharges"
                                  value={formData.pgCharges}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>PG Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  disabled
                                  name="pgValue"
                                  value={formData.pgValue}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Admin Charges :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="adminCharges"
                                  value={formData.adminCharges}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Marketing Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="marketingCost"
                                  value={formData.marketingCost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Shipping Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="shippingCost"
                                  value={formData.shippingCost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Packaging Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="packagingCost"
                                  value={formData.packagingCost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Others Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="otherCost"
                                  value={formData.otherCost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Product Cost :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productCost"
                                  value={formData.productCost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Sell Price :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="sellprice"
                                  value={formData.sellprice}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Margin (%) :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productMarginPercentage"
                                  value={formData.productMarginPercentage}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Margin Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productMarginValue"
                                  value={formData.productMarginValue}
                                  readOnly
                                />
                              </div>
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
                      className="accordion-wrap "
                      // data-bs-toggle="collapse"
                      // data-bs-target="#address"
                      style={{ backgroundColor: "#f4f9f1" }}
                    >
                      <span>
                        <i className="ti ti-photo" />
                      </span>
                      Selling Price
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      // id="address"
                      // data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>
                                MRP : <span className="text-danger">*</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="productMRP"
                                  value={formData.productMRP}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Discount (%) :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="discountPercentage"
                                  value={formData.discountPercentage}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>Discount Value :</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap text-end">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
                                  name="discountValue"
                                  value={formData.discountValue}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ height: "50px" }}>
                          <div className="col-md-6">
                            <div className="setting-title mt-2">
                              <p>
                                FInal : <span className="text-danger">*</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="">
                                <input
                                  type="number"
                                  className="form-control text-end"
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
                  </div>
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#description"
                      style={{ backgroundColor: "#f4f9f1" }}
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
                                // value={value}
                                // onChange={setValue}
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
                      style={{ backgroundColor: "#f4f9f1" }}
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

                                  {/* <button
                                    type="button"
                                    className="profile-remove"
                                    onClick={removeImage}
                                  >
                                    <i className="ti ti-x" />
                                  </button> */}
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
                                Upload More Photos (10 Photos)
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*"
                                onChange={handleMultipleImagesChange}
                              />

                              {/* Display Image Previews */}
                              <div className="image-preview mt-2">
                                {multiImages.map((img, i) => (
                                  <img
                                    key={i}
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    width="80"
                                    className="me-2 mb-2"
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
                  onClick={() => setActivityToggleTwo(false)}
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
      {/* /Edit Product */}
      {/* Delete Product */}
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
                <h3>Are You Sure Remove Product?</h3>
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
                    onClick={handleDeleteProduct}
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Product */}
    </>
  );
};

export default Product;
