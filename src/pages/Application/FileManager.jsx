import { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import { Empty } from "antd";
const FileContent = lazy(() => import("../../components/FileManager/FileContent"));
import SearchBar from "../../components/UI/SearchBar";

const FileManager = () => {
  const [isOpen, setOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "Ascending", label: "Ascending" },
    { value: "Descending", label: "Descending" },
    { value: "Recently Viewed", label: "Recently Viewed" },
    { value: "Recently Added", label: "Recently Added" },
    { value: "Creation Date", label: "Creation Date" },
  ];
  const pageSize = 500;
  const initialFilter = {
    from: "",
    to: "",
    source: [],
    industry: [],
    country: [],
    stage: [],
    company: [],
    customerOwner: [],
    search: "",
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const staffType = localStorage.getItem('type') || '';

  const fetchCustomerData = async (page) => {
    try {
      const { from, to, industry, source, country, stage, company, customerOwner, search } = filterByObj;

      // console.log("search =>", search)

      let url = `${apiUrl}/customer/customer-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&search=${search}`

      if (staffType == '0') {
        url = `${apiUrl}/customer/customer-list?staffType=${0}&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
            &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&search=${search}`
      }

      // console.log('search =>', search)
      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });

      setData(response.data.data);
      setTotalPages(response.data.totalCount)
      // setIsLoading(false)

    } catch (error) {
      console.log(error)
      // setIsLoading(false)
    }
  };


  // const handleFetchData = (page) => {
  //   fetchCustomerData(page);
  // }

  function handleRefreshData() {
    fetchCustomerData();
  }

  useEffect(() => {
    fetchCustomerData();
  }, [])

  return (
    <div
      className={`page-wrapper notes-page-wrapper file-manager ${isOpen && "notes-tag-left"
        }`}
    >
      <div className="content">
        <div className=" page-add-notes flex-sm-row flex-column">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Customer File Manager</h4>
            </div>
            {/* <span className="count-title">{totalPages}</span> */}
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-sm-4" >
            <SearchBar
              fetchData={handleRefreshData}
              filterByObj={filterByObj}
              setFilterByObj={setFilterByObj}
              placeholder="Search By Name"
            />
          </div>
          {/* <div
            className={`col-lg-3 col-md-12 sidebars-right theiaStickySidebar section-bulk-widget  ${isOpen && "section-notes-dashboard"
              }`}
          >
            <div className="stickybar">
              <aside className="card file-manager-sidebar mb-0">
                <h5 className="d-flex align-items-center">
                  <span className="me-2 d-flex align-items-center">
                    <Folder className="feather-20" />
                  </span>
                  Files
                </h5>
                <div className="dropdown">
                  <Link
                    to="#"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="dropset btn btn-primary mb-3 btn-icon"
                  >
                    <span className="me-1 btn-icon">
                      <PlusCircle className="feather-16" />
                    </span>
                    New
                  </Link>
                  <ul className="dropdown-menu">
                    <li data-bs-toggle="modal" data-bs-target="#upload-file">
                      <Link to="#" className="dropdown-item">
                        <UploadCloud className="feather-16 me-2" />
                        Upload File
                      </Link>
                    </li>
                    <li data-bs-toggle="modal" data-bs-target="#upload-folder">
                      <Link to="#" className="dropdown-item">
                        <Folder className="feather-16 me-2" />
                        Upload Folder
                      </Link>
                    </li>
                    <li data-bs-toggle="modal" data-bs-target="#create-folder">
                      <Link to="#" className="dropdown-item">
                        <FolderMinus className="feather-16 me-2" />
                        Create folder
                      </Link>
                    </li>
                  </ul>
                </div>
                <ul className="mb-5">
                  <li>
                    <Link to="file-manager" className="active">
                      <span className="me-2 btn-icon">
                        <FileText className="feather-16" />
                      </span>
                      My Files
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Star className="feather-16" />
                      </span>
                      Google Drive
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Send className="feather-16" />
                      </span>
                      Dropbox
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <File className="feather-16" />
                      </span>
                      Shared With Me
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <File className="feather-16" />
                      </span>
                      Document
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Clock className="feather-16" />
                      </span>
                      Recent
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Star className="feather-16" />
                      </span>
                      Favourites
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Target className="feather-16" />
                      </span>
                      Archived
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Trash2 className="feather-16" />
                      </span>
                      Deleted
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="me-2 btn-icon">
                        <Settings className="feather-16" />
                      </span>
                      Settings
                    </Link>
                  </li>
                </ul>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="me-2 btn-icon">
                      <HardDrive className="feather-16" />
                    </span>
                    <h6>Storage</h6>
                  </div>
                  <span>70%</span>
                </div>
                <div className="progress my-2">
                  <div
                    className="progress-bar progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: "75%" }}
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span>78.5 GB of 1 TB Free Used</span>
              </aside>
            </div>
          </div> */}

          <div
            className={`col-lg-12 budget-role-notes  ${isOpen && "budgeted-role-notes"
              }`}
          >
            {/* {isOpen ? (
              <FileContent data={data} />
            ) : (
            <FileContent data={data} />
          )} */}

            <Suspense fallback={data.length > 0 ? <ContentLoader /> : <Empty />} >
              <FileContent
                data={data}
              />
            </Suspense>
          </div>
        </div>
        {/* <FileModal /> */}
      </div>
    </div >
  );
};

export default FileManager;
