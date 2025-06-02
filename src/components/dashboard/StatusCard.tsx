
import { Card, CardBody, CardHeader, Text, Box } from 'grommet';
import { StatusGood, StatusWarning, StatusCritical } from 'grommet-icons';

interface StatusCardProps {
  title: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  subtitle?: string;
}

const StatusCard = ({ title, value, status, subtitle }: StatusCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <StatusGood color="status-ok" size="large" />;
      case 'warning':
        return <StatusWarning color="status-warning" size="large" />;
      case 'critical':
        return <StatusCritical color="status-critical" size="large" />;
      default:
        return <StatusGood color="status-ok" size="large" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'status-ok';
      case 'warning':
        return 'status-warning';
      case 'critical':
        return 'status-critical';
      default:
        return 'text';
    }
  };

  return (
    <Card background="white" pad="medium" elevation="small" round="small">
      <CardHeader>
        <Box direction="row" align="center" justify="between">
          <Text size="small" color="text-weak">
            {title}
          </Text>
          {getStatusIcon()}
        </Box>
      </CardHeader>
      <CardBody>
        <Box gap="small">
          <Text size="xlarge" weight="bold" color={getStatusColor()}>
            {value}
          </Text>
          {subtitle && (
            <Text size="small" color="text-weak">
              {subtitle}
            </Text>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default StatusCard;
