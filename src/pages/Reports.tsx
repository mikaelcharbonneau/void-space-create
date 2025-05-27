import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Calendar,
  CheckBoxGroup,
  Grid,
  Heading,
  Layer,
  Select,
  Spinner,
  Text
} from 'grommet';
import { Filter, RefreshCw, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { locations } from '../utils/locationMapping';

interface ReportFilters {
  fromDate: string | null;
  toDate: string | null;
  parts: string[];
  severityLevels: string[];
  datacenters: string[];
  datahalls: string[];
}

const Reports = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    fromDate: null,
    toDate: null,
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
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (filters.fromDate) {
        query = query.gte('Timestamp', filters.fromDate);
      }
      if (filters.toDate) {
        query = query.lte('Timestamp', filters.toDate);
      }
      if (filters.datacenters.length > 0) {
        query = query.in('datacenter', filters.datacenters);
      }
      if (filters.datahalls.length > 0) {
        query = query.in('datahall', filters.datahalls);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by parts and severity if selected
      let filteredData = data || [];
      if (filters.parts.length > 0 || filters.severityLevels.length > 0) {
        filteredData = filteredData.filter(report => {
          const hasSelectedParts = filters.parts.length === 0 || report.ReportData.racks?.some((rack: any) => 
            (filters.parts.includes('Power Supply Unit') && rack.devices.powerSupplyUnit) ||
            (filters.parts.includes('Power Distribution Unit') && rack.devices.powerDistributionUnit) ||
            (filters.parts.includes('Rear Door Heat Exchanger') && rack.devices.rearDoorHeatExchanger)
          );

          const matchesSeverity = filters.severityLevels.length === 0 || 
            filters.severityLevels.includes(report.state);

          return hasSelectedParts && matchesSeverity;
        });
      }

      setReports(filteredData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    await fetchReports();
    setGenerating(false);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      fromDate: null,
      toDate: null,
      parts: [],
      severityLevels: [],
      datacenters: [],
      datahalls: []
    });
  };

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
            primary
            icon={<RefreshCw />}
            label="Generate Report"
            onClick={handleGenerateReport}
            disabled={generating}
          />
        </Box>
      </Box>

      {loading ? (
        <Box align="center" justify="center" height="medium">
          <Spinner />
          <Text margin={{ top: 'small' }}>Loading reports...</Text>
        </Box>
      ) : reports.length === 0 ? (
        <Box
          background="light-2"
          pad="large"
          align="center"
          round="small"
        >
          <Text>No reports found. Try adjusting your filters.</Text>
        </Box>
      ) : (
        <Grid columns={{ count: 'fit', size: 'medium' }} gap="medium">
          {reports.map((report) => (
            <Box
              key={report.Id}
              background="light-1"
              round="small"
              pad="medium"
              onClick={() => navigate(`/reports/${report.Id}`)}
              hoverIndicator
            >
              <Text weight="bold">{report.datacenter} - {report.datahall}</Text>
              <Text size="small" color="dark-6">
                {format(new Date(report.Timestamp), 'PPp')}
              </Text>
              <Box
                direction="row"
                gap="small"
                margin={{ top: 'small' }}
                wrap
              >
                <Box
                  background={report.state === 'Critical' ? 'status-critical' : 
                            report.state === 'Warning' ? 'status-warning' : 
                            'status-ok'}
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  round="small"
                >
                  <Text size="small">{report.state}</Text>
                </Box>
                <Box
                  background="light-3"
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  round="small"
                >
                  <Text size="small">{report.issues_reported} issues</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      {showFilters && (
        <Layer
          position="right"
          full="vertical"
          modal
          onClickOutside={() => setShowFilters(false)}
          onEsc={() => setShowFilters(false)}
        >
          <Box
            pad="medium"
            gap="medium"
            width="medium"
            background="light-1"
            height="100vh"
            overflow="auto"
          >
            <Box direction="row" justify="between" align="center">
              <Heading level={3} margin="none">Filters</Heading>
              <Button
                icon={<X />}
                onClick={() => setShowFilters(false)}
                plain
              />
            </Box>

            <Box gap="medium">
              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Date Range</Text>
                <Box gap="small">
                  <Calendar
                    date={filters.fromDate}
                    onSelect={date => setFilters(prev => ({ ...prev, fromDate: date }))}
                    bounds={['2020-01-01', '2030-12-31']}
                    header={({ date }) => format(date, 'MMMM yyyy')}
                  />
                  <Calendar
                    date={filters.toDate}
                    onSelect={date => setFilters(prev => ({ ...prev, toDate: date }))}
                    bounds={['2020-01-01', '2030-12-31']}
                    header={({ date }) => format(date, 'MMMM yyyy')}
                  />
                </Box>
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Parts</Text>
                <CheckBoxGroup
                  options={partOptions}
                  value={filters.parts}
                  onChange={({ value }) => setFilters(prev => ({ ...prev, parts: value }))}
                />
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Severity Levels</Text>
                <CheckBoxGroup
                  options={severityOptions}
                  value={filters.severityLevels}
                  onChange={({ value }) => setFilters(prev => ({ ...prev, severityLevels: value }))}
                />
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Datacenters</Text>
                <Select
                  multiple
                  options={locations}
                  value={filters.datacenters}
                  onChange={({ value }) => setFilters(prev => ({ ...prev, datacenters: value }))}
                  placeholder="Select datacenters"
                />
              </Box>

              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Data Halls</Text>
                <Select
                  multiple
                  options={datahallOptions}
                  value={filters.datahalls}
                  onChange={({ value }) => setFilters(prev => ({ ...prev, datahalls: value }))}
                  placeholder="Select data halls"
                />
              </Box>
            </Box>

            <Box
              direction="row"
              gap="small"
              margin={{ top: 'medium' }}
              justify="between"
            >
              <Button
                label="Clear Filters"
                onClick={clearFilters}
              />
              <Button
                primary
                label="Apply Filters"
                onClick={handleGenerateReport}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Reports;