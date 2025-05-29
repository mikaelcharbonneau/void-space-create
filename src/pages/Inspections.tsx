import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from 'grommet';
import { Add } from 'lucide-react';
import { Inspection } from '../types';
import InspectionCard from '../components/dashboard/InspectionCard';

const Inspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockInspections: Inspection[] = [
        {
          Id: '1',
          UserEmail: 'john.doe@example.com',
          Timestamp: new Date().toISOString(),
          ReportData: { datahall: 'Datahall A', status: 'Good', isUrgent: false, temperatureReading: '22C', humidityReading: '50%', securityPassed: true, coolingSystemCheck: true },
          status: 'completed'
        },
        {
          Id: '2',
          UserEmail: 'jane.smith@example.com',
          Timestamp: new Date().toISOString(),
          ReportData: { datahall: 'Datahall B', status: 'Needs Attention', isUrgent: true, temperatureReading: '25C', humidityReading: '60%', securityPassed: false, coolingSystemCheck: false },
          status: 'in-progress'
        },
        {
          Id: '3',
          UserEmail: 'john.doe@example.com',
          Timestamp: new Date().toISOString(),
          ReportData: { datahall: 'Datahall C', status: 'Good', isUrgent: false, temperatureReading: '21C', humidityReading: '45%', securityPassed: true, coolingSystemCheck: true },
          status: 'pending'
        },
      ];
      setInspections(mockInspections);
      setLoading(false);
    }, 500);
  }, []);

  const handleInspectionClick = (id: string) => {
    navigate(`/inspections/${id}`);
  };

  return (
    <Box pad="medium">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inspections</h1>
        <Button
          icon={<Add size={16} />}
          label="Start New Inspection"
          onClick={() => navigate('/inspection')}
          primary
        />
      </div>

      {loading ? (
        <div>Loading inspections...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((inspection) => (
            <InspectionCard
              key={inspection.Id}
              inspection={inspection}
              onClick={() => handleInspectionClick(inspection.Id)}
            />
          ))}
        </div>
      )}
    </Box>
  );
};

export default Inspections;
