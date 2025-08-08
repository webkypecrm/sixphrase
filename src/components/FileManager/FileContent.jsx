import React from "react";
import { ChevronRight, Filter, FileText } from "react-feather";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Search, Star } from "react-feather";
import ImageWithBasePath from "../ImageWithBasePath";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const FileContent = ({ data }) => {

  return (
    <>
      {/* /Overview */}
      <div className="overview seprator-lg">
        {/* <h4 className="mb-2">Overview</h4> */}
        <div className="row g-3">
          {data.map((item) => <div className="col-sm-6 col-md-2" key={item?.customerId}>
            <div className="detail">
              <Link
                to={`/sales/leads-details/${item?.convertedLeadId}`}
                className="d-flex align-items-center justify-content-center bg-light-orange bg p-4"
              >
                <span className="d-flex align-items-center justify-content-center">
                  <ImageWithBasePath
                    src="assets/img/icons/folder.svg"
                    alt="Folder"
                  />
                </span>
              </Link>
              <div className="d-flex align-items-center justify-content-between info">
                <h6>
                  <Link to={`/sales/leads-details/${item?.convertedLeadId}`} >
                    {item?.customerName}
                  </Link>
                </h6>
                {/* <span>300 Files</span> */}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileContent;
