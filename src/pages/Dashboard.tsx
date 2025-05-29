
import { useState, useEffect } from 'react';
import { Box, Grid, Heading } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusCard from '../components/dashboard/StatusCard';
import InspectionCard from '../components/dashboard/InspectionCard';
import ReportCard from '../components/dashboard/ReportCard';
import { Inspection, Report } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentInspections, setRecentInspections] = useState<Inspection[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    const mockInspections: Inspection[] = [
      {
        Id: '1',
        UserEmail: user?.email || '',
        Timestamp: new Date().toISOString(),
        ReportData: {
          datahall: 'DH-01',
          status: 'completed',
          isUrgent: false,
          temperatureReading: '22°C',
          humidityReading: '45%',
          securityPassed: true,
          coolingSystemCheck: true,
        },
      },
    ];

    const mockReports: Report[] = [
      {
        Id: '1',
        UserEmail: user?.email || '',
        Timestamp: new Date().toISOString(),
        ReportData: {
          datahall: 'DH-01',
          status: 'completed',
          isUrgent: false,
          temperatureReading: '22°C',
          humidityReading: '45%',
          securityPassed: true,
          coolingSystemCheck: true,
        },
        title: 'Monthly Inspection Report',
      },
    ];

    setRecentInspections(mockInspections);
    setRecentReports(mockReports);
  }, [user]);

  return (
    <Box pad="medium" gap="large">
      <Box>
        <Heading level={2} margin="none">
          Welcome back, {user?.email || 'User'}!
        </Heading>
      </Box>

      <Grid
        columns={{ count: 3, size: 'auto' }}
        gap="medium"
        responsive
      >
        <StatusCard
          title="Total Inspections"
          value="24"
          trend="+12%"
        />
        <StatusCard
          title="Pending Issues"
          value="3"
          trend="-8%"
        />
        <StatusCard
          title="Completed Today"
          value="8"
          trend="+25%"
        />
      </Grid>

      <Grid
        columns={{ count: 2, size: 'auto' }}
        gap="large"
        responsive
      >
        <Box>
          <Heading level={3}>Recent Inspections</Heading>
          <Box gap="small">
            {recentInspections.map((inspection) => (
              <InspectionCard 
                key={inspection.Id} 
                inspection={inspection} 
                onClick={() => navigate(`/inspections/${inspection.Id}`)}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Heading level={3}>Recent Reports</Heading>
          <Box gap="small">
            {recentReports.map((report) => (
              <ReportCard 
                key={report.Id} 
                report={report} 
                onClick={() => navigate(`/reports/${report.Id}`)}
              />
            ))}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard;
