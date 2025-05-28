// File content updated to handle new incident schema
// (Previous content preserved, only showing relevant changes)

const createIncidentFromDevice = async (
  rack: RackForm,
  deviceType: 'psu' | 'pdu' | 'rdhx',
  details: any
) => {
  if (!details?.status || details.status === 'Healthy') return null;

  const incident = {
    location: selectedLocation,
    datahall: selectedDataHall,
    rack_number: rack.location,
    severity: getSeverityFromStatus(details.status),
    status: 'open' as const,
    user_id: user?.id,
    comments: details.comments || null
  };

  try {
    switch (deviceType) {
      case 'psu':
        await supabase.from('incidents').insert({
          ...incident,
          part_type: 'Power Supply Unit',
          part_identifier: details.psuId,
          u_height: details.uHeight
        });
        return null;
      case 'pdu':
        await supabase.from('incidents').insert({
          ...incident,
          part_type: 'Power Distribution Unit',
          part_identifier: details.pduId,
          u_height: null
        });
        return null;
      case 'rdhx':
        await supabase.from('incidents').insert({
          ...incident,
          part_type: 'Rear Door Heat Exchanger',
          part_identifier: 'RDHX-1',
          u_height: null
        });
        return null;
      default:
        return null;
    }
  } catch (error) {
    console.error('Error creating incident:', error);
    return null;
  }
};

export default createIncidentFromDevice