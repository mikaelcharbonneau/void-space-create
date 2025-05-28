import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, FileDown, Calendar, Plus, ArrowLeft, Download } from 'lucide-react';
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

interface Incident {
  id: string;
  location: string;
  datahall: string;
  rack_number: string;
  part_type: string;
  part_identifier: string;
  u_height?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
  description: string;
  comments?: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
    new Date()
  ]);

  useEffect(() => {
    if (id) {
      fetchReportDetails(id);
    } else {
      fetchReports();
    }
  }, [id]);

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

  const fetchReportDetails = async (reportId: string) => {
    try {
      setLoading(true);
      
      // Fetch report details
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) throw reportError;
      setSelectedReport(reportData);

      // Fetch related incidents
      if (reportData) {
        const { data: incidentData, error: incidentError } = await supabase
          .from('incidents')
          .select('*')
          .gte('created_at', reportData.date_range_start)
          .lte('created_at', reportData.date_range_end)
          .eq('location', reportData.datacenter)
          .eq('datahall', reportData.datahall)
          .order('created_at', { ascending: false });

        if (incidentError) throw incidentError;
        setIncidents(incidentData || []);

        // Update total_incidents count in the report if it doesn't match
        if (reportData.total_incidents !== incidentData?.length) {
          const { error: updateError } = await supabase
            .from('reports')
            .update({ total_incidents: incidentData?.length || 0 })
            .eq('id', reportId);

          if (updateError) throw updateError;
        }
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!incidents.length) return;

    const headers = [
      'ID',
      'Location',
      'Data Hall',
      'Rack Number',
      'Part Type',
      'Part ID',
      'U-Height',
      'Severity',
      'Status',
      'Created At',
      'Description',
      'Comments'
    ];

    const csvContent = [
      headers.join(','),
      ...incidents.map(incident => [
        incident.id,
        incident.location,
        incident.datahall,
        incident.rack_number,
        incident.part_type,
        incident.part_identifier,
        incident.u_height || '',
        incident.severity,
        incident.status,
        format(new Date(incident.created_at), 'yyyy-MM-dd HH:mm:ss'),
        `"${incident.description.replace(/"/g, '""')}"`,
        `"${incident.comments?.replace(/"/g, '""') || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${selectedReport?.id}_incidents.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (id && selectedReport) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Reports
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-semibold mb-2">{selectedReport.title}</h1>
                <p className="text-gray-600">
                  {format(new Date(selectedReport.generated_at), 'PPpp')}
                </p>
              </div>
              <button
                onClick={downloadCSV}
                disabled={!incidents.length}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  incidents.length 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                Download CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Report Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Datacenter</dt>
                    <dd className="font-medium">{selectedReport.datacenter}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Data Hall</dt>
                    <dd className="font-medium">{selectedReport.datahall}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Date Range</dt>
                    <dd className="font-medium">
                      {format(new Date(selectedReport.date_range_start), 'PP')} - {format(new Date(selectedReport.date_range_end), 'PP')}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Statistics</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Total Incidents</dt>
                    <dd className="font-medium">{incidents.length}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="font-medium">{selectedReport.status}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Incidents</h3>
            {incidents.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No incidents found for this report.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rack</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {incidents.map((incident) => (
                      <tr key={incident.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {incident.rack_number}
                          {incident.u_height && <span className="text-gray-500 ml-1">({incident.u_height})</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {incident.part_type} - {incident.part_identifier}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="max-w-md">
                            <p className="line-clamp-2">{incident.description}</p>
                            {incident.comments && (
                              <p className="text-gray-500 mt-1 line-clamp-1">{incident.comments}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            incident.severity === 'critical' 
                              ? 'bg-red-100 text-red-800'
                              : incident.severity === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : incident.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            incident.status === 'open'
                              ? 'bg-red-100 text-red-800'
                              : incident.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {incident.status.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(incident.created_at), 'PP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view incident reports</p>
        </div>
        <button
          onClick={() => navigate('/reports/new')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Report
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/reports/${report.id}`)}
          >
            <div 
              className="relative h-48 bg-cover bg-center"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg)`,
              }}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-medium text-white mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-200">{report.datacenter} - {report.datahall}</p>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Issues: {report.total_incidents}</span>
                <span>{format(new Date(report.generated_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;