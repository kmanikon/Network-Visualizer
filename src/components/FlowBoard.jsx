import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  PanelPosition
} from '@xyflow/react';

import SideActions from './SideActions';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: window.innerWidth / 2, y: window.innerHeight / 2 + 100 }, data: { label: '1' } },
  { id: '2', position: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const FlowBoard = ({}) => {

    const proOptions = { hideAttribution: true };
    

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div 
          style={{
            height: '100%', 
            width: '100%', 
            background: '#F0F0F0'
          }}
        >
            <SideActions/>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                proOptions={proOptions}
                colorMode={'dark'}
              >
                <MiniMap 
                  style={{
                    position: 'relative', 
                    left: 0, 
                    top: 0, 
                    width: 200, 
                    height: 150, 
                    background: '#FAFAFA',
                    display: 'block',
                  }}                   
                  zoomable
                  pannable
                  //maskColor="rgba(255, 0, 0, 0.3)"
                  nodeColor={() => '#c0c0c0ff'}
                />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    )
}

export default FlowBoard;