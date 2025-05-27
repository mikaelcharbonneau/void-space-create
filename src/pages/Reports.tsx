import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileDown, Calendar, Plus } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Report {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  date_range: {
    start: string;
    end: string;
  };
  filters: {
    severity?: string[];
    locations?: string[];
    status?: string[];
  };
  issues: any[];
  summary: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    subDays(new Date(), 7),
    new Date()
  ]);
  const [filters, setFilters] = useState({
    severity: [] as string[],
    locations: [] as string[],
    status: [] as string[]
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      alert('Please select a date range');
      return;
    }

    setGenerating(true);
    try {
      // Fetch incidents based on filters
      let query = supabase
        .from('incidents')
        .select('*')
        .gte('created_at', dateRange[0].toISOString())
        .lte('created_at', dateRange[1].toISOString());

      if (filters.severity.length > 0) {
        query = query.in('severity', filters.severity);
      }
      if (filters.locations.length > 0) {
        query = query.in('location', filters.locations);
      }
      if (filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      const { data: issues, error: issuesError } = await query;
      if (issuesError) throw issuesError;

      // Generate report summary
      const summary = generateReportSummary(issues || []);

      // Create report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert([{
          title: `Incident Report ${format(dateRange[0], 'MMM d')} - ${format(dateRange[1], 'MMM d, yyyy')}`,
          user_id: user?.id,
          date_range: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString()
          },
          filters,
          issues: issues || [],
          summary
        }])
        .select()
        .single();

      if (reportError) throw reportError;

      await fetchReports();
      navigate(`/reports/${report.id}`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateReportSummary = (issues: any[]) => {
    const totalIssues = issues.length;
    const bySeverity = issues.reduce((acc: any, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {});

    return `Report contains ${totalIssues} issue${totalIssues !== 1 ? 's' : ''} ` +
      `(${Object.entries(bySeverity)
        .map(([severity, count]) => `${count} ${severity}`)
        .join(', ')})`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view incident reports</p>
        </div>
      </div>

      {/* Report Generation Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium mb-6">Generate New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              maxDate={new Date()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <div className="space-y-2">
              {['critical', 'high', 'medium', 'low'].map(severity => (
                <label key={severity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes(severity)}
                    onChange={(e) => {
                      setFilters(prev => ({
                        ...prev,
                        severity: e.target.checked
                          ? [...prev.severity, severity]
                          : prev.severity.filter(s => s !== severity)
                      }));
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 capitalize">{severity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="space-y-2">
              {['open', 'in-progress', 'resolved'].map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      setFilters(prev => ({
                        ...prev,
                        status: e.target.checked
                          ? [...prev.status, status]
                          : prev.status.filter(s => s !== status)
                      }));
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={generating || !dateRange[0] || !dateRange[1]}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Generated Reports List */}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
          <p className="text-gray-600 mb-6">
            Generate your first report using the filters above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/reports/${report.id}`)}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {report.summary}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </div>
                  <span className="text-emerald-600">
                    {report.issues.length} issues
                  </span>
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