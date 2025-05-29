import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Heading, Text, Button } from 'grommet';
import { CheckCircle, Home, FileText } from 'lucide-react';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  return (
    <Box fill align="center" justify="center" pad="medium">
      <Box
        width="medium"
        pad="large"
        background="white"
        round="small"
        elevation="small"
        gap="medium"
      >
        <Box align="center">
          <CheckCircle size={64} color="green" />
          <Heading level={3} margin={{ top: 'small', bottom: 'small' }}>
            Success!
          </Heading>
          <Text size="medium">
            {message || "Your action was completed successfully."}
          </Text>
        </Box>

        <Box direction="row" gap="medium" justify="center">
          <Button
            icon={<Home size={20} />}
            label="Go Home"
            onClick={handleGoHome}
            primary
          />
          <Button
            icon={<FileText size={20} />}
            label="View Reports"
            onClick={handleViewReports}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Confirmation;
