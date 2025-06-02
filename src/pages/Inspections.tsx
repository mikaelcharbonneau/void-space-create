import { useState, useEffect } from 'react';
import { Box, Heading, Text, Card, CardBody, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import StatusChip from '../components/ui/StatusChip';
import { AuditReport } from '../types';

const Inspections = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box pad="medium" align="center" justify="center" fill>
        <Text>Loading inspections...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium" gap="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={2} margin={{ top: 'none', bottom: 'none' }}>
          Inspections
        </Heading>
        <Button
          icon={<Add />}
          label="Start New Inspection"
          primary
          onClick={() => navigate('/inspection')}
        />
      </Box>

      <Card background="white" pad="medium">
        <CardBody>
          {inspections.length === 0 ? (
            <Box align="center" pad="large">
              <Text color="text-weak">No inspections found</Text>
              <Button
                label="Start Your First Inspection"
                onClick={() => navigate('/inspection')}
                margin={{ top: 'medium' }}
                primary
              />
            </Box>
          ) : (
            <Box gap="small">
              {inspections.map((inspection) => (
                <Card
                  key={inspection.Id}
                  background="light-1"
                  pad="small"
                  round="small"
                  onClick={() => navigate(`/inspections/${inspection.Id}`)}
                  hoverIndicator
                  style={{ cursor: 'pointer' }}
                >
                  <Box direction="row" justify="between" align="center">
                    <Box>
                      <Text weight="bold">{inspection.datacenter} - {inspection.datahall}</Text>
                      <Text size="small" color="text-weak">
                        {inspection.Timestamp}
                      </Text>
                    </Box>
                    <StatusChip status={inspection.state} />
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Inspections;
