import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Issue {
  id: string;
  datacenter: string;
  datahall: string;
  part: string;
  issue: string;
  reported_by: string;
  reported_at: string;
  report_id: string;
}

const Incidents = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false })
        .not('issues_reported', 'eq', 0);

      if (error) throw error;

      // Transform the data to extract issues from ReportData
      const extractedIssues: Issue[] = [];
      data?.forEach(report => {
        if (report.ReportData.racks) {
          report.ReportData.racks.forEach((rack: any) => {
            if (rack.devices.powerSupplyUnit && rack.psuDetails) {
              extractedIssues.push({
                id: `${report.Id}-psu-${rack.id}`,
                datacenter: report.datacenter,
                datahall: report.datahall,
                part: 'Power Supply Unit',
                issue: rack.psuDetails.status,
                reported_by: report.user_full_name,
                reported_at: report.Timestamp,
                report_id: report.Id
              });
            }
            if (rack.devices.powerDistributionUnit && rack.pduDetails) {
              extractedIssues.push({
                id: `${report.Id}-pdu-${rack.id}`,
                datacenter: report.datacenter,
                datahall: report.datahall,
                part: 'Power Distribution Unit',
                issue: rack.pduDetails.status,
                reported_by: report.user_full_name,
                reported_at: report.Timestamp,
                report_id: report.Id
              });
            }
            if (rack.devices.rearDoorHeatExchanger && rack.rdhxDetails) {
              extractedIssues.push({
                id: `${report.Id}-rdhx-${rack.id}`,
                datacenter: report.datacenter,
                datahall: report.datahall,
                part: 'Rear Door Heat Exchanger',
                issue: rack.rdhxDetails.status,
                reported_by: report.user_full_name,
                reported_at: report.Timestamp,
                report_id: report.Id
              });
            }
          });
        }
      });

      setIssues(extractedIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(issue =>
    issue.datacenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.datahall.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.part.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.reported_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Reported Issues</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search issues"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-4 py-2">
          <option>All Parts</option>
          <option>Power Supply Unit</option>
          <option>Power Distribution Unit</option>
          <option>Rear Door Heat Exchanger</option>
        </select>
        <button className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          More Filters
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Datacenter</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data Hall</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Part</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading issues...
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No issues found
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr 
                    key={issue.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/reports/${issue.report_id}`)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.datacenter}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.datahall}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.part}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.issue === 'Healthy' 
                          ? 'bg-green-100 text-green-800'
                          : issue.issue.toLowerCase().includes('critical') || issue.issue.toLowerCase().includes('alarm')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.issue}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.reported_by}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{format(new Date(issue.reported_at), 'MMM d, yyyy')}</td>
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

export default Incidents;