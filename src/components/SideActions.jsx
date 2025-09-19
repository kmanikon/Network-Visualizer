import React from 'react';
import { FiCpu, FiServer, FiCloud, FiMonitor } from 'react-icons/fi';

const devices = [
  { type: 'PC', icon: <FiMonitor /> },
  { type: 'Router', icon: <FiCpu /> },
  { type: 'Server', icon: <FiServer /> },
  { type: 'Cloud', icon: <FiCloud /> }
];

const SideActions = ({ addNode }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '12.5%',
        right: 20,
        height: '80%',
        width: '200px',
        background: '#FFFFFF',
        zIndex: 2,
        borderRadius: 8,
        border: '1px solid #DDD',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <h3 style={{ marginBottom: 10, fontWeight: 'bold' }}>Add Device</h3>
      {devices.map((device) => (
        <button
          key={device.type}
          onClick={() => addNode(device.type)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: '#F0F0F0',
            border: '1px solid #CCC',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {device.icon} {device.type}
        </button>
      ))}
      <p style={{ marginTop: 'auto', fontSize: 12, color: '#666' }}>
        Click and drag between nodes to connect. Select a node and press Delete to remove.
      </p>
    </div>
  );
};

export default SideActions;
