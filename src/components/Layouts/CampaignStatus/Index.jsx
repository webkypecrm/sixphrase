import CampaignBox from "./CampaignBox"

const CampaignStatus = () => {

    return <div className="row">
        <CampaignBox
            classes="bg-danger-light"
            icon="ti ti-brand-campaignmonitor"
            title="Campaign"
            count="474" />
            
        <CampaignBox
            classes="bg-warning-light"
            icon="ti ti-send"
            title="Sent"
            count="454" />

        <CampaignBox
            classes="bg-purple-light"
            icon="ti ti-brand-feedly"
            title="Opened"
            count="658" />

        <CampaignBox
            classes="bg-success-light"
            icon="ti ti-brand-pocket"
            title="Completed"
            count="747" />

    </div>

}


export default CampaignStatus