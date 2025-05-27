import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    datahall: string;
    status: string;
    isUrgent: boolean;
    [key: string]: any;
  };
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
      const { data } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.ReportData.datahall.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.UserEmail.toLowerCase().includes(searchTerm.toLowerCase())
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
          <option>Completed</option>
          <option>In Progress</option>
        </select>
        <button className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          More Filters
        </button>
      </div>

      <div className="grid gap-4">
        {filteredInspections.map((inspection) => (
          <div
            key={inspection.Id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/reports/${inspection.Id}`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                inspection.ReportData.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                inspection.ReportData.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {inspection.ReportData.status}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(inspection.Timestamp), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="font-medium mb-1">{inspection.ReportData.datahall}</p>
            <p className="text-sm text-gray-600">
              {inspection.ReportData.isUrgent ? 'Issues reported' : 'No issues reported'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inspections;