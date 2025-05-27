import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileDown, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Report {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: any;
  datacenter: string;
  datahall: string;
  issues_reported: number;
  state: string;
  user_full_name: string;
  walkthrough_id: number;
}

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - new Date().getDay())), // Start of current week
    new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)) // End of current week
  ]);
  const [selectedDatacenter, setSelectedDatacenter] = useState('');
  const [selectedDatahall, setSelectedDatahall] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const datacenters = [
    'Canada - Quebec',
    'Norway - Enebakk',
    'Norway - Rjukan',
    'United States - Dallas',
    'United States - Houston'
  ];

  const datahalls = {
    'Canada - Quebec': ['Island 1', 'Island 8', 'Island 9', 'Island 10', 'Island 11', 'Island 12', 'Green Nitrogen'],
    'Norway - Enebakk': ['Flying Whale'],
    'Norway - Rjukan': ['Flying Whale'],
    'United States - Dallas': ['Island 1', 'Island 2', 'Island 3', 'Island 4'],
    'United States - Houston': ['H20 Lab']
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange, selectedDatacenter, selectedDatahall, selectedStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (dateRange[0] && dateRange[1]) {
        query = query.gte('Timestamp', dateRange[0].toISOString())
                    .lte('Timestamp', dateRange[1].toISOString());
      }

      if (selectedDatacenter) {
        query = query.eq('datacenter', selectedDatacenter);
      }

      if (selectedDatahall) {
        query = query.eq('datahall', selectedDatahall);
      }

      if (selectedStatus) {
        query = query.eq('state', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = () => {
    navigate('/reports/new');
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const filteredData = reports.filter(report => {
        const matchesSearch = report.user_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.datacenter.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });

      const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'Healthy':
        return 'bg-emerald-100 text-emerald-800';
      case 'Warning':
        return 'bg-amber-100 text-amber-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (issues: number) => {
    if (issues > 5) return '⚠️';
    if (issues > 0) return '🔍';
    return '✅';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reports</h1>
          <p className="text-gray-600">View and manage your reports</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            Generate Report
          </button>
          <button
            onClick={handleCreateReport}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-4">
              <DatePicker
                selected={dateRange[0]}
                onChange={(date) => setDateRange([date, dateRange[1]])}
                selectsStart
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholderText="Start Date"
              />
              <DatePicker
                selected={dateRange[1]}
                onChange={(date) => setDateRange([dateRange[0], date])}
                selectsEnd
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                minDate={dateRange[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholderText="End Date"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datacenter
            </label>
            <select
              value={selectedDatacenter}
              onChange={(e) => {
                setSelectedDatacenter(e.target.value);
                setSelectedDatahall('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Datacenters</option>
              {datacenters.map(dc => (
                <option key={dc} value={dc}>{dc}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Hall
            </label>
            <select
              value={selectedDatahall}
              onChange={(e) => setSelectedDatahall(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={!selectedDatacenter}
            >
              <option value="">All Data Halls</option>
              {selectedDatacenter && datahalls[selectedDatacenter as keyof typeof datahalls].map(hall => (
                <option key={hall} value={hall}>{hall}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileDown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or create a new report
          </p>
          <button
            onClick={handleCreateReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.Id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/reports/${report.Id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getTypeIcon(report.issues_reported)}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {report.datacenter}
                      </h3>
                      <p className="text-sm text-gray-600">{report.datahall}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.state)}`}>
                    {report.state}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {`Issues reported: ${report.issues_reported}`}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(report.Timestamp), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;