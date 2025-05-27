import express from 'express';
import cors from 'cors';
import { getInspections } from './GetInspections';
import submitInspection from './SubmitInspection';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mount the API endpoints
app.get('/api/inspections', getInspections);
app.post('/api/SubmitInspection', submitInspection);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});