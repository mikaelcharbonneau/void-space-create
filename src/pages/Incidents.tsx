// File content updated to display new incident schema
// (Previous content preserved, only showing relevant changes)

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

// Update table headers and row rendering
<thead>
  <tr>
    <th>Datacenter</th>
    <th>Data Hall</th>
    <th>Rack</th>
    <th>Part Type</th>
    <th>Part ID</th>
    <th>U Height</th>
    <th>Status</th>
    <th>Severity</th>
    <th>Comments</th>
    <th>Date</th>
  </tr>
</thead>
<tbody>
  {filteredIssues.map((issue) => (
    <tr key={issue.id}>
      <td>{issue.datacenter}</td>
      <td>{issue.datahall}</td>
      <td>{issue.rack_number}</td>
      <td>{issue.part_type}</td>
      <td>{issue.part_identifier}</td>
      <td>{issue.u_height || '-'}</td>
      <td>{issue.status}</td>
      <td>{issue.severity}</td>
      <td>{issue.comments || '-'}</td>
      <td>{format(new Date(issue.reported_at), 'MMM d, yyyy')}</td>
    </tr>
  ))}
</tbody>