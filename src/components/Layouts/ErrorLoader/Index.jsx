import React from 'react';
import { Alert, Flex, Spin, Switch } from 'antd';
const ErrorLoader = ({ title, message }) => {
    // const [loading, setLoading] = React.useState(true);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Flex gap="middle" vertical>
                <Spin spinning>
                    <Alert
                        type="info"
                        message={title ? title : 'An Error'}
                        description={message ? message : 'Something went wrong'}
                    />
                </Spin>
                {/* <p>
                    Loading state：
                    <Switch checked={loading} onChange={setLoading} />
                </p> */}
            </Flex>
        </div>
    );
};
export default ErrorLoader;