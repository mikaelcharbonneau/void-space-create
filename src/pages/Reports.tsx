import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileDown, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Report {
  id: string;
  title: string;
  generated_by: string;
  generated_at: string;
  date_range_start: string;
  date_range_end: string;
  datacenter: string;
  datahall: string;
  status: string;
  total_incidents: number;
  report_data: any;
}

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
    new Date()
  ]);
  const [selectedDatacenter, setSelectedDatacenter] = useState('');
  const [selectedDatahall, setSelectedDatahall] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);

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

  const handleCreateReport = () => {
    navigate('/reports/new');
  };

  const handleGenerateReport = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      alert('Please select a date range');
      return;
    }

    try {
      setGeneratingReport(true);

      // Fetch incidents for the selected criteria
      const { data: incidents, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .gte('created_at', dateRange[0].toISOString())
        .lte('created_at', dateRange[1].toISOString())
        .order('created_at', { ascending: false });

      if (incidentsError) throw incidentsError;

      // Filter incidents by datacenter/datahall if selected
      const filteredIncidents = incidents?.filter(incident => {
        if (selectedDatacenter && incident.location !== selectedDatacenter) return false;
        if (selectedDatahall && incident.datahall !== selectedDatahall) return false;
        return true;
      });

      // Create new report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert([{
          title: `Incident Report - ${format(dateRange[0], 'MMM d, yyyy')} to ${format(dateRange[1], 'MMM d, yyyy')}`,
          generated_by: user?.id,
          date_range_start: dateRange[0].toISOString(),
          date_range_end: dateRange[1].toISOString(),
          datacenter: selectedDatacenter || 'All Locations',
          datahall: selectedDatahall || 'All Data Halls',
          status: 'generated',
          total_incidents: filteredIncidents?.length || 0,
          report_data: {
            incidents: filteredIncidents,
            filters: {
              datacenter: selectedDatacenter,
              datahall: selectedDatahall,
              status: selectedStatus
            },
            generated_at: new Date().toISOString(),
            generated_by: user?.email
          }
        }])
        .select()
        .single();

      if (reportError) throw reportError;

      // Navigate to the new report
      navigate(`/reports/${report.id}`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusColor = (total_incidents: number) => {
    if (total_incidents === 0) return 'bg-emerald-100 text-emerald-800';
    if (total_incidents > 5) return 'bg-red-100 text-red-800';
    return 'bg-amber-100 text-amber-800';
  };

  const getStatusText = (total_incidents: number) => {
    if (total_incidents === 0) return 'No Issues';
    if (total_incidents > 5) return 'Critical';
    return 'Warning';
  };

  const filteredReports = reports.filter(report =>
    report.datacenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.datahall.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view incident reports</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          <FileDown className="w-5 h-5" />
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Report Filters</h2>
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
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
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
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileDown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600 mb-6">
            Generate a new report using the filters above
          </p>
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            <FileDown className="w-5 h-5 mr-2" />
            Generate Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/reports/${report.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">{report.datacenter}</p>
                    {report.datahall && (
                      <p className="text-sm text-gray-600">{report.datahall}</p>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.total_incidents)}`}>
                    {getStatusText(report.total_incidents)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {`Total Incidents: ${report.total_incidents}`}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(report.generated_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports