import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, Filter, Download, FileDown, Calendar } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Report {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  datacenter: string;
  datahall: string;
  issues_reported: number;
  state: string;
  walkthrough_id: number;
  user_full_name: string;
  ReportData: any;
}

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDatacenter, setSelectedDatacenter] = useState('');
  const [selectedDatahall, setSelectedDatahall] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = (reports: Report[]) => {
    return reports.filter(report => {
      const matchesSearch = 
        report.datacenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.datahall.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.user_full_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange = (!startDate || !endDate) ? true :
        isWithinInterval(new Date(report.Timestamp), {
          start: startDate,
          end: endDate
        });

      const matchesDatacenter = !selectedDatacenter || report.datacenter === selectedDatacenter;
      const matchesDatahall = !selectedDatahall || report.datahall === selectedDatahall;
      const matchesSeverity = !selectedSeverity || report.state === selectedSeverity;

      const matchesPart = !selectedPart || (report.ReportData.racks || []).some((rack: any) => 
        (rack.devices.powerSupplyUnit && selectedPart === 'PSU') ||
        (rack.devices.powerDistributionUnit && selectedPart === 'PDU') ||
        (rack.devices.rearDoorHeatExchanger && selectedPart === 'RDHX')
      );

      return matchesSearch && matchesDateRange && matchesDatacenter && 
             matchesDatahall && matchesSeverity && matchesPart;
    });
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const filteredData = filterReports(reports);
      
      // Transform data for report
      const reportData = {
        generatedAt: new Date().toISOString(),
        dateRange: {
          start: startDate?.toISOString(),
          end: endDate?.toISOString()
        },
        filters: {
          datacenter: selectedDatacenter,
          datahall: selectedDatahall,
          part: selectedPart,
          severity: selectedSeverity
        },
        summary: {
          total: filteredData.length,
          byState: filteredData.reduce((acc: any, curr) => {
            acc[curr.state] = (acc[curr.state] || 0) + 1;
            return acc;
          }, {}),
          totalIssues: filteredData.reduce((sum, curr) => sum + curr.issues_reported, 0)
        },
        reports: filteredData
      };

      // Generate and download report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const filteredReports = filterReports(reports);

  const uniqueDatacenters = Array.from(new Set(reports.map(r => r.datacenter)));
  const uniqueDatahalls = Array.from(new Set(reports.map(r => r.datahall)));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={generateReport}
            disabled={generatingReport}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 disabled:opacity-50"
          >
            {generatingReport ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex gap-4">
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Datacenter</label>
              <select
                value={selectedDatacenter}
                onChange={(e) => setSelectedDatacenter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Datacenters</option>
                {uniqueDatacenters.map(dc => (
                  <option key={dc} value={dc}>{dc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Hall</label>
              <select
                value={selectedDatahall}
                onChange={(e) => setSelectedDatahall(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Data Halls</option>
                {uniqueDatahalls.map(dh => (
                  <option key={dh} value={dh}>{dh}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Part</label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Parts</option>
                <option value="PSU">Power Supply Unit</option>
                <option value="PDU">Power Distribution Unit</option>
                <option value="RDHX">Rear Door Heat Exchanger</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Severities</option>
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Datacenter</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data Hall</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr 
                    key={report.Id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">#{report.walkthrough_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.datacenter}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.datahall}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.issues_reported}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.state === 'Healthy' 
                          ? 'bg-green-100 text-green-800'
                          : report.state === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.user_full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(report.Timestamp), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        onClick={() => navigate(`/reports/${report.Id}`)}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        View Details
                      </button>
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