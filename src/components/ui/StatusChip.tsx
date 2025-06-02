
interface StatusChipProps {
  status: 'Healthy' | 'Warning' | 'Critical' | 'open' | 'in-progress' | 'resolved';
  size?: 'small' | 'medium';
}

const StatusChip = ({ status, size = 'medium' }: StatusChipProps) => {
  const getStatusStyles = () => {
    const baseStyles = size === 'small' 
      ? 'px-2 py-1 text-xs' 
      : 'px-3 py-1 text-sm';
    
    switch (status) {
      case 'Healthy':
        return `${baseStyles} bg-green-100 text-green-800 rounded-full font-medium`;
      case 'Warning':
        return `${baseStyles} bg-yellow-100 text-yellow-800 rounded-full font-medium`;
      case 'Critical':
        return `${baseStyles} bg-red-100 text-red-800 rounded-full font-medium`;
      case 'open':
        return `${baseStyles} bg-red-100 text-red-800 rounded-full font-medium`;
      case 'in-progress':
        return `${baseStyles} bg-yellow-100 text-yellow-800 rounded-full font-medium`;
      case 'resolved':
        return `${baseStyles} bg-green-100 text-green-800 rounded-full font-medium`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800 rounded-full font-medium`;
    }
  };

  const getDisplayText = () => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'open':
        return 'Open';
      default:
        return status;
    }
  };

  return (
    <span className={getStatusStyles()}>
      {getDisplayText()}
    </span>
  );
};

export default StatusChip;
