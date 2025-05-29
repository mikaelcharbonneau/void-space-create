import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Button, Heading, Text, Spinner } from 'grommet';
import { ArrowLeft } from 'lucide-react';
import { Inspection } from '../types';

const AuditDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Inspection ID is missing.');
      setLoading(false);
      return;
    }

    // Mock API call - replace with your actual API endpoint
    const fetchInspection = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockInspectionData = {
          Id: id,
          UserEmail: 'john.doe@example.com',
          Timestamp: new Date().toISOString(),
          ReportData: {
            datahall: 'Datahall A',
            status: 'Good',
            isUrgent: false,
            temperatureReading: '22°C',
            humidityReading: '55%',
            comments: 'All systems are nominal.',
            securityPassed: true,
            coolingSystemCheck: true,
          },
          status: 'completed',
        };

        setInspection(mockInspectionData as Inspection);
      } catch (err: any) {
        setError(err.message || 'Failed to load inspection details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [id]);

  if (loading) {
    return (
      <Box fill align="center" justify="center">
        <Spinner size="large" />
        <Text margin={{ top: 'small' }}>Loading inspection details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box fill align="center" justify="center" gap="small">
        <Heading level={3} color="status-error">Error</Heading>
        <Text>{error}</Text>
        <Button label="Go Back" onClick={() => navigate(-1)} />
      </Box>
    );
  }

  if (!inspection) {
    return (
      <Box fill align="center" justify="center">
        <Heading level={3}>Inspection not found</Heading>
        <Button label="Go Back" onClick={() => navigate(-1)} />
      </Box>
    );
  }

  return (
    <Box gap="medium">
      <Button
        label={
          <Box direction="row" align="center" gap="small">
            <ArrowLeft size={20} />
            Back to Inspections
          </Box>
        }
        onClick={() => navigate('/inspections')}
        plain
      />

      <Heading level={2}>Inspection Details</Heading>

      <Box background="white" pad="medium" round="small" elevation="small">
        <Text size="large" weight="bold">Datahall: {inspection.ReportData.datahall}</Text>
        <Text>Status: {inspection.status}</Text>
        <Text>Temperature: {inspection.ReportData.temperatureReading}</Text>
        <Text>Humidity: {inspection.ReportData.humidityReading}</Text>
        <Text>Comments: {inspection.ReportData.comments}</Text>
      </Box>
    </Box>
  );
};

export default AuditDetails;
