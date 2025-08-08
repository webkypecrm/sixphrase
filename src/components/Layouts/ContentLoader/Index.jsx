import React from 'react';
import { Flex, Spin } from 'antd';

const ContentLoader = () => {

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Flex align="center" gap="middle">
                <Spin size="large" />
            </Flex>
        </div>
    )
};
export default ContentLoader