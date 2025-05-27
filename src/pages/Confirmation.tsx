import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  Card,
  CardBody,
  CardFooter
} from 'grommet';
import { FormCheckmark, StatusCritical, FormView, FormPrevious } from 'grommet-icons';

interface LocationState {
  inspectionId?: string;
  success: boolean;
  error?: string;
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || { success: false };

  return (
    <Box pad="medium" align="center" justify="center" fill>
      <Card 
        width="large" 
        background="light-1" 
        pad="medium" 
        margin={{ vertical: 'medium' }}
      >
        <CardBody pad="medium">
          {state.success ? (
            <Box align="center" gap="medium">
              <Box
                background="status-ok"
                pad="medium"
                round="full"
                align="center"
                justify="center"
                width="xsmall"
                height="xsmall"
              >
                <FormCheckmark size="large" color="white" />
              </Box>
              <Heading level={2} margin={{ bottom: 'none' }}>
                Inspection Submitted Successfully
              </Heading>
              <Text textAlign="center">
                Your inspection has been recorded and is available for review.
              </Text>
              {state.inspectionId && (
                <Box 
                  background="light-2" 
                  pad="small" 
                  round="small" 
                  width="medium" 
                  align="center"
                >
                  <Text size="small" weight="bold">Inspection ID:</Text>
                  <Text>{state.inspectionId}</Text>
                </Box>
              )}
            </Box>
          ) : (
            <Box align="center" gap="medium">
              <Box
                background="status-critical"
                pad="medium"
                round="full"
                align="center"
                justify="center"
                width="xsmall"
                height="xsmall"
              >
                <StatusCritical size="large" color="white" />
              </Box>
              <Heading level={2} margin={{ bottom: 'none' }}>
                Submission Error
              </Heading>
              <Text textAlign="center">
                There was a problem submitting your inspection. Please try again.
              </Text>
              {state.error && (
                <Box 
                  background="status-error" 
                  pad="small" 
                  round="small" 
                  width="large" 
                  align="center"
                >
                  <Text size="small" color="white">Error: {state.error}</Text>
                </Box>
              )}
            </Box>
          )}
        </CardBody>
        <CardFooter pad={{ horizontal: 'medium', vertical: 'small' }} gap="medium" justify="center">
          {state.success ? (
            <>
              {state.inspectionId && (
                <Button
                  icon={<FormView />}
                  label="View Report"
                  onClick={() => navigate(`/reports/${state.inspectionId}`)}
                  primary
                />
              )}
              <Button
                icon={<FormPrevious />}
                label="Back to Dashboard"
                onClick={() => navigate('/')}
              />
            </>
          ) : (
            <>
              <Button
                label="Try Again"
                onClick={() => navigate('/inspection')}
                primary
              />
              <Button
                icon={<FormPrevious />}
                label="Back to Dashboard"
                onClick={() => navigate('/')}
              />
            </>
          )}
        </CardFooter>
      </Card>
    </Box>
  );
};

export default Confirmation;
