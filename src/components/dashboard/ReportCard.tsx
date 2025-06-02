
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Text, Box } from 'grommet';
import { Document, StatusGood, StatusWarning, StatusCritical } from 'grommet-icons';
import { format } from 'date-fns';

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    status: string;
    date: string;
    type: string;
  };
}

const ReportCard = ({ report }: ReportCardProps) => {
  const getStatusIcon = () => {
    switch (report.status) {
      case 'published':
        return <StatusGood color="status-ok" />;
      case 'draft':
        return <StatusWarning color="status-warning" />;
      case 'error':
        return <StatusCritical color="status-critical" />;
      default:
        return <Document />;
    }
  };

  return (
    <Link to={`/reports/${report.id}`} style={{ textDecoration: 'none' }}>
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
                {report.title}
              </Text>
            </Box>
            <Text size="small" color="text-weak">
              {report.status}
            </Text>
          </Box>
        </CardHeader>
        <CardBody>
          <Box gap="small">
            <Text size="small" color="text-weak">
              {format(new Date(report.date), 'MMM dd, yyyy')}
            </Text>
            <Text size="small" color="text-weak">
              {report.type}
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ReportCard;
