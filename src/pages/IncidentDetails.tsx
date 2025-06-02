import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Card, CardBody, Text, Button } from 'grommet';
import { ArrowLeft } from 'grommet-icons';

const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock API call
    const mockIncident = {
      id: id,
      title: 'Critical Server Overload',
      description: 'Server CPU usage exceeds 95% causing performance degradation.',
      status: 'open',
      priority: 'high',
      reportedBy: 'System Monitoring Tool',
      dateReported: '2024-01-20',
      affectedSystems: ['Server-001', 'Server-002'],
      stepsToResolve: '1. Identify the process causing high CPU usage. 2. Restart the process or scale up server resources.',
      assignedTo: 'John Doe'
    };

    setTimeout(() => {
      setIncident(mockIncident);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <Box>Loading incident details...</Box>;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!incident) {
    return <Box>Incident not found.</Box>;
  }

  return (
    <Box pad="medium">
      <Box direction="row" gap="medium" align="center" margin={{ bottom: 'medium' }}>
        <Button icon={<ArrowLeft />} label="Back to Incidents" onClick={() => navigate('/incidents')} />
      </Box>

      <Card>
        <CardBody>
          <Heading level={3} margin={{ bottom: 'small' }}>
            {incident.title}
          </Heading>
          <Text weight="bold" margin={{ bottom: 'small' }}>
            Status: {incident.status}
          </Text>
          <Text margin={{ bottom: 'small' }}>
            Description: {incident.description}
          </Text>
          <Text margin={{ bottom: 'small' }}>
            Priority: {incident.priority}
          </Text>
          <Text margin={{ bottom: 'small' }}>
            Reported By: {incident.reportedBy}
          </Text>
           <Text margin={{ bottom: 'small' }}>
            Date Reported: {incident.dateReported}
          </Text>
           <Text margin={{ bottom: 'small' }}>
            Affected Systems: {incident.affectedSystems.join(', ')}
          </Text>
          <Text margin={{ bottom: 'small' }}>
            Steps to Resolve: {incident.stepsToResolve}
          </Text>
           <Text margin={{ bottom: 'small' }}>
            Assigned To: {incident.assignedTo}
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export default IncidentDetails;
