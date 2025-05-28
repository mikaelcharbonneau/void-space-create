import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { locations } from '../utils/locationMapping';

interface DashboardStats {
  completed: number;
  active: number;
  resolved: number;
}

interface Report {
  id: string;
  title: string;
  generated_by: string;
  generated_at: string;
  datacenter: string;
  datahall: string;
  status: string;
  total_incidents: number;
  report_data: any;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    completed: 0,
    active: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userFullName, setUserFullName] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
    if (user) {
      fetchUserProfile();
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch reports
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(3);

      if (reportError) throw reportError;
      setReports(reportData || []);

      // Fetch statistics
      const { data: auditData, error: auditError } = await supabase
        .from('AuditReports')
        .select('*');

      if (auditError) throw auditError;

      const { data: incidentData, error: incidentError } = await supabase
        .from('incidents')
        .select('*');

      if (incidentError) throw incidentError;

      // Calculate statistics
      const completedAudits = auditData?.length || 0;
      const activeIncidents = incidentData?.filter(i => i.status !== 'resolved')?.length || 0;
      const resolvedIncidents = incidentData?.filter(i => i.status === 'resolved')?.length || 0;

      setStats({
        completed: completedAudits,
        active: activeIncidents,
        resolved: resolvedIncidents
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    navigate('/inspection/form', { 
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
            Start Audit
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
            <span className="text-sm text-gray-500 cursor-pointer" onClick={() => navigate('/inspections')}>View all</span>
          </div>
          <h3 className="font-medium mb-2">Completed Audits</h3>
          <p className="text-3xl font-semibold">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <span className="text-sm text-gray-500 cursor-pointer" onClick={() => navigate('/incidents')}>View all</span>
          </div>
          <h3 className="font-medium mb-2">Active Issues</h3>
          <p className="text-3xl font-semibold">{stats.active}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-slate-600" />
            <span className="text-sm text-gray-500 cursor-pointer" onClick={() => navigate('/incidents')}>View all</span>
          </div>
          <h3 className="font-medium mb-2">Resolved Issues</h3>
          <p className="text-3xl font-semibold">{stats.resolved}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Recent Reports</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-emerald-500 hover:text-emerald-600"
          >
            View All
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
    </div>
  );
};

export default Dashboard;