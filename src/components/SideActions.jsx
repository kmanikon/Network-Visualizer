import React, { memo, useState } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionSummary,
  AccordionDetails,
  Input,
  Stack,
  Button
} from '@mui/joy';
import { FiCpu, FiServer, FiCloud, FiMonitor } from 'react-icons/fi';

// ✅ Configs defined once, outside component
const deviceConfigs = [
  { type: 'PC', icon: FiMonitor },
  { type: 'Router', icon: FiCpu },
  { type: 'Server', icon: FiServer },
  { type: 'Cloud', icon: FiCloud }
];

// ✅ Helper function to render device-specific forms
const getFormForDevice = (type, addNode, deleteNode) => {
  switch (type) {
    case 'Server':
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            addNode(type, { ...formJson, deleteNode: deleteNode, icon: React.createElement(deviceConfigs.find((config) => type === config?.type).icon) })
          }}
        >
          <Stack spacing={1}>
            <Input placeholder="Server name" name="server_name" required />
            <Input placeholder="IP address" name="ip_address" />
            <Button type="submit" variant="solid">
              Add Server
            </Button>
          </Stack>
        </form>
      );

    case 'PC':
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            addNode(type, { ...formJson, deleteNode: deleteNode, icon: React.createElement(deviceConfigs.find((config) => type === config?.type).icon) })

          }}
        >
          <Stack spacing={1}>
            <Input placeholder="Hostname" name="hostname" required />
            <Input placeholder="User" name="user" />
            <Button type="submit" variant="solid">
              Add PC
            </Button>
          </Stack>
        </form>
      );

    case 'Router':
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            addNode(type, { ...formJson, deleteNode: deleteNode, icon: React.createElement(deviceConfigs.find((config) => type === config?.type).icon) })

          }}
        >
          <Stack spacing={1}>
            <Input placeholder="Router name" name="router_name" required />
            <Input placeholder="Ports" name="ports" />
            <Button type="submit" variant="solid">
              Add Router
            </Button>
          </Stack>
        </form>
      );

    case 'Cloud':
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            addNode(type, { ...formJson, deleteNode: deleteNode, icon: React.createElement(deviceConfigs.find((config) => type === config?.type).icon) })
          }}
        >
          <Stack spacing={1}>
            <Input placeholder="Provider" name="provider" required />
            <Input placeholder="Region" name="region" />
            <Button type="submit" variant="solid">
              Add Cloud
            </Button>
          </Stack>
        </form>
      );

    default:
      return null;
  }
};

const SideActions = ({ addNode, deleteNode }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div
      style={{
        position: 'absolute',
        top: '12.5%',
        right: 20,
        height: '80%',
        width: '260px',
        background: '#FFFFFF',
        zIndex: 2,
        borderRadius: 8,
        border: '1px solid #DDD',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflow: 'auto'
      }}
    >
      <h3 style={{ marginBottom: 10, fontWeight: 'bold', marginLeft: 10 }}>
        Add Device
      </h3>

      <AccordionGroup sx={{ maxWidth: 400 }}>
        {deviceConfigs.map((device, i) => (
          <Accordion
            key={i}
            expanded={expanded === device.type}
            onChange={(_, newExpanded) =>
              setExpanded(newExpanded ? device.type : null)
            }
          >
            <AccordionSummary>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {React.createElement(device.icon, { size: 18 })}
                {device.type}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{paddingTop: 10, paddingBottom: 10}}>
                {getFormForDevice(device.type, addNode, deleteNode)}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionGroup>

      <p style={{ marginTop: 'auto', fontSize: 12, color: '#666' }}>
        Click and drag between nodes to connect. Select a node and press Delete
        to remove.
      </p>
    </div>
  );
};

export default memo(SideActions);
