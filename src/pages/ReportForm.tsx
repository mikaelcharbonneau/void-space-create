import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { startOfWeek, endOfWeek } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const ReportForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfWeek(new Date()),
    endOfWeek(new Date())
  ]);
  const [formData, setFormData] = useState({
    datacenter: '',
    datahall: '',
    state: 'Healthy',
    issues_reported: 0
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch incidents for the selected date range and location
      const { data: incidents, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .gte('created_at', dateRange[0]?.toISOString() || '')
        .lte('created_at', dateRange[1]?.toISOString() || '')
        .eq('location', formData.datacenter)
        .eq('datahall', formData.datahall);

      if (incidentsError) throw incidentsError;

      // Create the report with incident data
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert([{
          title: `Incident Report - ${formData.datacenter} - ${formData.datahall}`,
          generated_by: user?.id,
          date_range_start: dateRange[0]?.toISOString(),
          date_range_end: dateRange[1]?.toISOString(),
          datacenter: formData.datacenter,
          datahall: formData.datahall,
          status: incidents && incidents.length > 0 ? 'Warning' : 'Healthy',
          total_incidents: incidents?.length || 0,
          report_data: {
            incidents: incidents || [],
            filters: {
              datacenter: formData.datacenter,
              datahall: formData.datahall,
              dateRange: {
                start: dateRange[0]?.toISOString(),
                end: dateRange[1]?.toISOString()
              }
            }
          }
        }])
        .select()
        .single();

      if (reportError) throw reportError;

      navigate(`/reports/${report.data.id}`);
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'datacenter') {
        return { ...prev, [name]: value, datahall: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Reports
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-6">Generate New Report</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range *
              </label>
              <div className="flex gap-4">
                <DatePicker
                  selected={dateRange[0]}
                  onChange={(date) => setDateRange([date, dateRange[1]])}
                  selectsStart
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholderText="Start Date"
                />
                <DatePicker
                  selected={dateRange[1]}
                  onChange={(date) => setDateRange([dateRange[0], date])}
                  selectsEnd
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  minDate={dateRange[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholderText="End Date"
                />
              </div>
            </div>

            <div>
              <label htmlFor="datacenter" className="block text-sm font-medium text-gray-700 mb-1">
                Datacenter *
              </label>
              <select
                id="datacenter"
                name="datacenter"
                required
                value={formData.datacenter}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Datacenter</option>
                {datacenters.map(dc => (
                  <option key={dc} value={dc}>{dc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="datahall" className="block text-sm font-medium text-gray-700 mb-1">
                Data Hall *
              </label>
              <select
                id="datahall"
                name="datahall"
                required
                value={formData.datahall}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={!formData.datacenter}
              >
                <option value="">Select Data Hall</option>
                {formData.datacenter && datahalls[formData.datacenter as keyof typeof datahalls].map(hall => (
                  <option key={hall} value={hall}>{hall}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/reports')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !dateRange[0] || !dateRange[1] || !formData.datacenter || !formData.datahall}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;