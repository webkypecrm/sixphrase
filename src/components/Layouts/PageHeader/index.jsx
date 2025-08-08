import CollapseHeader from "../../CollapseHeader/CollapseHeader"

const PageHeader = ({ title, count, pageRefresh }) => {

    if (count == 0) {
        count = ''
    }

    return <div className="page-header">
        
        <div className="row align-items-center">
            <div className="col-4">
                <h4 className="page-title">
                    {title}
                    {count &&
                        <span className="count-title">{count}</span>
                    }
                </h4>
            </div>
            <div className="col-8 text-end">
                <div className="head-icons">
                    <CollapseHeader pageRefresh={pageRefresh} />
                </div>
            </div>
        </div>
    </div>
}


export default PageHeader