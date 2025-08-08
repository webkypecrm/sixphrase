
const CampaignBox = ({ classes, icon, title, count }) => {

    return <div className="col-xl-3 col-lg-6">
        <div className={`campaign-box ${classes}`}>
            <div className="campaign-img">
                <span>
                    <i className={icon} />
                </span>
                <p>{title}</p>
            </div>
            <h2>{count}</h2>
        </div>
    </div>

}


export default CampaignBox