
import { useState, useEffect } from 'react';
import { Box, Heading, Grid } from 'grommet';
import StatusCard from '../components/dashboard/StatusCard';
import InspectionCard from '../components/dashboard/InspectionCard';
import ReportCard from '../components/dashboard/ReportCard';

const Dashboard = () => {
  const [stats] = useState({
    totalInspections: 0,
    activeIncidents: 0,
    reportsGenerated: 0,
    systemHealth: 95
  });

  const [inspections] = useState([
    {
      id: '1',
      title: 'Server Room A Inspection',
      status: 'Healthy' as const,
      date: '2024-01-15',
      location: 'Building 1, Floor 2'
    },
    {
      id: '2', 
      title: 'Network Equipment Check',
      status: 'Warning' as const,
      date: '2024-01-14',
      location: 'Building 1, Floor 3'
    }
  ]);

  const [reports] = useState([
    {
      id: '1',
      title: 'Monthly Security Report',
      status: 'published',
      date: '2024-01-10',
      type: 'Security Audit'
    }
  ]);

  useEffect(() => {
    // Fetch data from Supabase or any other source
    // For now, using dummy data
  }, []);

  return (
    <Box pad="medium" gap="medium">
      <Heading level={2} margin="none">
        Dashboard
      </Heading>

      <Grid
        columns={{ count: 'fit', size: 'medium' }}
        gap="medium"
      >
        <StatusCard
          title="Total Inspections"
          value={stats.totalInspections}
          status="good"
          subtitle="This Month"
        />
        <StatusCard
          title="Active Incidents"
          value={stats.activeIncidents}
          status="warning"
          subtitle="Critical Issues"
        />
        <StatusCard
          title="Reports Generated"
          value={stats.reportsGenerated}
          status="good"
          subtitle="Last Quarter"
        />
        <StatusCard
          title="System Health"
          value={stats.systemHealth}
          status={stats.systemHealth > 90 ? 'good' : stats.systemHealth > 70 ? 'warning' : 'critical'}
          subtitle="Overall Status"
        />
      </Grid>

      <Box>
        <Heading level={3} margin={{ bottom: 'small' }}>
          Recent Inspections
        </Heading>
        <Grid
          columns={{ count: 'fit', size: 'small' }}
          gap="medium"
        >
          {inspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </Grid>
      </Box>

      <Box>
        <Heading level={3} margin={{ bottom: 'small' }}>
          Recent Reports
        </Heading>
        <Grid
          columns={{ count: 'fit', size: 'small' }}
          gap="medium"
        >
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
