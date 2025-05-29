
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

const StatusCard = ({ title, value, subtitle, trend, color = 'blue' }: StatusCardProps) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    yellow: 'text-yellow-600 bg-yellow-50'
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
