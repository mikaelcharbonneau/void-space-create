
import { Routes, Route, Navigate } from 'react-router-dom';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import InspectionFlow from './pages/InspectionFlow';
import InspectionForm from './pages/InspectionForm';
import AuditDetails from './pages/AuditDetails';
import Incidents from './pages/Incidents';
import IncidentDetails from './pages/IncidentDetails';
import Confirmation from './pages/Confirmation';
import Reports from './pages/Reports';
import ReportForm from './pages/ReportForm';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundaryComponent from './components/ErrorBoundaryComponent';

const App = () => {
  return (
    <>
      <ErrorBoundaryComponent />
      <div className="main-content">
        <ThemeProvider>
          <AuthProvider>
            <Grommet theme={hpe} full>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="inspections" element={<Inspections />} />
                    <Route path="inspections/:id" element={<AuditDetails />} />
                    <Route path="inspection" element={<InspectionFlow />} />
                    <Route path="inspection/form" element={<InspectionForm />} />
                    <Route path="incidents" element={<Incidents />} />
                    <Route path="incidents/:id" element={<IncidentDetails />} />
                    <Route path="confirmation" element={<Confirmation />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="reports/new" element={<ReportForm />} />
                    <Route path="reports/:id" element={<Reports />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="not-found" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/not-found\" replace />} />
                  </Route>
                </Route>
              </Routes>
            </Grommet>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </>
  );
};

export default App;
