
import { FileText, Calendar } from 'lucide-react';
import { Report } from '../../types';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

const ReportCard = ({ report, onClick }: ReportCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {report.title || `Report ${report.id?.slice(0, 8)}`}
            </h3>
            <p className="text-sm text-gray-500">
              {report.ReportData.datahall}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 space-x-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(report.Timestamp).toLocaleDateString()}</span>
        </div>
        <span>•</span>
        <span>{report.UserEmail}</span>
      </div>
    </div>
  );
};

export default ReportCard;
