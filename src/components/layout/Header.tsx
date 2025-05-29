
import { Box, Button, Header as GrommetHeader } from 'grommet';
import { Menu, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import HPELogo from '../ui/HPELogo';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();

  return (
    <GrommetHeader background="white" pad={{ horizontal: 'large', vertical: 'medium' }} elevation="small">
      <Box direction="row" align="center" gap="medium" flex>
        <HPELogo />
        <Box flex />
        <Box direction="row" align="center" gap="medium">
          <Button
            icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
            onClick={toggleDarkMode}
            plain
          />
          <Button
            icon={<User size={20} />}
            onClick={logout}
            plain
          />
          <Button
            icon={<Menu size={20} />}
            plain
          />
        </Box>
      </Box>
    </GrommetHeader>
  );
};

export default Header;
