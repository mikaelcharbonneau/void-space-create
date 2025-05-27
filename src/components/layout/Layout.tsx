import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';
import { Box } from 'grommet';

const Layout = () => {
  const { darkMode } = useTheme();
  
  return (
    <Box fill direction="column" background={darkMode ? 'background-back' : 'background-front'}>
      <Header />
      <Box as="main" flex pad={{ vertical: 'medium', horizontal: 'large' }}>
        <Box width="xlarge" alignSelf="center">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;