import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Button, Card, CardBody } from 'grommet';
import { CheckMark } from 'grommet-icons';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message = "Your action was completed successfully!" } = location.state || {};

  return (
    <Box fill align="center" justify="center" pad="large">
      <Card width="medium" background="white" elevation="medium">
        <CardBody align="center" pad="large">
          <Box align="center" gap="small">
            <CheckMark size="large" color="green" />
            <Heading level={2} margin="none">
              Confirmation
            </Heading>
            <Text size="large">{message}</Text>
          </Box>
          <Box margin={{ top: 'medium' }} gap="small">
            <Button label="Go to Dashboard" primary onClick={() => navigate('/')} />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Confirmation;
