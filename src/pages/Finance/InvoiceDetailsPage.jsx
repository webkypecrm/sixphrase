import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// import logo from '/assets/img/derma-sidebar-logo.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDate } from '../../selectOption/selectFunction';

const InvoiceDetailsPage = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const { invoiceId } = useParams();
  const [data, setData] = useState({});
  const invoiceRef = useRef(null); // Reference to the invoice card

  const fetchInvoiceDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/customer/invoice-details-by-id/${invoiceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        }
      });
      const resData = await response.json();
      setData(() => ({ ...resData.data }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore original layout
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${invoiceId}.pdf`);
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-4">
                  <h4 className="page-title">Invoice Details</h4>
                </div>
                <div className="col-8 text-end">
                  <button className="btn btn-primary" type="button" onClick={handleDownloadPDF}>
                    <i className="ti ti-download me-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="row">
                <div className="col-sm-10 mx-auto">
                  <Link onClick={() => navigate(-1)} className="back-icon d-flex align-items-center fs-12 fw-medium mb-3 d-inline-flex">
                    <span className=" d-flex justify-content-center align-items-center rounded-circle me-2">
                      <i className="ti ti-arrow-left" />
                    </span>
                    Back to List
                  </Link>
                  <div className="card" ref={invoiceRef}>
                    <div className="card-body p-4">
                      <div className="border-bottom mb-3">
                        <div className="row justify-content-between align-items-center">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <div className="mb-2">
                                <img
                                  className="img-fluid"
                                  src={logo}
                                  alt="logo"
                                  style={{ height: "60px" }}
                                />
                              </div>
                              <p>Skin Care Clinic in New Delhi</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="text-end mb-3">
                              <h5 className="text-gray mb-1">
                                Invoice No{" "}
                                <span className="text-primary">#INV000{data?.id}</span>
                              </h5>
                              <p className="mb-1 fw-medium">
                                Created Date :{" "}
                                <span className="text-dark">{getDate(data?.createdAt)}</span>{" "}
                              </p>
                              {/* <p className="fw-medium">
                                Due Date :{" "}
                                <span className="text-dark">{getDate(data?.dueDate)}</span>{" "}
                              </p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-bottom mb-3">
                        <div className="row">
                          <div className="col-md-5">
                            <div className="mb-3">
                              <p className="text-dark mb-2 fw-semibold">From</p>
                              <div>
                                <h4 className="mb-1">Derma Arts</h4>
                                <p className="mb-1">
                                  E-4, Hansraj Gupta Rd, Greater Kailash-1,
                                  Block E, Greater Kailash 1, Greater Kailash,
                                  New Delhi, 110048
                                </p>
                                <p className="mb-1">

                                  <span className="text-dark">
                                    www.dermaartsclinic.com
                                  </span>
                                </p>
                                <p className="mb-1">
                                  Phone :{" "}
                                  <span className="text-dark">
                                    9289091212
                                  </span>
                                </p>
                                <p className="mb-1">
                                  GST No :{" "}
                                  <span className="text-dark">
                                    07CGRPA0393P2ZU
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-5">
                            <div className="mb-3">
                              <p className="text-dark mb-2 fw-semibold">To</p>
                              <div>
                                <h4 className="mb-1">{data?.Customer?.customerName}</h4>
                                <p className="mb-1">
                                  {data?.customerAddress}
                                </p>
                                <p className="mb-1">
                                  Email :{" "}
                                  <span className="text-dark">
                                    {data?.customerEmail}
                                  </span>
                                </p>
                                <p>
                                  Phone :{" "}
                                  <span className="text-dark">{data?.customerMobile}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            {/* <div className="mb-3">
                              <p className="text-title mb-2 fw-medium">
                                Payment Method{" "}
                              </p>
                              <span className="badge bg-outline-dark text-dark">
                                <i className="ti ti-point-filled " />
                                {data?.paymentMethod}
                              </span>
                            </div> */}
                            <div className="mb-3">
                              <p className="text-title mb-2 fw-medium">
                                Payment Status{" "}
                              </p>
                              <span className="badge bg-outline-dark text-dark">
                                <i className="ti ti-point-filled " />
                                {data?.status}
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="fw-medium">
                          Invoice For :{" "}
                          <span className="text-dark fw-medium">
                            Derma Package
                          </span>
                        </p>
                        <div className="table-responsive mb-3">
                          <table className="table">
                            <thead className="thead-light">
                              <tr>
                                <th>Service Description</th>
                                <th className="text-end">Qty</th>
                                <th className="text-end">Cost</th>
                                <th className="text-end">Discount</th>
                                <th className="text-end">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.InvoiceItem?.map((item) => <tr key={item?.id}>
                                <td>
                                  <h6>{item.itemName}</h6>
                                </td>
                                <td className="text-gray-9 fw-medium text-end">
                                  {item.quantity}
                                </td>
                                <td className="text-gray-9 fw-medium text-end">
                                  ₹{item.price}
                                </td>
                                <td className="text-gray-9 fw-medium text-end">
                                  ₹{item.discount}
                                </td>
                                <td className="text-gray-9 fw-medium text-end">
                                  ₹{item.total}
                                </td>
                              </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="border-bottom mb-3">
                        <div className="row align-items-center">
                          <div className="col-md-7" style={{ visibility: "hidden" }}>
                            <div className="mb-3" >
                              <div className="mb-3">
                                <h6 className="mb-1">Terms and Conditions</h6>
                                <p>
                                  Please pay within 15 days from the date of
                                  invoice, overdue interest @ 14% will be charged on
                                  delayed payments.
                                </p>
                              </div>
                              <div className="mb-3">
                                <h6 className="mb-1">Notes</h6>
                                <p>
                                  Please quote invoice number when remitting funds.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-5">
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center border-bottom mb-2 pe-3">
                                <p className="mb-0">Sub Total</p>
                                <p className="text-dark fw-medium mb-2">₹{data?.subTotal}</p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center border-bottom mb-2 pe-3">
                                <p className="mb-0">Tax Rate(%)</p>
                                <p className="text-dark fw-medium mb-2">{data?.taxRate}%</p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2 pe-3">
                                <p className="mb-0">Tax Amount</p>
                                <p className="text-dark fw-medium mb-2">₹{data?.taxAmount}</p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2 pe-3">
                                <h5>Total Amount</h5>
                                <h5>₹{data?.total}</h5>
                              </div>
                              {/* <p className="fs-12">
                                Amount in Words : Dollar Five thousand Seven Seventy
                                Five
                              </p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-bottom mb-3">
                        <div className="row justify-content-end">
                          <div className="col-md-3">
                            <div className="mb-3">
                              <div className="text-end">
                                {/* <img
                              className="img-fluid"
                              src="/react/template/assets/img/icons/sign.svg"
                              alt="sign"
                            /> */}
                              </div>
                              <div className="text-end mb-3">
                                <h6 className="fs-14 fw-medium pe-3">
                                  Dr. Mitra Amiri
                                </h6>
                                {/* <p>Assistant Manager</p> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="mb-3">
                          <img
                            className="img-fluid"
                            src={logo}
                            alt="logo"
                            style={{ height: "60px" }}
                          />
                        </div>
                        <p className="text-dark mb-1">
                          Payment Made Via bank transfer / Cheque in the name of
                          Thomas Lawler
                        </p>
                        <div className="d-flex justify-content-center align-items-center flex-wrap row-gap-2">
                          <p className="fs-12 mb-0 me-3">
                            Bank Name : <span className="text-dark">HDFC Bank</span>
                          </p>
                          <p className="fs-12 mb-0 me-3">
                            Account Number :{" "}
                            <span className="text-dark">45366287987</span>
                          </p>
                          <p className="fs-12">
                            IFSC : <span className="text-dark">HDFC0018159</span>
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <button
                    className="btn btn-primary d-flex justify-content-center align-items-center me-2"
                    // href="/react/template/application/invoice-details"
                    type='button'
                    onClick={handlePrint}
                  >
                    <i className="ti ti-printer me-2" />
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;