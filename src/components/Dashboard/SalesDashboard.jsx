
const SalesDashboard = () => {

    return <div className="page-wrapper">
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-header">
                        <div className="row align-items-center ">
                            <div className="col-md-4">
                                <h3 className="page-title">Deals Dashboard</h3>
                            </div>
                            <div className="col-md-8 float-end ms-auto">
                                <div className="d-flex title-head">
                                    <div className="daterange-picker d-flex align-items-center justify-content-center">
                                        <div className="form-sort me-2">
                                            <i className="ti ti-calendar"></i>
                                            <input type="text" className="form-control  date-range bookingrange" />
                                        </div>
                                        <div className="head-icons mb-0">
                                            <a href="index.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Refresh"><i className="ti ti-refresh-dot"></i></a>
                                            <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header"><i className="ti ti-chevrons-up"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body">
                                    <div className="statistic-header">
                                        <h4><i className="ti ti-grip-vertical me-1"></i>Recently Created Deals</h4>
                                        <div className="dropdown statistic-dropdown">
                                            <div className="card-select">
                                                <ul>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            <i className="ti ti-calendar-check me-2"></i>Last 30 days
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <a href="#" className="dropdown-item">
                                                                Last 15 days
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 30 days
                                                            </a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive custom-table">
                                        <table className="table dataTable" id="deals-project">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th>Deal Name</th>
                                                    <th>Stage</th>
                                                    <th>Deal Value</th>
                                                    <th>Probability</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body">
                                    <div className="statistic-header">
                                        <h4><i className="ti ti-grip-vertical me-1"></i>Deals By Stage</h4>
                                        <div className="dropdown statistic-dropdown">
                                            <div className="card-select">
                                                <ul>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Sales Pipeline
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Marketing Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Sales Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Email
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Chats
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Operational
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Last 30 Days
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <a href="#" className="dropdown-item">
                                                                Last 30 Days
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 15 Days
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 7 Days
                                                            </a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="deals-chart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body">
                                    <div className="statistic-header">
                                        <h4><i className="ti ti-grip-vertical me-1"></i>Leads By Stage</h4>
                                        <div className="dropdown statistic-dropdown">
                                            <div className="card-select">
                                                <ul>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Marketing Pipeline
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Marketing Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Sales Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Email
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Chats
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Operational
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Last 3 months
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Last 3 months
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 6 months
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 12 months
                                                            </a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                    </div>
                                    <div id="last-chart"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body ">
                                    <div className="statistic-header">
                                        <h4><i className="ti ti-grip-vertical me-1"></i>Won Deals Stage</h4>
                                        <div className="dropdown statistic-dropdown">
                                            <div className="card-select">
                                                <ul>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Marketing Pipeline
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Marketing Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Sales Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Email
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Chats
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Operational
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Last 3 months
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Last 3 months
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 6 months
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 12 months
                                                            </a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="won-chart"></div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 d-flex">
                            <div className="card w-100">
                                <div className="card-body">
                                    <div className="statistic-header">
                                        <h4><i className="ti ti-grip-vertical me-1"></i>Deals by Year</h4>
                                        <div className="dropdown statistic-dropdown">
                                            <div className="card-select">
                                                <ul>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Sales Pipeline
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Marketing Pipeline
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Sales Pipeline
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                            Last 3 months
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">

                                                            <a href="#" className="dropdown-item">
                                                                Last 3 months
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 6 months
                                                            </a>
                                                            <a href="#" className="dropdown-item">
                                                                Last 12 months
                                                            </a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="deals-year"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
}


export default SalesDashboard