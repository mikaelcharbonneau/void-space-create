
import { useState } from 'react';
import { Box, Select, TextInput, Button } from 'grommet';
import { Search } from 'grommet-icons';

interface ReportFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    status: string;
    dateRange: string;
  }) => void;
}

const ReportFilters = ({ onFiltersChange }: ReportFiltersProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const handleFiltersChange = () => {
    onFiltersChange({
      search,
      status,
      dateRange
    });
  };

  return (
    <Box direction="row" gap="medium" align="center" wrap>
      <Box width="medium">
        <TextInput
          icon={<Search />}
          placeholder="Search reports..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Box>
      
      <Select
        options={['all', 'published', 'draft', 'error']}
        value={status}
        onChange={({ value }) => setStatus(value)}
        placeholder="Status"
      />
      
      <Select
        options={['all', 'last-7-days', 'last-30-days', 'last-90-days']}
        value={dateRange}
        onChange={({ value }) => setDateRange(value)}
        placeholder="Date Range"
      />
      
      <Button
        label="Apply Filters"
        onClick={handleFiltersChange}
        primary
        size="small"
      />
    </Box>
  );
};

export default ReportFilters;
