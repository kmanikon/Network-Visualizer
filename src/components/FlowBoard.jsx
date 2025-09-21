import React, { useCallback, useState, useEffect } from 'react';
import { 
  IconButton 
} from '@mui/joy';
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
  MarkerType
} from '@xyflow/react';
import LZString from 'lz-string';
import { useSearchParams } from 'react-router-dom';
import SideActions from './SideActions';
import { FiCpu, FiServer, FiCloud, FiMonitor } from 'react-icons/fi';
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";

import '@xyflow/react/dist/style.css';

// const initialNodes = [];
// const initialEdges = [];

// Unique ID generator
//let id = 1;
//const getId = () => `node-${id++}`;
const getId = () => `node-${new Date()}`

const excludedFields = [
  'editNode', 
  'deleteNode', 
  'label', 
  'iconType',
  'icon'
];

// Custom node component with details
const DeviceNode = ({ id, data, selected }) => {
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

  return (
    <div
      style={{
        borderRadius: 12,
        border: selected ? '2px solid #479bfcff' : '2px solid #ccc',
        background: '#fff',
        boxShadow: selected
          ? '0 0 8px rgba(0, 119, 255, 0.4)'
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
          // background: data.label === 'PC'
          //   ? 'linear-gradient(135deg, #42a5f5, #1e88e5)'
          //   : data.label === 'Server'
          //   ? 'linear-gradient(135deg, #66bb6a, #388e3c)'
          //   : data.label === 'Router'
          //   ? 'linear-gradient(135deg, #ffa726, #f57c00)'
          //   : 'linear-gradient(135deg, #ab47bc, #8e24aa)',
          background: data.label === 'PC'
            ? 'linear-gradient(135deg, #5e35b1, #3949ab)'     // indigo
            : data.label === 'Server'
            ? 'linear-gradient(135deg, #ad1457, #880e4f)'     // magenta/wine
            : data.label === 'Router'
            ? 'linear-gradient(135deg, #00897b, #00695c)'     // teal (contrast)
            : 'linear-gradient(135deg, #8e24aa, #6a1b9a)',    // purple default

          color: '#fff',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {getIcon(data.iconType)}
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
        {Object.keys(data)
          .map((key) => ({ field_name: key, field_val: data[key] }))
          .filter((val) => !excludedFields.includes(val.field_name))
          .map((val, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ fontSize: 14, color: '#272727ff' }}>
                <b>{val.field_name}:</b>
              </div>
              <div style={{ fontSize: 14, color: '#555' }}>{val.field_val}</div>
            </div>
          ))}
      </div>

      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0px 8px',
          borderTop: '1px solid #eee',
          background: '#fafafa'
        }}
      >
        <IconButton size="sm" onClick={() => data.editNode(id)}>
          <AiOutlineEdit />
        </IconButton>
        <IconButton size="sm" onClick={() => data.deleteNode(id)}>
          <AiOutlineClose />
        </IconButton>
      </div>

      {/* Handles */}
      <Handle
        id="left"
        position={Position.Left}
        style={{ zIndex: 1, pointerEvents: 'auto', background: 'transparent', height: '100%', width: '20%', border: '0px solid transparent' }}
        isConnectable={true}
      />
      <Handle
        id="right"
        position={Position.Right}
        style={{ zIndex: 1, pointerEvents: 'auto', background: 'transparent', height: '100%', width: '20%', border: '0px solid transparent' }}
        isConnectable={true}
      />
    </div>
  );
};

const FlowBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const proOptions = { hideAttribution: true };

  const [initialNodes, setInitialNodes] = useState([]); //parsedData?.nodes || [];
  const [initialEdges, setInitialEdges] = useState([]); //parsedData?.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [editingNode, setEditingNode] = useState(null);


  useEffect(() => {
    const savedData = searchParams.get('flow');
    const parsedData = savedData
      ? JSON.parse(LZString.decompressFromEncodedURIComponent(savedData))
      : null;

    setInitialNodes(parsedData?.nodes)
    setInitialEdges(parsedData?.edges)

    setNodes(parsedData?.nodes)
    setEdges(parsedData?.edges)
  }, [])

  useEffect(() => {
    //id = nodeTypes.length + 1
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify({ nodes, edges }));
    setSearchParams({ flow: compressed });
  }, [nodes, edges, setSearchParams]);

  const addNode = useCallback(
    (type, formData) => {
      setNodes((nds) => [
        ...nds,
        {
          id: getId(),
          position: { x: 200, y: 200 },
          type: 'custom',
          data: { label: type, iconType: type, ...formData }
        }
      ]);
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  const editNode = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) setEditingNode(node);
    },
    [nodes]
  );

  const updateNode = useCallback(
    (nodeId, updates) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: { ...n.data, ...updates }
              }
            : n
        )
      );
      setEditingNode(null);
    },
    [setNodes]
  );

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

  const onNodeDelete = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }      
    },
    [setNodes, setEdges]
  );

  const nodeTypes = { custom: DeviceNode };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: '#F0F0F0'
      }}
      tabIndex={0}
      //onKeyDown={onNodeDelete}
    >
      <SideActions
        addNode={addNode}
        deleteNode={deleteNode}
        editingNode={editingNode}
        updateNode={updateNode}
      />
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          data: { ...n.data, deleteNode, editNode }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        connectionLineType="step"
        connectionMode="loose"
      >
        <MiniMap
          style={{
            position: 'relative',
            left: 0,
            top: 0,
            width: 200,
            height: 150,
            background: '#FAFAFA',
            display: 'block'
          }}
          zoomable
          pannable
          nodeColor={() => '#c0c0c0ff'}
        />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowBoard;
