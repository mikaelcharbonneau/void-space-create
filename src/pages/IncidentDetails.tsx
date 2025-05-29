import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Button, Card, CardBody, CardHeader, Text, Spinner } from 'grommet';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, User, Calendar, MessageSquare } from 'lucide-react';
import { Issue } from '../types';

const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch incident details
    const fetchIncident = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          setIncident({
            id: id || '1',
            title: 'Cooling System Malfunction',
            description: 'The cooling system in Data Hall A has been experiencing intermittent failures over the past 24 hours. Temperature readings have fluctuated between normal ranges and up to 5°C above acceptable thresholds.',
            status: 'in-progress',
            priority: 'high',
            createdAt: '2023-11-15T10:30:00Z',
            updatedAt: '2023-11-16T08:45:00Z',
            assignedTo: 'jane.smith@example.com',
            severity: 'Major'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching incident:', error);
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const getStatusIcon = () => {
    if (!incident) return null;
    
    switch (incident.status) {
      case 'open':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = () => {
    if (!incident) return 'gray';
    
    switch (incident.priority) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Box fill align="center" justify="center">
        <Spinner />
        <Text margin={{ top: 'small' }}>Loading incident details...</Text>
      </Box>
    );
  }

  if (!incident) {
    return (
      <Box pad="medium">
        <Text>Incident not found</Text>
        <Button label="Back to Incidents" onClick={() => navigate('/incidents')} margin={{ top: 'medium' }} />
      </Box>
    );
  }

  return (
    <Box pad="medium">
      <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
        <Button
          icon={<ArrowLeft size={16} />}
          label="Back to Incidents"
          onClick={() => navigate('/incidents')}
          plain
        />
      </Box>

      <Box direction="row" align="center" justify="between" margin={{ bottom: 'medium' }}>
        <Box>
          <Text size="xlarge" weight="bold">{incident.title}</Text>
          <Box direction="row" align="center" gap="small" margin={{ top: 'xsmall' }}>
            <Text size="small">Incident ID: {incident.id}</Text>
            <Text size="small">•</Text>
            <Box direction="row" align="center" gap="xsmall">
              {getStatusIcon()}
              <Text size="small" color={incident.status === 'in-progress' ? 'blue' : undefined}>
                {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box direction="row" gap="small">
          <Button label="Update Status" primary />
          <Button label="Assign" secondary />
        </Box>
      </Box>

      <Box direction="row" gap="medium" margin={{ bottom: 'medium' }}>
        <Card flex width="70%">
          <CardHeader pad="medium" background="light-2">
            <Text weight="bold">Incident Details</Text>
          </CardHeader>
          <CardBody pad="medium">
            <Box gap="medium">
              <Box>
                <Text size="small" color="dark-3">Description</Text>
                <Text margin={{ top: 'xsmall' }}>{incident.description}</Text>
              </Box>
              
              <Box>
                <Text size="small" color="dark-3">Timeline</Text>
                <Box margin={{ top: 'small' }} gap="small">
                  <Box direction="row" align="center" gap="small">
                    <Box background="light-3" pad="xsmall" round>
                      <Calendar size={16} />
                    </Box>
                    <Box>
                      <Text size="small">Created on {new Date(incident.createdAt).toLocaleString()}</Text>
                      <Text size="xsmall" color="dark-4">by {incident.assignedTo}</Text>
                    </Box>
                  </Box>
                  <Box direction="row" align="center" gap="small">
                    <Box background="light-3" pad="xsmall" round>
                      <Clock size={16} />
                    </Box>
                    <Box>
                      <Text size="small">Updated on {new Date(incident.updatedAt).toLocaleString()}</Text>
                      <Text size="xsmall" color="dark-4">Status changed to "In Progress"</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Text size="small" color="dark-3">Comments</Text>
                <Box margin={{ top: 'small' }} gap="medium">
                  <Box background="light-1" pad="small" round="small" border={{ color: 'light-3', size: '1px' }}>
                    <Box direction="row" align="center" gap="small" margin={{ bottom: 'xsmall' }}>
                      <User size={16} />
                      <Text size="small" weight="bold">John Doe</Text>
                      <Text size="xsmall" color="dark-4">Yesterday at 2:30 PM</Text>
                    </Box>
                    <Text size="small">I've checked the cooling system and found that the primary pump is showing signs of wear. We should schedule a replacement within the next week.</Text>
                  </Box>
                  
                  <Box background="light-1" pad="small" round="small" border={{ color: 'light-3', size: '1px' }}>
                    <Box direction="row" align="center" gap="small" margin={{ bottom: 'xsmall' }}>
                      <User size={16} />
                      <Text size="small" weight="bold">Jane Smith</Text>
                      <Text size="xsmall" color="dark-4">Today at 9:15 AM</Text>
                    </Box>
                    <Text size="small">Replacement parts have been ordered. ETA is 2 business days.</Text>
                  </Box>
                  
                  <Box direction="row" align="center" gap="small">
                    <MessageSquare size={16} />
                    <Text size="small">Add a comment...</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>
        
        <Card flex>
          <CardHeader pad="medium" background="light-2">
            <Text weight="bold">Incident Information</Text>
          </CardHeader>
          <CardBody pad="medium">
            <Box gap="medium">
              <Box>
                <Text size="small" color="dark-3">Priority</Text>
                <Box direction="row" align="center" gap="xsmall" margin={{ top: 'xsmall' }}>
                  <Box 
                    background={`${getPriorityColor()}-500`} 
                    width="12px" 
                    height="12px" 
                    round="full" 
                  />
                  <Text>{incident.priority.charAt(0).toUpperCase() + incident.priority.slice(1)}</Text>
                </Box>
              </Box>
              
              <Box>
                <Text size="small" color="dark-3">Severity</Text>
                <Text margin={{ top: 'xsmall' }}>{incident.severity}</Text>
              </Box>
              
              <Box>
                <Text size="small" color="dark-3">Assigned To</Text>
                <Box direction="row" align="center" gap="xsmall" margin={{ top: 'xsmall' }}>
                  <User size={16} />
                  <Text>{incident.assignedTo}</Text>
                </Box>
              </Box>
              
              <Box>
                <Text size="small" color="dark-3">Related Items</Text>
                <Box margin={{ top: 'xsmall' }} gap="xsmall">
                  <Text size="small">• Cooling System #CS-001</Text>
                  <Text size="small">• Data Hall A</Text>
                  <Text size="small">• Maintenance Schedule #MS-2023-11</Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default IncidentDetails;
