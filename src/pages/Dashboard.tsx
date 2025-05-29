import { useState, useEffect } from 'react';
import { Grid, Box } from 'grommet';
import InspectionCard from '../components/dashboard/InspectionCard';
import ReportCard from '../components/dashboard/ReportCard';
import StatusCard from '../components/dashboard/StatusCard';
import { Inspection, Report } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for inspections
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
    ];

    // Mock data for reports
    const mockReports: Report[] = [
      {
        Id: '1',
        UserEmail: 'john.doe@example.com',
        Timestamp: new Date().toISOString(),
        ReportData: { datahall: 'Datahall A', status: 'Good', isUrgent: false, temperatureReading: '22C', humidityReading: '50%', securityPassed: true, coolingSystemCheck: true },
        title: 'Monthly Report - Datahall A'
      },
      {
        Id: '2',
        UserEmail: 'jane.smith@example.com',
        Timestamp: new Date().toISOString(),
        ReportData: { datahall: 'Datahall B', status: 'Needs Attention', isUrgent: true, temperatureReading: '25C', humidityReading: '60%', securityPassed: false, coolingSystemCheck: false },
        title: 'Weekly Report - Datahall B'
      },
    ];

    setInspections(mockInspections);
    setReports(mockReports);
  }, []);

  return (
    <Box gap="medium">
      <Grid columns={{ size: 'auto', count: 'fit', min: '250px' }} gap="medium">
        <StatusCard title="Total Inspections" value={inspections.length} />
        <StatusCard title="Open Incidents" value="3" trend="up" color="red" />
        <StatusCard title="Reports Generated" value={reports.length} trend="down" color="green" />
        <StatusCard title="System Uptime" value="99.9%" />
      </Grid>

      <Box>
        <h2 className="text-xl font-semibold mb-4">Recent Inspections</h2>
        <Grid columns={{ size: 'auto', count: 'fit', min: '300px' }} gap="medium">
          {inspections.map((inspection) => (
            <InspectionCard
              key={inspection.Id}
              inspection={inspection}
              onClick={() => navigate(`/inspections/${inspection.Id}`)}
            />
          ))}
        </Grid>
      </Box>

      <Box>
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <Grid columns={{ size: 'auto', count: 'fit', min: '300px' }} gap="medium">
          {reports.map((report) => (
            <ReportCard
              key={report.Id}
              report={report}
              onClick={() => navigate(`/reports/${report.Id}`)}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
