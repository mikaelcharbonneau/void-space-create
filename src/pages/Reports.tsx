import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  Spinner,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Meter,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody
} from 'grommet';
import { StatusWarning, FormPrevious, Download } from 'grommet-icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface ReportData {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    datahall: string;
    status: string;
    isUrgent: boolean;
    temperatureReading: string;
    humidityReading: string;
    comments?: string;
    securityPassed: boolean;
    coolingSystemCheck: boolean;
    [key: string]: any;
  };
}

const Reports = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSingleReport(id);
    } else {
      fetchAllReports();
    }
  }, [id]);

  const fetchAllReports = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (supabaseError) throw supabaseError;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleReport = async (reportId: string) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('AuditReports')
        .select('*')
        .eq('Id', reportId)
        .single();
      
      if (supabaseError) throw supabaseError;
      if (data) {
        setReports([data]);
      } else {
        throw new Error('Report not found');
      }
    } catch (error: any) {
      console.error('Error fetching report:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report: ReportData) => {
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${report.Id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box align="center" justify="center" height="medium" pad="large">
        <Spinner size="medium" />
        <Text margin={{ top: 'small' }}>Loading reports...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box pad="medium">
        <Button
          icon={<FormPrevious />}
          label="Back"
          onClick={() => navigate(-1)}
          margin={{ bottom: 'medium' }}
        />
        <Box
          background="status-error"
          pad="medium"
          round="small"
          direction="row"
          gap="small"
          align="center"
        >
          <StatusWarning color="white" />
          <Text color="white">Error loading reports: {error}</Text>
        </Box>
      </Box>
    );
  }

  // Show all reports if no ID is provided
  if (!id) {
    return (
      <Box pad="medium">
        <Heading level={2} margin={{ bottom: 'medium' }}>Reports</Heading>
        <Grid columns={{ count: 'fit', size: 'medium' }} gap="medium">
          {reports.map((report) => (
            <Card key={report.Id} background="light-1" onClick={() => navigate(`/reports/${report.Id}`)}>
              <CardHeader pad="medium">
                <Text weight="bold">{report.ReportData.datahall}</Text>
              </CardHeader>
              <CardBody pad="medium">
                <Box gap="small">
                  <Text size="small">Submitted by: {report.UserEmail}</Text>
                  <Text size="small">Date: {format(new Date(report.Timestamp), 'PPp')}</Text>
                  <Box 
                    background={report.ReportData.isUrgent ? 'status-critical' : 'status-ok'}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="fit-content"
                  >
                    <Text size="small">{report.ReportData.isUrgent ? 'Urgent' : 'Normal'}</Text>
                  </Box>
                </Box>
              </CardBody>
              <CardFooter pad="medium" background="light-2">
                <Button label="View Details" onClick={() => navigate(`/reports/${report.Id}`)} />
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Box>
    );
  }

  // Show single report details
  const report = reports[0];
  if (!report) {
    return (
      <Box pad="medium">
        <Button
          icon={<FormPrevious />}
          label="Back to Reports"
          onClick={() => navigate('/reports')}
          margin={{ bottom: 'medium' }}
        />
        <Box
          background="light-2"
          pad="large"
          round="small"
          align="center"
          justify="center"
          height="medium"
        >
          <Text size="xlarge">Report not found</Text>
          <Text>The requested report could not be found or has been deleted.</Text>
        </Box>
      </Box>
    );
  }

  const temperatureValue = parseFloat(report.ReportData.temperatureReading);
  const humidityValue = parseFloat(report.ReportData.humidityReading);

  return (
    <Box pad="medium">
      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
        <Button
          icon={<FormPrevious />}
          label="Back to Reports"
          onClick={() => navigate('/reports')}
        />
        <Button
          icon={<Download />}
          label="Download Report"
          onClick={() => downloadReport(report)}
          primary
        />
      </Box>

      <Heading level={2}>
        Audit Report - {report.ReportData.datahall}
      </Heading>
      <Text margin={{ bottom: 'medium' }}>
        Generated on {format(new Date(report.Timestamp), 'PPp')}
      </Text>

      <Grid columns={['1/2', '1/2']} gap="medium" margin={{ bottom: 'medium' }}>
        <Card background="light-1" pad="medium">
          <CardHeader>
            <Heading level={3} margin="none">
              General Information
            </Heading>
          </CardHeader>
          <CardBody>
            <Box gap="small">
              <Box direction="row" justify="between">
                <Text weight="bold">Report ID:</Text>
                <Text>{report.Id}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Submitted By:</Text>
                <Text>{report.UserEmail}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Date & Time:</Text>
                <Text>{format(new Date(report.Timestamp), 'PPp')}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Data Hall:</Text>
                <Text>{report.ReportData.datahall}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Status:</Text>
                <Box
                  background={report.ReportData.isUrgent ? 'status-critical' : 'status-ok'}
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  round="small"
                >
                  <Text size="small">{report.ReportData.isUrgent ? 'Urgent' : 'Normal'}</Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>

        <Card background="light-1" pad="medium">
          <CardHeader>
            <Heading level={3} margin="none">
              Environmental Readings
            </Heading>
          </CardHeader>
          <CardBody>
            <Box gap="medium" pad={{ vertical: 'small' }}>
              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Temperature</Text>
                <Box align="center" direction="row" gap="small">
                  <Meter
                    type="bar"
                    background="light-2"
                    values={[{
                      value: temperatureValue,
                      color: temperatureValue > 27 ? 'status-critical' :
                             temperatureValue < 18 ? 'status-warning' : 'status-ok'
                    }]}
                    max={40}
                    size="small"
                  />
                  <Text>{temperatureValue}°C</Text>
                </Box>
              </Box>
              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Humidity</Text>
                <Box align="center" direction="row" gap="small">
                  <Meter
                    type="bar"
                    background="light-2"
                    values={[{
                      value: humidityValue,
                      color: humidityValue > 70 ? 'status-critical' :
                             humidityValue < 30 ? 'status-warning' : 'status-ok'
                    }]}
                    max={100}
                    size="small"
                  />
                  <Text>{humidityValue}%</Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Grid>

      <Card background="light-1" pad="medium" margin={{ bottom: 'medium' }}>
        <CardHeader>
          <Heading level={3} margin="none">
            System Checks
          </Heading>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col">
                  <Text weight="bold">Check Item</Text>
                </TableCell>
                <TableCell scope="col">
                  <Text weight="bold">Status</Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Text>Security Systems</Text>
                </TableCell>
                <TableCell>
                  <Box
                    background={report.ReportData.securityPassed ? 'status-ok' : 'status-critical'}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="fit-content"
                  >
                    <Text size="small">{report.ReportData.securityPassed ? 'PASSED' : 'FAILED'}</Text>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text>Cooling System</Text>
                </TableCell>
                <TableCell>
                  <Box
                    background={report.ReportData.coolingSystemCheck ? 'status-ok' : 'status-critical'}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="fit-content"
                  >
                    <Text size="small">{report.ReportData.coolingSystemCheck ? 'OPERATIONAL' : 'ISSUE DETECTED'}</Text>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {report.ReportData.comments && (
        <Card background="light-1" pad="medium">
          <CardHeader>
            <Heading level={3} margin="none">
              Additional Comments
            </Heading>
          </CardHeader>
          <CardBody>
            <Text>{report.ReportData.comments}</Text>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default Reports;