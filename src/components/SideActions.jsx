import React, { memo, useState, useEffect } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionSummary,
  AccordionDetails,
  Input,
  Stack,
  Button,
  Select,
  Option
} from '@mui/joy';
import { FiCpu, FiServer, FiCloud, FiMonitor } from 'react-icons/fi';

const deviceConfigs = [
  { type: 'PC', icon: FiMonitor },
  { type: 'Router', icon: FiCpu },
  { type: 'Server', icon: FiServer },
  { type: 'Cloud', icon: FiCloud }
];

const statusOptions = ['Online', 'Offline', 'Maintenance', 'Unknown'];

const getFormForDevice = (type, addNode, deleteNode, editingNode, updateNode) => {
  const defaults = editingNode?.data || {};
  const isEditing = editingNode?.data?.label === type;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const iconElement = React.createElement(
      deviceConfigs.find((config) => type === config?.type).icon
    );

    if (isEditing) {
      updateNode(editingNode.id, { ...formJson, icon: iconElement });
    } else {
      addNode(type, { ...formJson, deleteNode, icon: iconElement });
    }

    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        {/* Common Status Field */}
        <Select
          name="status"
          defaultValue={defaults.status || 'Online'}
          placeholder="Select status"
        >
          {statusOptions.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>

        {type === 'Server' && (
          <>
            <Input placeholder="Server name" name="server_name" defaultValue={defaults.server_name} required />
            <Input placeholder="IP address" name="ip_address" defaultValue={defaults.ip_address} />
            <Input placeholder="OS" name="os" defaultValue={defaults.os} />
            <Input placeholder="Role (DB/Web/etc.)" name="role" defaultValue={defaults.role} />
            <Input placeholder="Rack location" name="rack" defaultValue={defaults.rack} />
          </>
        )}
        {type === 'PC' && (
          <>
            <Input placeholder="Hostname" name="hostname" defaultValue={defaults.hostname} required />
            <Input placeholder="User" name="user" defaultValue={defaults.user} />
            <Input placeholder="OS" name="os" defaultValue={defaults.os} />
            <Input placeholder="MAC address" name="mac" defaultValue={defaults.mac} />
            <Input placeholder="Connected switch port" name="switch_port" defaultValue={defaults.switch_port} />
          </>
        )}
        {type === 'Router' && (
          <>
            <Input placeholder="Router name" name="router_name" defaultValue={defaults.router_name} required />
            <Input placeholder="Model" name="model" defaultValue={defaults.model} />
            <Input placeholder="Firmware version" name="firmware" defaultValue={defaults.firmware} />
            <Input placeholder="Ports" name="ports" defaultValue={defaults.ports} />
            <Input placeholder="Routing protocol" name="protocol" defaultValue={defaults.protocol} />
          </>
        )}
        {type === 'Cloud' && (
          <>
            <Input placeholder="Provider" name="provider" defaultValue={defaults.provider} required />
            <Input placeholder="Region" name="region" defaultValue={defaults.region} />
            <Input placeholder="Instance type" name="instance_type" defaultValue={defaults.instance_type} />
            <Input placeholder="Service type (compute/storage)" name="service_type" defaultValue={defaults.service_type} />
            <Input placeholder="Security group" name="security_group" defaultValue={defaults.security_group} />
          </>
        )}

        {isEditing ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
            <Button type="submit" variant="solid" fullWidth>Update</Button>
            <Button type="clear" variant="solid">Cancel</Button>
          </div>
        ) : (
          <Button type="submit" variant="solid">{`Add ${type}`}</Button>
        )}
      </Stack>
    </form>
  );
};

const SideActions = ({ addNode, deleteNode, editingNode, updateNode }) => {
  const [expanded, setExpanded] = useState('PC');

  useEffect(() => {
    if (editingNode) {
      setExpanded(editingNode.data.label);
    }
  }, [editingNode]);

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
        {editingNode ? 'Edit Device' : 'Add Device'}
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
              <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                {getFormForDevice(
                  device.type,
                  addNode,
                  deleteNode,
                  editingNode,
                  updateNode
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionGroup>

      <p style={{ marginTop: 'auto', fontSize: 12, color: '#666' }}>
        Click and drag between nodes to connect. Select a node and press Backspace
        to remove.
      </p>
    </div>
  );
};

export default memo(SideActions);
