
import { useState, useEffect } from 'react';
import { Box } from 'grommet';
import { Download } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reports logic
    setLoading(false);
  }, []);

  const downloadCSV = () => {
    // CSV download logic
    console.log('Downloading CSV...');
  };

  return (
    <Box pad="medium">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>
      
      {loading ? (
        <div>Loading reports...</div>
      ) : (
        <div>
          {/* Reports content */}
          <p>No reports found.</p>
        </div>
      )}
    </Box>
  );
};

export default Reports;
