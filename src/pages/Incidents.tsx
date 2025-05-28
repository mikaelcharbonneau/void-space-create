import React from 'react';
import { format } from 'date-fns';

interface Issue {
  id: string;
  datacenter: string;
  datahall: string;
  rack_number: string;
  part_type: string;
  part_identifier: string;
  u_height: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  comments: string | null;
  reported_by: string;
  reported_at: string;
  report_id: string;
}

const Incidents: React.FC = () => {
  // Using an empty array as placeholder since the actual data fetching logic isn't shown
  const filteredIssues: Issue[] = [];

  return (
    <div className="p-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datacenter</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Hall</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rack</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">U Height</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredIssues.map((issue) => (
            <tr key={issue.id}>
              <td className="px-6 py-4 whitespace-nowrap">{issue.datacenter}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.datahall}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.rack_number}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.part_type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.part_identifier}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.u_height || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.severity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{issue.comments || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{format(new Date(issue.reported_at), 'MMM d, yyyy')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Incidents;