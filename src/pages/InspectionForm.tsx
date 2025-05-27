import React, { useState, useEffect } from 'react';
import { Box } from 'grommet';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Server, Trash2 } from 'lucide-react';
import { datahallsByLocation } from '../utils/locationMapping';
import { rackLocations } from '../utils/rackLocations';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  selectedLocation?: string;
}

interface RackForm {
  id: string;
  location: string;
  devices: {
    powerSupplyUnit: boolean;
    powerDistributionUnit: boolean;
    rearDoorHeatExchanger: boolean;
  };
  psuDetails?: {
    status: string;
    psuId: string;
    uHeight: string;
    comments?: string;
  };
  pduDetails?: {
    status: string;
    pduId: string;
    comments?: string;
  };
  rdhxDetails?: {
    status: string;
    comments?: string;
  };
}

const psuStatusOptions = ['Healthy', 'Amber LED', 'Powered-Off', 'Other'];
const psuIdOptions = ['PSU 1', 'PSU 2', 'PSU 3', 'PSU 4', 'PSU 5', 'PSU 6'];
const uHeightOptions = Array.from({ length: 49 }, (_, i) => `U${i}`);
const pduStatusOptions = ['Healthy', 'Tripped Breaker', 'Powered-Off', 'Active Alarm', 'Other'];
const pduIdOptions = ['PDU A', 'PDU B', 'PDU C'];
const rdhxStatusOptions = ['Healthy', 'Water Leak', 'Powered-Off', 'Active Alarm', 'Other'];

const InspectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedLocation } = (location.state as LocationState) || {};
  const [selectedDataHall, setSelectedDataHall] = useState<string>('');
  const [showDatahallDropdown, setShowDatahallDropdown] = useState(false);
  const [hasIssues, setHasIssues] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [racks, setRacks] = useState<RackForm[]>([]);
  const [expandedRacks, setExpandedRacks] = useState<string[]>([]);
  const [walkThroughNumber, setWalkThroughNumber] = useState(1);
  const [userFullName, setUserFullName] = useState('');

  useEffect(() => {
    const lastNumber = localStorage.getItem('lastWalkThroughNumber');
    if (lastNumber) {
      setWalkThroughNumber(parseInt(lastNumber, 10) + 1);
    }

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
        .single();

      if (error) throw error;
      if (data) {
        setUserFullName(data.full_name);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  if (!selectedLocation) {
    navigate('/');
    return null;
  }

  const datahalls = datahallsByLocation[selectedLocation] || [];
  const availableRacks = selectedDataHall ? rackLocations[selectedDataHall] || [] : [];

  const isFormValid = () => {
    if (!selectedDataHall) return false;
    if (hasIssues === null) return false;
    if (hasIssues === true) {
      return racks.every(rack => 
        rack.location && 
        (rack.devices.powerSupplyUnit || 
         rack.devices.powerDistributionUnit || 
         rack.devices.rearDoorHeatExchanger)
      );
    }
    return true;
  };

  const handleYesIssuesClick = () => {
    setHasIssues(true);
    const newRack: RackForm = {
      id: `rack-${Date.now()}`,
      location: '',
      devices: {
        powerSupplyUnit: false,
        powerDistributionUnit: false,
        rearDoorHeatExchanger: false
      }
    };
    setRacks([newRack]);
    setExpandedRacks([newRack.id]);
  };

  const toggleRackExpansion = (rackId: string) => {
    setExpandedRacks(prev => 
      prev.includes(rackId) 
        ? prev.filter(id => id !== rackId)
        : [...prev, rackId]
    );
  };

  const updateRack = (rackId: string, updates: Partial<RackForm>) => {
    setRacks(racks.map(rack => 
      rack.id === rackId ? { ...rack, ...updates } : rack
    ));
  };

  const removeRack = (rackId: string) => {
    const updatedRacks = racks.filter(rack => rack.id !== rackId);
    setRacks(updatedRacks);
    setExpandedRacks(expandedRacks.filter(id => id !== rackId));
    
    if (updatedRacks.length === 0) {
      setHasIssues(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .insert([{
          UserEmail: user?.email,
          datacenter: selectedLocation,
          datahall: selectedDataHall,
          issues_reported: hasIssues ? racks.length : 0,
          state: hasIssues ? (racks.length > 2 ? 'Critical' : 'Warning') : 'Healthy',
          walkthrough_id: walkThroughNumber,
          user_full_name: userFullName || user?.email?.split('@')[0] || 'Unknown',
          ReportData: {
            location: selectedLocation,
            datahall: selectedDataHall,
            hasIssues,
            racks,
            walkThroughNumber,
            timestamp: new Date().toISOString()
          }
        }])
        .select();

      if (error) throw error;

      localStorage.setItem('lastWalkThroughNumber', walkThroughNumber.toString());
      
      navigate('/confirmation', { 
        state: { 
          inspectionId: data?.[0]?.Id,
          success: true 
        } 
      });
    } catch (error: any) {
      console.error('Error submitting inspection:', error);
      navigate('/confirmation', { 
        state: { 
          success: false,
          error: error.message 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pad="medium" overflow="auto" height={{ min: '100vh' }}>
      <div className="max-w-3xl mx-auto pb-24">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Walkthrough Audit #{walkThroughNumber}</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <p className="text-gray-600 mb-4">Location: {selectedLocation}</p>
            
            <div className="relative mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data Hall
              </label>
              <button
                onClick={() => setShowDatahallDropdown(!showDatahallDropdown)}
                className="w-full bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-between hover:border-emerald-500 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedDataHall || 'Select Data Hall'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDatahallDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDatahallDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-1 z-50">
                  {datahalls.map((datahall) => (
                    <button
                      key={datahall}
                      onClick={() => {
                        setSelectedDataHall(datahall);
                        setShowDatahallDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      {datahall}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-medium mb-4">
                Have you discovered any issues during the walkthrough?
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={handleYesIssuesClick}
                  className={`px-6 py-2.5 rounded-md transition-colors ${
                    hasIssues === true 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                      : 'border border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  Yes, I found issues
                </button>
                <button
                  onClick={() => setHasIssues(false)}
                  className={`px-6 py-2.5 rounded-md transition-colors ${
                    hasIssues === false 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                      : hasIssues === true
                        ? 'border border-gray-300 text-gray-500'
                        : 'border border-emerald-500 text-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  No issues found
                </button>
              </div>
            </div>

            {hasIssues === true && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                {racks.map((rack) => (
                  <div
                    key={rack.id}
                    className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden border border-gray-200"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50">
                      <button
                        onClick={() => toggleRackExpansion(rack.id)}
                        className="flex items-center gap-3 hover:text-emerald-600"
                      >
                        <Server size={20} className="text-gray-500" />
                        <span className="font-medium">
                          Rack {rack.location || '#'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedRacks.includes(rack.id) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      <button
                        onClick={() => removeRack(rack.id)}
                        className="text-red-500 hover:text-red-600 p-2"
                        title="Remove issue"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {expandedRacks.includes(rack.id) && (
                      <div className="p-6 border-t border-gray-100">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tile Location *
                            </label>
                            <select
                              value={rack.location}
                              onChange={(e) => updateRack(rack.id, { location: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value="">Select tile location</option>
                              {availableRacks.map(rackId => (
                                <option key={rackId} value={rackId}>{rackId}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Select Impacted Device(s) *
                            </label>
                            <div className="space-y-3">
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={rack.devices.powerSupplyUnit}
                                  onChange={(e) => updateRack(rack.id, {
                                    devices: { ...rack.devices, powerSupplyUnit: e.target.checked }
                                  })}
                                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="group-hover:text-emerald-600">Power Supply Unit</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={rack.devices.powerDistributionUnit}
                                  onChange={(e) => updateRack(rack.id, {
                                    devices: { ...rack.devices, powerDistributionUnit: e.target.checked }
                                  })}
                                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="group-hover:text-emerald-600">Power Distribution Unit</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={rack.devices.rearDoorHeatExchanger}
                                  onChange={(e) => updateRack(rack.id, {
                                    devices: { ...rack.devices, rearDoorHeatExchanger: e.target.checked }
                                  })}
                                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="group-hover:text-emerald-600">Rear Door Heat Exchanger</span>
                              </label>
                            </div>
                          </div>

                          {rack.devices.powerSupplyUnit && (
                            <div className="pt-4 border-t border-gray-100">
                              <h3 className="text-lg font-medium mb-4">Power Supply Unit Details</h3>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                  </label>
                                  <select
                                    value={rack.psuDetails?.status || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      psuDetails: { ...rack.psuDetails, status: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  >
                                    <option value="">Select status</option>
                                    {psuStatusOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PSU ID
                                  </label>
                                  <select
                                    value={rack.psuDetails?.psuId || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      psuDetails: { ...rack.psuDetails, psuId: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  >
                                    <option value="">Select PSU</option>
                                    {psuIdOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    U-Height
                                  </label>
                                  <select
                                    value={rack.psuDetails?.uHeight || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      psuDetails: { ...rack.psuDetails, uHeight: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  >
                                    <option value="">Select U-Height</option>
                                    {uHeightOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments
                                  </label>
                                  <textarea
                                    value={rack.psuDetails?.comments || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      psuDetails: { ...rack.psuDetails, comments: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px]"
                                    placeholder="Add any additional comments"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {rack.devices.powerDistributionUnit && (
                            <div className="pt-4 border-t border-gray-100">
                              <h3 className="text-lg font-medium mb-4">Power Distribution Unit Details</h3>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                  </label>
                                  <select
                                    value={rack.pduDetails?.status || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      pduDetails: { ...rack.pduDetails, status: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  >
                                    <option value="">Select status</option>
                                    {pduStatusOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PDU ID
                                  </label>
                                  <select
                                    value={rack.pduDetails?.pduId || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      pduDetails: { ...rack.pduDetails, pduId: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  >
                                    <option value="">Select PDU</option>
                                    {pduIdOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments
                                  </label>
                                  <textarea
                                    value={rack.pduDetails?.comments || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      pduDetails: { ...rack.pduDetails, comments: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px]"
                                    placeholder="Add any additional comments"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {rack.devices.rearDoorHeatExchanger && (
                            <div className="pt-4 border-t border-gray-100">
                              <h3 className="text-lg font-medium mb-4">Rear Door Heat Exchanger Details</h3>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                  </label>
                                  <select
                                    value={rack.rdhxDetails?.status || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      rdhxDetails: { ...rack.rdhxDetails, status: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  >
                                    <option value="">Select status</option>
                                    {rdhxStatusOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments
                                  </label>
                                  <textarea
                                    value={rack.rdhxDetails?.comments || ''}
                                    onChange={(e) => updateRack(rack.id, {
                                      rdhxDetails: { ...rack.rdhxDetails, comments: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px]"
                                    placeholder="Add any additional comments"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const newRack: RackForm = {
                        id: `rack-${Date.now()}`,
                        location: '',
                        devices: {
                          powerSupplyUnit: false,
                          powerDistributionUnit: false,
                          rearDoorHeatExchanger: false
                        }
                      };
                      setRacks([...racks, newRack]);
                      setExpandedRacks([...expandedRacks, newRack.id]);
                    }}
                    className="flex-1 py-3 text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                  >
                    Add Another Issue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex justify-end gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel Audit
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              className={`px-6 py-2.5 rounded-md text-white transition-colors ${
                isFormValid()
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-emerald-300 cursor-not-allowed'
              }`}
            >
              {loading ? 'Submitting...' : 'Complete Audit'}
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default InspectionForm;