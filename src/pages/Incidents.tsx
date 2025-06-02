
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button, Card, CardBody, DataTable, Text } from 'grommet';
import { Add } from 'grommet-icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import StatusChip from '../components/ui/StatusChip';
import { Incident } from '../types';

const Incidents = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error: any) {
      console.error('Error fetching incidents:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'status-critical';
      case 'high':
        return 'status-warning';
      case 'medium':
        return 'status-warning';
      case 'low':
        return 'status-ok';
      default:
        return 'text';
    }
  };

  const columns = [
    {
      property: 'created_at',
      header: <Text weight="bold">Date</Text>,
      render: (datum: Incident) => (
        <Text>{format(new Date(datum.created_at), 'MMM dd, yyyy')}</Text>
      ),
    },
    {
      property: 'location',
      header: <Text weight="bold">Location</Text>,
      render: (datum: Incident) => (
        <Text>{datum.location} - {datum.datahall}</Text>
      ),
    },
    {
      property: 'rack_number',
      header: <Text weight="bold">Rack</Text>,
    },
    {
      property: 'part_type',
      header: <Text weight="bold">Component</Text>,
      render: (datum: Incident) => (
        <Text>{datum.part_type} {datum.part_identifier}</Text>
      ),
    },
    {
      property: 'severity',
      header: <Text weight="bold">Severity</Text>,
      render: (datum: Incident) => (
        <Text color={getSeverityColor(datum.severity)}>
          {datum.severity.charAt(0).toUpperCase() + datum.severity.slice(1)}
        </Text>
      ),
    },
    {
      property: 'status',
      header: <Text weight="bold">Status</Text>,
      render: (datum: Incident) => (
        <StatusChip status={datum.status} />
      ),
    },
  ];

  if (loading) {
    return (
      <Box pad="medium" align="center" justify="center" fill>
        <Text>Loading incidents...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium" gap="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={2} margin={{ top: 'none', bottom: 'none' }}>
          Incidents
        </Heading>
        <Button
          icon={<Add />}
          label="Report Incident"
          primary
          onClick={() => navigate('/inspection')}
        />
      </Box>

      {error && (
        <Box background="status-error" pad="small" round="small">
          <Text color="white">{error}</Text>
        </Box>
      )}

      <Card background="white" pad="medium">
        <CardBody>
          {incidents.length === 0 ? (
            <Box align="center" pad="large">
              <Text color="text-weak">No incidents found</Text>
              <Button
                label="Report Your First Incident"
                onClick={() => navigate('/inspection')}
                margin={{ top: 'medium' }}
                primary
              />
            </Box>
          ) : (
            <DataTable
              columns={columns}
              data={incidents}
              size="medium"
              sortable
              onClickRow={({ datum }) => navigate(`/incidents/${datum.id}`)}
            />
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Incidents;
