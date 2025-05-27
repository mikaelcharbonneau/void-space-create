import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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
  CheckBoxGroup,
  Select,
  Layer
} from 'grommet';
import { Filter, Download, RefreshCw, X } from 'lucide-react';
import { format, isAfter, isBefore, isEqual } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { locations } from '../utils/locationMapping';

interface ReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  parts: string[];
  severityLevels: string[];
  datacenters: string[];
  datahalls: string[];
}

const Reports = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: null,
    endDate: null,
    parts: [],
    severityLevels: [],
    datacenters: [],
    datahalls: []
  });

  const partOptions = [
    'Power Supply Unit',
    'Power Distribution Unit',
    'Rear Door Heat Exchanger'
  ];

  const severityOptions = [
    'Critical',
    'High',
    'Medium',
    'Low'
  ];

  const datahallOptions = [
    'Island 1',
    'Island 8',
    'Island 9',
    'Island 10',
    'Island 11',
    'Island 12',
    'Green Nitrogen'
  ];

  useEffect(() => {
    if (id) {
      fetchSingleReport(id);
    }
  }, [id]);

  const fetchSingleReport = async (reportId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .eq('Id', reportId)
        .single();
      
      if (error) throw error;
      if (data) {
        setReports([data]);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      let query = supabase.from('AuditReports').select('*');

      if (filters.startDate) {
        query = query.gte('Timestamp', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('Timestamp', filters.endDate.toISOString());
      }
      if (filters.datacenters.length > 0) {
        query = query.in('datacenter', filters.datacenters);
      }
      if (filters.datahalls.length > 0) {
        query = query.in('datahall', filters.datahalls);
      }

      const { data, error } = await query.order('Timestamp', { ascending: false });

      if (error) throw error;

      let filteredData = data || [];

      // Filter by parts and severity if selected
      if (filters.parts.length > 0 || filters.severityLevels.length > 0) {
        filteredData = filteredData.filter(report => {
          const hasSelectedParts = filters.parts.length === 0 || report.ReportData.racks?.some((rack: any) =>
            filters.parts.some(part => {
              if (part === 'Power Supply Unit' && rack.devices.powerSupplyUnit) return true;
              if (part === 'Power Distribution Unit' && rack.devices.powerDistributionUnit) return true;
              if (part === 'Rear Door Heat Exchanger' && rack.devices.rearDoorHeatExchanger) return true;
              return false;
            })
          );

          const hasSelectedSeverity = filters.severityLevels.length === 0 || 
            filters.severityLevels.includes(report.state);

          return hasSelectedParts && hasSelectedSeverity;
        });
      }

      setReports(filteredData);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
      setShowFilters(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      parts: [],
      severityLevels: [],
      datacenters: [],
      datahalls: []
    });
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(reports, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box align="center\" justify="center\" height="medium">
        <Spinner size="medium" />
        <Text margin={{ top: 'small' }}>Loading report...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium">
      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
        <Heading level={2} margin="none">Reports</Heading>
        <Box direction="row" gap="small">
          <Button
            icon={<Filter />}
            label="Filters"
            onClick={() => setShowFilters(true)}
          />
          <Button
            icon={<Download />}
            label="Download"
            onClick={downloadReport}
            disabled={reports.length === 0}
          />
          <Button
            primary
            icon={generating ? <Spinner /> : <RefreshCw />}
            label={generating ? 'Generating...' : 'Generate Report'}
            onClick={generateReport}
            disabled={generating}
          />
        </Box>
      </Box>

      {/* Filters Modal */}
      {showFilters && (
        <Layer
          onEsc={() => setShowFilters(false)}
          onClickOutside={() => setShowFilters(false)}
        >
          <Box pad="medium" gap="medium" width="large">
            <Box direction="row" justify="between" align="center">
              <Heading level={3} margin="none">Report Filters</Heading>
              <Button icon={<X />} onClick={() => setShowFilters(false)} plain />
            </Box>

            <Box gap="medium">
              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Date Range</Text>
                <Box direction="row" gap="small">
                  <Box basis="1/2">
                    <Text size="small">From</Text>
                    <DatePicker
                      selected={filters.startDate}
                      onChange={(date) => setFilters({ ...filters, startDate: date })}
                      maxDate={filters.endDate || new Date()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholderText="Select start date"
                    />
                  </Box>
                  <Box basis="1/2">
                    <Text size="small">To</Text>
                    <DatePicker
                      selected={filters.endDate}
                      onChange={(date) => setFilters({ ...filters, endDate: date })}
                      minDate={filters.startDate}
                      maxDate={new Date()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholderText="Select end date"
                    />
                  </Box>
                </Box>
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Parts</Text>
                <CheckBoxGroup
                  options={partOptions}
                  value={filters.parts}
                  onChange={({ value }) => setFilters({ ...filters, parts: value })}
                />
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Severity Levels</Text>
                <CheckBoxGroup
                  options={severityOptions}
                  value={filters.severityLevels}
                  onChange={({ value }) => setFilters({ ...filters, severityLevels: value })}
                />
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Datacenters</Text>
                <Select
                  multiple
                  options={locations}
                  value={filters.datacenters}
                  onChange={({ value }) => setFilters({ ...filters, datacenters: value })}
                  placeholder="Select datacenters"
                />
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Data Halls</Text>
                <Select
                  multiple
                  options={datahallOptions}
                  value={filters.datahalls}
                  onChange={({ value }) => setFilters({ ...filters, datahalls: value })}
                  placeholder="Select data halls"
                />
              </Box>
            </Box>

            <Box direction="row" gap="small" justify="end" margin={{ top: 'medium' }}>
              <Button label="Reset" onClick={resetFilters} />
              <Button label="Apply Filters" onClick={generateReport} primary />
            </Box>
          </Box>
        </Layer>
      )}

      {/* Reports Grid */}
      <Grid columns={{ count: 'fit', size: 'medium' }} gap="medium">
        {reports.map((report) => (
          <Card key={report.Id} background="light-1" onClick={() => navigate(`/reports/${report.Id}`)}>
            <CardHeader pad="medium">
              <Text weight="bold">{report.datahall}</Text>
            </CardHeader>
            <CardBody pad="medium">
              <Box gap="small">
                <Text size="small">Datacenter: {report.datacenter}</Text>
                <Text size="small">Issues: {report.issues_reported}</Text>
                <Text size="small">Date: {format(new Date(report.Timestamp), 'PPp')}</Text>
                <Box 
                  background={report.state === 'Critical' ? 'status-critical' : 'status-warning'}
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  round="small"
                  width="fit-content"
                >
                  <Text size="small">{report.state}</Text>
                </Box>
              </Box>
            </CardBody>
            <CardFooter pad="medium" background="light-2">
              <Button 
                label="View Details" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/reports/${report.Id}`);
                }} 
              />
            </CardFooter>
          </Card>
        ))}
      </Grid>

      {reports.length === 0 && !loading && (
        <Box
          background="light-2"
          pad="large"
          round="small"
          align="center"
          margin={{ top: 'medium' }}
        >
          <Text>No reports found. Try adjusting your filters or generate a new report.</Text>
        </Box>
      )}
    </Box>
  );
};

export default Reports;