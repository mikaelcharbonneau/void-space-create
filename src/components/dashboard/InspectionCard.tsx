
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Text, Box } from 'grommet';
import { FormView, StatusGood, StatusWarning, StatusCritical } from 'grommet-icons';
import { format } from 'date-fns';

interface InspectionCardProps {
  inspection: {
    id: string;
    title: string;
    status: 'Healthy' | 'Warning' | 'Critical';
    date: string;
    location: string;
  };
}

const InspectionCard = ({ inspection }: InspectionCardProps) => {
  const getStatusIcon = () => {
    switch (inspection.status) {
      case 'Healthy':
        return <StatusGood color="status-ok" />;
      case 'Warning':
        return <StatusWarning color="status-warning" />;
      case 'Critical':
        return <StatusCritical color="status-critical" />;
      default:
        return <FormView />;
    }
  };

  const getStatusColor = () => {
    switch (inspection.status) {
      case 'Healthy':
        return 'status-ok';
      case 'Warning':
        return 'status-warning';
      case 'Critical':
        return 'status-critical';
      default:
        return 'text';
    }
  };

  return (
    <Link to={`/inspections/${inspection.id}`} style={{ textDecoration: 'none' }}>
      <Card 
        background="white" 
        pad="medium" 
        elevation="small" 
        round="small"
        hoverIndicator
      >
        <CardHeader>
          <Box direction="row" align="center" justify="between" fill>
            <Box direction="row" align="center" gap="small">
              {getStatusIcon()}
              <Text weight="bold" truncate>
                {inspection.title}
              </Text>
            </Box>
            <Text size="small" color={getStatusColor()}>
              {inspection.status}
            </Text>
          </Box>
        </CardHeader>
        <CardBody>
          <Box gap="small">
            <Text size="small" color="text-weak">
              {format(new Date(inspection.date), 'MMM dd, yyyy')}
            </Text>
            <Text size="small" color="text-weak">
              {inspection.location}
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Link>
  );
};

export default InspectionCard;
