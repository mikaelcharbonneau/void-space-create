
import { useNavigate } from 'react-router-dom';
import { Header as GrommetHeader, Box, Button, Text } from 'grommet';
import { User, Home } from 'grommet-icons';
import { useAuth } from '../../context/AuthContext';
import HPELogo from '../ui/HPELogo';

const Header = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <GrommetHeader 
      background="white" 
      pad={{ horizontal: 'medium', vertical: 'small' }}
      elevation="small"
    >
      <Box direction="row" align="center" gap="medium">
        <HPELogo />
        <Text size="large" weight="bold">
          Audit Portal
        </Text>
      </Box>
      
      <Box direction="row" align="center" gap="medium">
        <Button
          icon={<Home />}
          tip="Dashboard"
          onClick={() => navigate('/')}
          plain
        />
        <Button
          icon={<User />}
          tip="Profile"
          onClick={() => navigate('/profile')}
          plain
        />
        <Button
          label="Sign Out"
          onClick={handleSignOut}
          size="small"
        />
      </Box>
    </GrommetHeader>
  );
};

export default Header;
