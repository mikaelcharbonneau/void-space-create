
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Inspection } from '../../types';

interface InspectionCardProps {
  inspection: Inspection;
  onClick: () => void;
}

const InspectionCard = ({ inspection, onClick }: InspectionCardProps) => {
  const getStatusIcon = () => {
    switch (inspection.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {inspection.ReportData.datahall}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(inspection.Timestamp).toLocaleDateString()}
          </p>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <span className="capitalize">{inspection.status || 'pending'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Inspector:</span>
          <span>{inspection.UserEmail}</span>
        </div>
      </div>
    </div>
  );
};

export default InspectionCard;
