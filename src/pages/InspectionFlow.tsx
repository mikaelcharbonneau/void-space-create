
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Button, Card, CardBody } from 'grommet';
import { FormView, Document, Checkmark } from 'grommet-icons';

const InspectionFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    navigate('/confirmation');
  };

  return (
    <Box fill align="center" justify="center" pad="large">
      <Card width="large" background="white" elevation="medium">
        <CardBody pad="medium">
          <Box align="center" gap="medium" margin={{ bottom: 'medium' }}>
            <Heading level={2} margin="none">
              Inspection Flow
            </Heading>
            <Text size="small" color="text-weak">
              Follow the steps to complete the inspection.
            </Text>
          </Box>

          {step === 1 && (
            <Box gap="small">
              <Heading level={3}>Step 1: Review Checklist</Heading>
              <Text>
                Review the inspection checklist to ensure all items are covered.
              </Text>
              <Button
                label="View Checklist"
                icon={<FormView />}
                onClick={handleNext}
                alignSelf="start"
              />
            </Box>
          )}

          {step === 2 && (
            <Box gap="small">
              <Heading level={3}>Step 2: Fill Out Form</Heading>
              <Text>
                Fill out the inspection form with the necessary details.
              </Text>
              <Button
                label="Fill Out Form"
                icon={<Document />}
                onClick={handleNext}
                alignSelf="start"
              />
            </Box>
          )}

          {step === 3 && (
            <Box gap="small">
              <Heading level={3}>Step 3: Confirm and Submit</Heading>
              <Text>
                Confirm the information and submit the inspection.
              </Text>
              <Button
                label="Complete Inspection"
                icon={<Checkmark />}
                onClick={handleComplete}
                primary
                alignSelf="start"
              />
            </Box>
          )}
        </CardBody>
        <Box direction="row" justify="between" align="center" pad="medium" border={{ side: 'top', size: 'small', color: 'border' }}>
          <Button
            label="Back"
            onClick={handleBack}
            disabled={step === 1}
          />
          <Text size="small" color="text-weak">
            Step {step} of 3
          </Text>
        </Box>
      </Card>
    </Box>
  );
};

export default InspectionFlow;
