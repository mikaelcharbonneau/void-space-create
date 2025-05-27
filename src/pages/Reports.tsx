import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileDown, Calendar, Plus, Save, Download } from 'lucide-react';
import { format, subDays, startOfMonth } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  issueTypes: string[];
  assignedTo: string[];
  datacenters: string[];
  severity: string[];
  status: string[];
  searchTerm: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    resolved: 0,
    critical: 0,
    highPriority: 0
  });

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    },
    issueTypes: [],
    assignedTo: [],
    datacenters: [],
    severity: [],
    status: [],
    searchTerm: ''
  });

  useEffect(() => {
    fetchReports();
    fetchSavedFilters();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('reports')
        .select('*')
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end);

      if (filters.severity.length > 0) {
        query = query.in('severity', filters.severity);
      }

      if (filters.datacenters.length > 0) {
        query = query.in('datacenter', filters.datacenters);
      }

      if (filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);

      // Calculate summary statistics
      const stats = {
        total: data.length,
        resolved: data.filter(r => r.status === 'resolved').length,
        critical: data.filter(r => r.severity === 'critical').length,
        highPriority: data.filter(r => r.severity === 'high').length
      };
      setSummaryStats(stats);

    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedFilters = async () => {
    try {
      const { data, error } = await supabase
        .from('report_filters')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_favorite', { ascending: false });

      if (error) throw error;
      setSavedFilters(data || []);
    } catch (error) {
      console.error('Error fetching saved filters:', error);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveFilter = async (name: string) => {
    try {
      const { error } = await supabase
        .from('report_filters')
        .insert([{
          user_id: user?.id,
          name,
          filters: filters
        }]);

      if (error) throw error;
      fetchSavedFilters();
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const handleExport = async () => {
    try {
      // Convert reports data to CSV
      const csvContent = convertToCSV(reports);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `reports_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  return (
    <div className="p-6">
      {/* Header with Summary Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => navigate('/reports/new')}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Total Reports</div>
            <div className="text-2xl font-semibold">{summaryStats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Resolved</div>
            <div className="text-2xl font-semibold text-emerald-600">
              {summaryStats.resolved}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Critical Issues</div>
            <div className="text-2xl font-semibold text-red-600">
              {summaryStats.critical}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">High Priority</div>
            <div className="text-2xl font-semibold text-amber-600">
              {summaryStats.highPriority}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Filters</h2>
          <button
            onClick={() => {
              const name = prompt('Enter a name for this filter combination');
              if (name) handleSaveFilter(name);
            }}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Filter
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value
                })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value
                })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              multiple
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', 
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Datacenter Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datacenter
            </label>
            <select
              multiple
              value={filters.datacenters}
              onChange={(e) => handleFilterChange('datacenters',
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="dc-a">Data Center A</option>
              <option value="dc-b">Data Center B</option>
              <option value="dc-c">Data Center C</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              multiple
              value={filters.status}
              onChange={(e) => handleFilterChange('status',
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Filters</h3>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setFilters(filter.filters)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datacenter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report: any) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/reports/${report.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(report.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.datacenter}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.assigned_to || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;