import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-hpe-blue-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-hpe-blue-700 mb-2">Page Not Found</h2>
        <p className="text-hpe-blue-500 mb-6 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;