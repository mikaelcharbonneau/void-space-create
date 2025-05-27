import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  datacenter: string;
  datahall: string;
  issues_reported: number;
  state: 'Healthy' | 'Warning' | 'Critical';
  walkthrough_id: number;
  user_full_name: string;
}

const Inspections = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.datacenter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.datahall?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Inspections</h1>
        <button
          onClick={() => navigate('/inspection')}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
        >
          Start Walkthrough
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search inspections"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-4 py-2">
          <option>All Statuses</option>
          <option>Healthy</option>
          <option>Warning</option>
          <option>Critical</option>
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Issues Reported</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Walkthrough ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading inspections...
                  </td>
                </tr>
              ) : filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No inspections found
                  </td>
                </tr>
              ) : (
                filteredInspections.map((inspection) => (
                  <tr 
                    key={inspection.Id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/reports/${inspection.Id}`)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{inspection.datacenter}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{inspection.datahall}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{inspection.issues_reported}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inspection.state === 'Healthy'
                          ? 'bg-green-100 text-green-800'
                          : inspection.state === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inspection.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">#{inspection.walkthrough_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{inspection.user_full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{format(new Date(inspection.Timestamp), 'MMM d, yyyy')}</td>
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

export default Inspections;