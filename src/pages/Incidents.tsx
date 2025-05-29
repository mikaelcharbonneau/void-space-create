import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button } from 'grommet';
import { Add } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../types';

const Incidents = () => {
  const [incidents, setIncidents] = useState<Issue[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch incidents from API or database
    const mockIncidents: Issue[] = [
      {
        id: '1',
        title: 'Server Overheating',
        description: 'Server room temperature exceeded threshold.',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
      },
      {
        id: '2',
        title: 'Network Outage',
        description: 'Intermittent network connectivity issues.',
        status: 'in-progress',
        priority: 'medium',
        createdAt: '2024-01-18T10:00:00Z',
        updatedAt: '2024-01-19T16:45:00Z',
      },
      {
        id: '3',
        title: 'Security Breach Attempt',
        description: 'Multiple failed login attempts detected.',
        status: 'resolved',
        priority: 'critical',
        createdAt: '2024-01-15T08:15:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      },
    ];
    setIncidents(mockIncidents);
  }, []);

  return (
    <Box pad="medium" gap="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={2}>Incidents</Heading>
        <Button
          icon={<Add size={20} />}
          label="Add Incident"
          onClick={() => navigate('/incidents/new')}
        />
      </Box>

      {incidents.length > 0 ? (
        incidents.map((incident) => (
          <Box
            key={incident.id}
            border="bottom"
            pad={{ vertical: 'small' }}
            onClick={() => navigate(`/incidents/${incident.id}`)}
            hoverIndicator
            style={{ cursor: 'pointer' }}
          >
            <Heading level={4} margin="none">
              {incident.title}
            </Heading>
            <Text size="small">{incident.description}</Text>
            <Text size="xsmall" color="dark-6">
              Updated: {new Date(incident.updatedAt).toLocaleDateString()}
            </Text>
          </Box>
        ))
      ) : (
        <Text>No incidents found.</Text>
      )}
    </Box>
  );
};

export default Incidents;
