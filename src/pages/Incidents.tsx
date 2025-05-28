import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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

const Incidents = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedDatacenter, setSelectedDatacenter] = useState('');
  const [selectedDatahall, setSelectedDatahall] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
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
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (incident: Incident) => {
    if (searchTerm && !incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !incident.location?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !incident.datahall?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (dateRange[0] && dateRange[1]) {
      const incidentDate = new Date(incident.created_at);
      if (incidentDate < dateRange[0] || incidentDate > dateRange[1]) {
        return false;
      }
    }

    if (selectedDatacenter && incident.location !== selectedDatacenter) {
      return false;
    }

    if (selectedDatahall && incident.datahall !== selectedDatahall) {
      return false;
    }

    if (selectedSeverity && incident.severity !== selectedSeverity) {
      return false;
    }

    if (selectedStatus && incident.status !== selectedStatus) {
      return false;
    }

    return true;
  };

  const filteredIncidents = incidents.filter(applyFilters);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Reported Issues</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
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

          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                More Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <div className="flex gap-2">
                        <DatePicker
                          selected={dateRange[0]}
                          onChange={(date) => setDateRange([date, dateRange[1]])}
                          selectsStart
                          startDate={dateRange[0]}
                          endDate={dateRange[1]}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                          placeholderText="Start Date"
                        />
                        <DatePicker
                          selected={dateRange[1]}
                          onChange={(date) => setDateRange([dateRange[0], date])}
                          selectsEnd
                          startDate={dateRange[0]}
                          endDate={dateRange[1]}
                          minDate={dateRange[0]}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                          placeholderText="End Date"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Datacenter</label>
                      <select
                        value={selectedDatacenter}
                        onChange={(e) => {
                          setSelectedDatacenter(e.target.value);
                          setSelectedDatahall('');
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                      >
                        <option value="">All Datacenters</option>
                        {datacenters.map(dc => (
                          <option key={dc} value={dc}>{dc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Hall</label>
                      <select
                        value={selectedDatahall}
                        onChange={(e) => setSelectedDatahall(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                        disabled={!selectedDatacenter}
                      >
                        <option value="">All Data Halls</option>
                        {selectedDatacenter && datahalls[selectedDatacenter as keyof typeof datahalls].map(hall => (
                          <option key={hall} value={hall}>{hall}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                      <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                      >
                        <option value="">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setDateRange([null, null]);
                          setSelectedDatacenter('');
                          setSelectedDatahall('');
                          setSelectedSeverity('');
                          setSelectedStatus('');
                          setShowFilters(false);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Datacenter</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data Hall</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
              ) : filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No issues found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr 
                    key={incident.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/incidents/${incident.id}`)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{incident.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{incident.datahall}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{incident.description}</td>
                    <td className="px-6 py-4 text-sm">
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
                    <td className="px-6 py-4 text-sm">
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(incident.created_at), 'MMM d, yyyy')}
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

export default Incidents;