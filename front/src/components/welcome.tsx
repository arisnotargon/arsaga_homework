import React, { useEffect, useRef, useState } from 'react';
import { Col, Row ,Typography} from 'antd';
const { Text } = Typography;


//BasicProps
type Props = {
    header: React.ExoticComponent
}

const Welcome = ({ header }: Props) => {
    return(
        <>
            <header >
                <Row >
                    <Col span={8}> </Col>
                    <Col span={8}><Text style={{fontSize:'12vh'}} type="success">Home page</Text></Col>
                    <Col span={8}> </Col>
                </Row>
            </header> 
            <div style={{ padding: 24, minHeight: 360  }}>
                    welcome
            </div>
        </>
        
    )
 };

export default Welcome;