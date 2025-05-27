import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, Filter, FileDown, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  datacenter: string;
  datahall: string;
  part: string;
  severity: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    datacenter: '',
    datahall: '',
    part: '',
    severity: ''
  });

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (filters.startDate) {
        query = query.gte('Timestamp', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('Timestamp', filters.endDate.toISOString());
      }
      if (filters.datacenter) {
        query = query.eq('datacenter', filters.datacenter);
      }
      if (filters.datahall) {
        query = query.eq('datahall', filters.datahall);
      }
      if (filters.severity) {
        query = query.eq('state', filters.severity);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Generate PDF report
      const reportData = {
        generatedAt: new Date().toISOString(),
        filters: filters,
        data: data
      };

      // For now, we'll just download as JSON
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
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 disabled:opacity-50"
          >
            <FileText className="w-5 h-5" />
            Generate Report
          </button>
          <button
            onClick={() => navigate('/inspection')}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
          >
            Start Walkthrough
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium mb-6">Report Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholderText="Select start date"
              maxDate={new Date()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholderText="Select end date"
              maxDate={new Date()}
              minDate={filters.startDate}
            />
          </div>

          {/* Datacenter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datacenter
            </label>
            <select
              value={filters.datacenter}
              onChange={(e) => setFilters(prev => ({ ...prev, datacenter: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Datacenters</option>
              <option value="Canada - Quebec">Canada - Quebec</option>
              <option value="Norway - Enebakk">Norway - Enebakk</option>
              <option value="Norway - Rjukan">Norway - Rjukan</option>
              <option value="United States - Dallas">United States - Dallas</option>
              <option value="United States - Houston">United States - Houston</option>
            </select>
          </div>

          {/* Data Hall */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Hall
            </label>
            <select
              value={filters.datahall}
              onChange={(e) => setFilters(prev => ({ ...prev, datahall: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Data Halls</option>
              <option value="Island 1">Island 1</option>
              <option value="Island 8">Island 8</option>
              <option value="Island 9">Island 9</option>
              <option value="Island 10">Island 10</option>
              <option value="Island 11">Island 11</option>
              <option value="Island 12">Island 12</option>
              <option value="Green Nitrogen">Green Nitrogen</option>
            </select>
          </div>

          {/* Part Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Type
            </label>
            <select
              value={filters.part}
              onChange={(e) => setFilters(prev => ({ ...prev, part: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Parts</option>
              <option value="Power Supply Unit">Power Supply Unit</option>
              <option value="Power Distribution Unit">Power Distribution Unit</option>
              <option value="Rear Door Heat Exchanger">Rear Door Heat Exchanger</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Severities</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Generated Reports</h2>
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <FileDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={4}>
                  No reports generated yet. Use the filters above to generate a new report.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;