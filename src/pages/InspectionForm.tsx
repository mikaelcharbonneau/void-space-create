import React, { useState, useEffect } from 'react';
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

const psuStatusOptions = ['Amber LED', 'Powered-Off', 'Other'];
const psuIdOptions = ['PSU1', 'PSU2', 'PSU3', 'PSU4', 'PSU5', 'PSU6'];
const uHeightOptions = Array.from({ length: 49 }, (_, i) => `U${i.toString().padStart(2, '0')}`);
const pduStatusOptions = ['Tripped Breaker', 'Powered-Off', 'Active Alarm', 'Other'];
const pduIdOptions = ['PDUA', 'PDUB', 'PDUC'];
const rdhxStatusOptions = ['Water Leak', 'Powered-Off', 'Active Alarm', 'Other'];

const InspectionForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDataHall, setSelectedDataHall] = useState<string>('');
  const [hasIssues, setHasIssues] = useState(false);
  const [racks, setRacks] = useState<RackForm[]>([]);
  const [walkThroughNumber, setWalkThroughNumber] = useState<number>(0);
  const [userFullName, setUserFullName] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create incidents for each rack with issues
      if (hasIssues && racks.length > 0) {
        const incidentPromises = racks.map(async (rack) => {
          let description = '';
          let part_type = 'Other';
          let part_identifier = '';
          let severity = 'medium';
          let rack_number = rack.location;
          
          if (rack.devices.powerSupplyUnit && rack.psuDetails) {
            part_type = 'PSU';
            part_identifier = rack.psuDetails.psuId;
            // Add u-height to rack number for PSUs
            rack_number = `${rack.location.replace(/[^0-9]/g, '')}u${rack.psuDetails.uHeight.toLowerCase()}`;
            description = `PSU Issue - Status: ${rack.psuDetails.status}, PSU ID: ${rack.psuDetails.psuId}, U-Height: ${rack.psuDetails.uHeight}`;
            if (rack.psuDetails.comments) {
              description += `, Comments: ${rack.psuDetails.comments}`;
            }
            severity = rack.psuDetails.status === 'Powered-Off' ? 'critical' : 'high';
          } else if (rack.devices.powerDistributionUnit && rack.pduDetails) {
            part_type = 'PDU';
            part_identifier = rack.pduDetails.pduId;
            description = `PDU Issue - Status: ${rack.pduDetails.status}, PDU ID: ${rack.pduDetails.pduId}`;
            if (rack.pduDetails.comments) {
              description += `, Comments: ${rack.pduDetails.comments}`;
            }
            severity = rack.pduDetails.status === 'Powered-Off' ? 'critical' : 'high';
          } else if (rack.devices.rearDoorHeatExchanger && rack.rdhxDetails) {
            part_type = 'RDHX';
            part_identifier = 'RDHX'; // Just RDHX instead of RDHX1
            description = `RDHX Issue - Status: ${rack.rdhxDetails.status}`;
            if (rack.rdhxDetails.comments) {
              description += `, Comments: ${rack.rdhxDetails.comments}`;
            }
            severity = rack.rdhxDetails.status === 'Water Leak' ? 'critical' : 'high';
          }

          return supabase.from('incidents').insert({
            location: selectedLocation,
            datahall: selectedDataHall,
            rack_number,
            description,
            severity,
            status: 'open',
            user_id: user?.id,
            part_type,
            part_identifier,
            walkthrough_id: walkThroughNumber,
            u_height: rack.devices.powerSupplyUnit ? rack.psuDetails?.uHeight : null,
            comments: rack.devices.powerSupplyUnit ? rack.psuDetails?.comments :
                     rack.devices.powerDistributionUnit ? rack.pduDetails?.comments :
                     rack.devices.rearDoorHeatExchanger ? rack.rdhxDetails?.comments : null
          });
        });

        const results = await Promise.all(incidentPromises);
        const errors = results.filter(result => result.error);
        
        if (errors.length > 0) {
          throw new Error(`Failed to create ${errors.length} incidents`);
        }
      }

      // Create the audit report
      const { data, error: reportError } = await supabase
        .from('AuditReports')
        .insert([{
          GeneratedBy: user?.email,
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

      if (reportError) throw reportError;

      localStorage.setItem('lastWalkThroughNumber', walkThroughNumber.toString());
      
      navigate('/confirmation', { 
        state: { 
          inspectionId: data?.[0]?.Id,
          success: true 
        } 
      });
    } catch (error: any) {
      console.error('Error submitting inspection:', error);
      setError(error.message || 'Failed to submit inspection');
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

  // Return your component JSX here
  return (
    <div>
      {/* Your form JSX goes here */}
    </div>
  );
};

export default InspectionForm;