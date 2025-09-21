import React, { } from 'react';
import {
    ReactFlowProvider
} from '@xyflow/react';
import FlowBoard from '../components/FlowBoard';


const FlowPage = ({}) => {

    return (
        <ReactFlowProvider>
            <FlowBoard/>
        </ReactFlowProvider>
    )
}

export default FlowPage;