import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  TextInput,
  Select,
  TextArea,
  CheckBox,
} from 'grommet';

const InspectionFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    datahall: '',
    status: '',
    isUrgent: false,
    temperatureReading: '',
    humidityReading: '',
    comments: '',
    securityPassed: false,
    coolingSystemCheck: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const submitForm = () => {
    console.log('Form Data Submitted:', formData);
    navigate('/confirmation');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Box gap="medium">
            <Heading level={3}>Data Hall Information</Heading>
            <TextInput
              name="datahall"
              placeholder="Data Hall Name"
              value={formData.datahall}
              onChange={handleChange}
            />
            <Select
              name="status"
              options={['Operational', 'Needs Attention', 'Critical']}
              value={formData.status}
              onChange={({ option }) => handleChange({ target: { name: 'status', value: option } })}
            />
            <CheckBox
              name="isUrgent"
              label="Is Urgent"
              checked={formData.isUrgent}
              onChange={handleChange}
            />
            <Box direction="row" gap="small">
              <Button label="Next" primary onClick={nextStep} />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box gap="medium">
            <Heading level={3}>Environment Readings</Heading>
            <TextInput
              name="temperatureReading"
              placeholder="Temperature (°C)"
              value={formData.temperatureReading}
              onChange={handleChange}
            />
            <TextInput
              name="humidityReading"
              placeholder="Humidity (%)"
              value={formData.humidityReading}
              onChange={handleChange}
            />
            <TextArea
              name="comments"
              placeholder="Additional Comments"
              value={formData.comments}
              onChange={handleChange}
            />
            <Box direction="row" gap="small">
              <Button label="Previous" onClick={prevStep} />
              <Button label="Next" primary onClick={nextStep} />
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box gap="medium">
            <Heading level={3}>Security and Cooling</Heading>
            <CheckBox
              name="securityPassed"
              label="Security Check Passed"
              checked={formData.securityPassed}
              onChange={handleChange}
            />
            <CheckBox
              name="coolingSystemCheck"
              label="Cooling System Check"
              checked={formData.coolingSystemCheck}
              onChange={handleChange}
            />
            <Box direction="row" gap="small">
              <Button label="Previous" onClick={prevStep} />
              <Button label="Submit" primary onClick={submitForm} />
            </Box>
          </Box>
        );
      default:
        return <Text>Unexpected step</Text>;
    }
  };

  return (
    <Box gap="medium">
      <Heading level={2}>Inspection Flow</Heading>
      {renderStep()}
    </Box>
  );
};

export default InspectionFlow;
