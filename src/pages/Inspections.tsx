
import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Inspection } from '../types';

const Inspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for inspections
    const mockInspections: Inspection[] = [
      {
        Id: '1',
        UserEmail: 'user@example.com',
        Timestamp: '2024-01-20T10:30:00Z',
        ReportData: {
          datahall: 'DH-01',
          status: 'completed',
          isUrgent: false,
          temperatureReading: '22°C',
          humidityReading: '45%',
          securityPassed: true,
          coolingSystemCheck: true,
        },
        status: 'completed',
      },
      {
        Id: '2',
        UserEmail: 'user@example.com',
        Timestamp: '2024-01-19T14:15:00Z',
        ReportData: {
          datahall: 'DH-02',
          status: 'in-progress',
          isUrgent: true,
          temperatureReading: '28°C',
          humidityReading: '55%',
          securityPassed: false,
          coolingSystemCheck: false,
        },
        status: 'in-progress',
      },
    ];
    setInspections(mockInspections);
  }, []);

  return (
    <Box pad="medium" gap="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={2}>Inspections</Heading>
        <Button
          icon={<Plus size={20} />}
          label="New Inspection"
          onClick={() => navigate('/inspection')}
        />
      </Box>

      {inspections.length > 0 ? (
        inspections.map((inspection) => (
          <Box
            key={inspection.Id}
            border="bottom"
            pad={{ vertical: 'small' }}
            onClick={() => navigate(`/inspections/${inspection.Id}`)}
            hoverIndicator
            style={{ cursor: 'pointer' }}
          >
            <Heading level={4} margin="none">
              {inspection.ReportData.datahall} - {inspection.ReportData.status}
            </Heading>
            <Text size="small">
              Temperature: {inspection.ReportData.temperatureReading} | 
              Humidity: {inspection.ReportData.humidityReading}
            </Text>
            <Text size="xsmall" color="dark-6">
              {new Date(inspection.Timestamp).toLocaleDateString()}
            </Text>
          </Box>
        ))
      ) : (
        <Text>No inspections found.</Text>
      )}
    </Box>
  );
};

export default Inspections;
