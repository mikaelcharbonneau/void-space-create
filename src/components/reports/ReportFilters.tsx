
import { useState } from 'react';
import { Search } from 'lucide-react';

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
}

const ReportFilters = ({ onFilterChange }: ReportFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [status, setStatus] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      search: searchTerm,
      dateRange,
      status
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilterChange();
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            handleFilterChange();
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All dates</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
        
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilterChange();
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>
    </div>
  );
};

export default ReportFilters;
