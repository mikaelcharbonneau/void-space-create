
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button, Card, CardBody, Text, DataTable } from 'grommet';
import { Add, Download, View } from 'grommet-icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Report {
  id: string;
  title: string;
  generated_by: string;
  generated_at: string;
  date_range_start: string;
  date_range_end: string;
  datacenter?: string;
  datahall?: string;
  status: string;
  total_incidents: number;
  report_data: any;
}

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report: Report) => {
    const csvContent = generateCSV(report);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (report: Report) => {
    const headers = ['Report ID', 'Title', 'Generated Date', 'Status', 'Total Incidents', 'Location'];
    const data = [
      report.id,
      report.title,
      format(new Date(report.generated_at), 'yyyy-MM-dd HH:mm:ss'),
      report.status,
      report.total_incidents.toString(),
      `${report.datacenter || ''} ${report.datahall || ''}`.trim()
    ];
    
    return [headers.join(','), data.join(',')].join('\n');
  };

  const columns = [
    {
      property: 'title',
      header: <Text weight="bold">Title</Text>,
      primary: true,
    },
    {
      property: 'generated_at',
      header: <Text weight="bold">Generated</Text>,
      render: (datum: Report) => (
        <Text>{format(new Date(datum.generated_at), 'MMM dd, yyyy')}</Text>
      ),
    },
    {
      property: 'status',
      header: <Text weight="bold">Status</Text>,
      render: (datum: Report) => (
        <Text color={datum.status === 'published' ? 'status-ok' : 'status-warning'}>
          {datum.status}
        </Text>
      ),
    },
    {
      property: 'total_incidents',
      header: <Text weight="bold">Incidents</Text>,
    },
    {
      property: 'actions',
      header: <Text weight="bold">Actions</Text>,
      render: (datum: Report) => (
        <Box direction="row" gap="small">
          <Button
            icon={<View />}
            tip="View Report"
            onClick={() => navigate(`/reports/${datum.id}`)}
            size="small"
            plain
          />
          <Button
            icon={<Download />}
            tip="Download CSV"
            onClick={() => handleDownloadReport(datum)}
            size="small"
            plain
          />
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box pad="medium" align="center" justify="center" fill>
        <Text>Loading reports...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium" gap="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={2} margin={{ top: 'none', bottom: 'none' }}>
          Reports
        </Heading>
        <Button
          icon={<Add />}
          label="Generate Report"
          primary
          onClick={() => navigate('/reports/new')}
        />
      </Box>

      <Card background="white" pad="medium">
        <CardBody>
          {reports.length === 0 ? (
            <Box align="center" pad="large">
              <Text color="text-weak">No reports found</Text>
              <Button
                label="Generate Your First Report"
                onClick={() => navigate('/reports/new')}
                margin={{ top: 'medium' }}
                primary
              />
            </Box>
          ) : (
            <DataTable
              columns={columns}
              data={reports}
              size="medium"
              sortable
            />
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Reports;
