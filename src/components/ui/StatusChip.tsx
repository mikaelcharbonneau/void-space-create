import { IssueStatus, InspectionStatus } from '../../types';

interface StatusChipProps {
  status: IssueStatus | InspectionStatus;
  className?: string;
}

const StatusChip = ({ status, className = '' }: StatusChipProps) => {
  let chipClass = '';
  let label = '';

  switch (status) {
    case 'open':
      chipClass = 'chip-red';
      label = 'Open';
      break;
    case 'in-progress':
      chipClass = 'chip-amber';
      label = 'In Progress';
      break;
    case 'resolved':
    case 'completed':
      chipClass = 'chip-green';
      label = status === 'resolved' ? 'Resolved' : 'Completed';
      break;
    default:
      chipClass = 'bg-gray-100 text-gray-800';
      label = status;
  }

  return <span className={`${chipClass} ${className}`}>{label}</span>;
};

export default StatusChip;