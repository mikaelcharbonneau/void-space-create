
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Form, 
  FormField, 
  TextInput, 
  Heading, 
  Text,
  Card,
  CardBody 
} from 'grommet';
import { useAuth } from '../context/AuthContext';
import HPELogo from '../components/ui/HPELogo';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await signUp(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      fill 
      align="center" 
      justify="center" 
      background="light-2"
      pad="medium"
    >
      <Card width="medium" background="white" elevation="medium">
        <CardBody pad="large">
          <Box align="center" gap="medium">
            <HPELogo />
            <Heading level={2} margin="none">
              Create Account
            </Heading>
            <Text textAlign="center" color="text-weak">
              Join the HPE Audit Portal
            </Text>
          </Box>

          {error && (
            <Box 
              background="status-error" 
              pad="small" 
              round="small" 
              margin={{ vertical: 'small' }}
            >
              <Text color="white" size="small">
                {error}
              </Text>
            </Box>
          )}

          <Form
            onSubmit={handleSubmit}
            value={formData}
            onChange={setFormData}
          >
            <FormField 
              name="name" 
              label="Full Name" 
              required
              margin={{ bottom: 'small' }}
            >
              <TextInput name="name" />
            </FormField>

            <FormField 
              name="email" 
              label="Email" 
              required
              margin={{ bottom: 'small' }}
            >
              <TextInput name="email" type="email" />
            </FormField>

            <FormField 
              name="password" 
              label="Password" 
              required
              margin={{ bottom: 'medium' }}
            >
              <TextInput name="password" type="password" />
            </FormField>

            <Button
              type="submit"
              label={loading ? 'Creating Account...' : 'Create Account'}
              primary
              fill
              disabled={loading}
              margin={{ bottom: 'medium' }}
            />
          </Form>

          <Box align="center">
            <Text size="small" color="text-weak">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#01A982', textDecoration: 'none' }}>
                Sign in
              </Link>
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Register;
