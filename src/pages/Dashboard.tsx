import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { locations } from '../utils/locationMapping';

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
  ReportData: {
    comments?: string;
    [key: string]: any;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userFullName, setUserFullName] = useState<string>('');
  const [walkThroughNumber, setWalkThroughNumber] = useState(1);

  useEffect(() => {
    fetchInspections();
    if (user) {
      fetchUserProfile();
    }
    // Get the last walkthrough number from localStorage
    const lastNumber = localStorage.getItem('lastWalkThroughNumber');
    if (lastNumber) {
      setWalkThroughNumber(parseInt(lastNumber, 10));
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setUserFullName(data.full_name);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchInspections = async () => {
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    completed: inspections.length,
    active: inspections.filter(i => i.issues_reported > 0).length,
    resolved: inspections.filter(i => i.issues_reported === 0).length
  };

  const handleLocationSelect = (location: string) => {
    navigate('/inspection', { 
      state: { selectedLocation: location }
    });
    setShowLocationDropdown(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userFullName || 'User'}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="bg-[rgb(68,151,115)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[rgb(54,121,92)]"
          >
            <ClipboardList className="w-5 h-5" />
            Start Walkthrough
            <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showLocationDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <ClipboardList className="w-8 h-8 text-emerald-500" />
            <span className="text-sm text-gray-500 cursor-pointer">View all</span>
          </div>
          <h3 className="font-medium mb-2">Completed Walkthroughs</h3>
          <p className="text-3xl font-semibold">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <span className="text-sm text-gray-500 cursor-pointer">View all</span>
          </div>
          <h3 className="font-medium mb-2">Active Issues</h3>
          <p className="text-3xl font-semibold">{stats.active}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-slate-600" />
            <span className="text-sm text-gray-500 cursor-pointer">View all</span>
          </div>
          <h3 className="font-medium mb-2">Resolved Issues</h3>
          <p className="text-3xl font-semibold">{stats.resolved}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Recent Inspections</h2>
          <button
            onClick={() => navigate('/inspections')}
            className="text-emerald-500 hover:text-emerald-600"
          >
            View All
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Datacenter</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data Hall</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Issues Reported</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Walkthrough ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inspections.slice(0, 4).map((inspection) => (
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
                      inspection.issues_reported === 0 
                        ? 'bg-green-100 text-green-800'
                        : inspection.state === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inspection.issues_reported === 0 ? 'Healthy' : inspection.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">#{inspection.walkthrough_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{inspection.user_full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{format(new Date(inspection.Timestamp), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {inspection.ReportData?.comments || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Reports</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-emerald-500 hover:text-emerald-600"
          >
            View All
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {inspections.slice(0, 3).map((inspection) => (
            <div
              key={inspection.Id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/reports/${inspection.Id}`)}
            >
              <div 
                className="relative h-48 bg-cover bg-center"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg)`,
                }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-medium text-white mb-2">
                    Daily Issue Report - {format(new Date(inspection.Timestamp), 'MMM do yyyy')}
                  </h3>
                  <p className="text-sm text-gray-200">{inspection.datahall}</p>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-4 text-sm text-gray-600">
                  <button className="hover:text-emerald-600 transition-colors">View</button>
                  <button className="hover:text-emerald-600 transition-colors">Download</button>
                  <button className="hover:text-emerald-600 transition-colors">Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;