import { useState, useEffect } from 'react';
import { Box, Heading, Grid, Text } from 'grommet';
import { StatusGood, StatusWarning, StatusCritical } from 'grommet-icons';
import InspectionCard from '../components/dashboard/InspectionCard';
import ReportCard from '../components/dashboard/ReportCard';
import StatusCard from '../components/dashboard/StatusCard';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInspections: 0,
    activeIncidents: 0,
    reportsGenerated: 0,
    systemHealth: 95
  });
  const [inspections, setInspections] = useState([
    {
      id: '1',
      title: 'Weekly Datacenter Check',
      status: 'Healthy',
      date: '2024-01-25',
      location: 'New York'
    },
    {
      id: '2',
      title: 'Monthly Security Audit',
      status: 'Warning',
      date: '2024-01-15',
      location: 'San Francisco'
    },
    {
      id: '3',
      title: 'Emergency Power System Inspection',
      status: 'Critical',
      date: '2024-01-05',
      location: 'London'
    }
  ]);
  const [reports, setReports] = useState([
    {
      id: '1',
      title: 'Q1 Performance Report',
      status: 'published',
      date: '2024-01-28',
      type: 'Performance'
    },
    {
      id: '2',
      title: 'Security Vulnerability Report',
      status: 'draft',
      date: '2024-01-20',
      type: 'Security'
    },
    {
      id: '3',
      title: 'System Health Report',
      status: 'error',
      date: '2024-01-10',
      type: 'Health'
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
