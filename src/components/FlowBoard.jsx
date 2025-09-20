import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType,
  Node
} from '@xyflow/react';

import SideActions from './SideActions';
import { FiCpu, FiServer, FiCloud, FiMonitor } from 'react-icons/fi';

//import 'reactflow/dist/style.css';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  //{ id: '1', position: { x: window.innerWidth / 2, y: window.innerHeight / 2 + 100 }, data: { label: '1' } },
  //{ id: '2', position: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 }, data: { label: '2' } },
];

const initialEdges = []//[{ id: 'e1-2', source: '1', target: '2' }];

// Unique ID generator
let id = 1;
const getId = () => `node-${id++}`;

// Custom node component with more detail
const DeviceNode = ({ data, selected }) => {
  return (
    <div
      style={{
        borderRadius: 12,
        border: selected ? '2px solid #0077FF' : '2px solid #ccc',
        background: '#fff',
        boxShadow: selected
          ? '0 0 10px rgba(0, 119, 255, 0.4)'
          : '0 2px 6px rgba(0,0,0,0.15)',
        width: 160,
        fontFamily: 'sans-serif',
        fontSize: 13,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: data.type === 'PC'
            ? 'linear-gradient(135deg, #42a5f5, #1e88e5)'
            : data.type === 'Server'
            ? 'linear-gradient(135deg, #66bb6a, #388e3c)'
            : data.type === 'Router'
            ? 'linear-gradient(135deg, #ffa726, #f57c00)'
            : 'linear-gradient(135deg, #ab47bc, #8e24aa)',
          color: '#fff',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {data.icon}
          <strong>{data.label}</strong>
        </div>

        {/* Status dot */}
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background:
              data.status === 'online'
                ? '#4caf50'
                : data.status === 'offline'
                ? '#f44336'
                : '#ff9800',
            display: 'inline-block'
          }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: 10, background: '#fafafa' }}>
        {data.ip && (
          <div style={{ marginBottom: 4 }}>
            <strong>IP:</strong> {data.ip}
          </div>
        )}
        {data.description && (
          <div style={{ fontSize: 12, color: '#555' }}>
            {data.description}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '6px 8px',
          borderTop: '1px solid #eee',
          background: '#fff'
        }}
      >
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          ⚙️
        </button>
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          ❌
        </button>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', top: '50%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', top: '50%' }}
        isConnectable={true}
      />
    </div>
  );
};


const FlowBoard = ({}) => {

    const proOptions = { hideAttribution: true };
    

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Add node from SideActions
    // const addNode = (type) => {
    //   const newNode = {
    //     id: getId(),
    //     position: {
    //       x: Math.random() * (window.innerWidth - 200) + 100,
    //       y: Math.random() * (window.innerHeight - 200) + 100
    //     },
    //     type: 'custom',
    //     data: { label: type, icon: getIcon(type) },
    //   };
    //   setNodes((nds) => nds.concat(newNode));
    // };

    const addNode = useCallback((type, formData) => {
      setNodes((nds) => [
        ...nds,
        {
          id: getId(),
          position: { x: 200, y: 200 },
          type: 'custom',
          data: { label: type, ...formData },
        },
      ]);
    }, [setNodes]);


    // Map type to icon
    const getIcon = (type) => {
      switch (type) {
        case 'PC':
          return <FiMonitor size={20} />;
        case 'Router':
          return <FiCpu size={20} />;
        case 'Server':
          return <FiServer size={20} />;
        case 'Cloud':
          return <FiCloud size={20} />;
        default:
          return <FiMonitor size={20} />;
      }
    };

    // Handle connecting edges
    // const onConnect = useCallback(
    //   (params) =>
    //     setEdges((eds) =>
    //       addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.Arrow } }, eds)
    //     ),
    //   [setEdges]
    // );

   const onConnect = useCallback(
  (params) =>
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          id: `e-${params.source}-${params.target}-${Date.now()}`,
          animated: true,
          markerEnd: { type: MarkerType.Arrow },
          type: 'step'
        },
        eds
      )
    ),
  [setEdges]
);


    //const onConnect = useCallback((params) => setEdges(addEdge(params, edges)), [edges]);


    // Delete selected nodes/edges
    const onNodeDelete = useCallback(
      (event) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          setNodes((nds) => nds.filter((n) => !n.selected));
          setEdges((eds) => eds.filter((e) => !e.selected));
        }
      },
      [setNodes, setEdges]
    );

    // Node types
    const nodeTypes = { custom: DeviceNode };


    return (
        <div 
          style={{
            height: '100%', 
            width: '100%', 
            background: '#F0F0F0'
          }}
          tabIndex={0}
          onKeyDown={onNodeDelete}
        >
            <SideActions addNode={addNode} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(e) => {
                  onConnect(e);
                  console.log(edges)
                }}
                proOptions={proOptions}
                //colorMode={'dark'}
                nodeTypes={nodeTypes}
                connectionLineType="step"
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