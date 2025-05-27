import React, { useState, useEffect } from 'react';
import { Box, Heading, Text } from 'grommet';
import { format } from 'date-fns';
import { AlertTriangle, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Incident {
  id: string;
  location: string;
  datahall: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
  updated_at: string;
}

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box pad="medium" align="center" justify="center">
        <Text>Loading incidents...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium">
      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
        <Heading level={2} margin="none">Incidents</Heading>
      </Box>

      <Box 
        direction="row" 
        gap="medium" 
        margin={{ bottom: 'medium' }}
        wrap
      >
        <Box basis="1/3" flex={true}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </Box>
        
        <Box direction="row" gap="small">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <button className="border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50">
            <Filter size={20} />
            More Filters
          </button>
        </Box>
      </Box>

      <Box>
        {filteredIncidents.length === 0 ? (
          <Box 
            background="light-2" 
            pad="large" 
            align="center" 
            round="small"
          >
            <AlertTriangle size={48} className="text-gray-400 mb-4" />
            <Text size="large" weight="bold">No incidents found</Text>
            <Text color="dark-6">Try adjusting your search or filters</Text>
          </Box>
        ) : (
          <div className="grid gap-4">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{incident.location}</h3>
                    <p className="text-gray-600">{incident.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Created {format(new Date(incident.created_at), 'MMM d, yyyy')}</span>
                  <span>Last updated {format(new Date(incident.updated_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Incidents;