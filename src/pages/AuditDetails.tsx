import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Card, CardBody, Text, Button, DataTable } from 'grommet';
import { ArrowLeft } from 'grommet-icons';
import { supabase } from '../lib/supabaseClient';
import StatusChip from '../components/ui/StatusChip';

interface AuditDetails {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
  updated_at: string;
  location: string;
  findings: Finding[];
}

interface Finding {
  id: string;
  description: string;
  severity: 'Healthy' | 'Warning' | 'Critical';
  status: 'open' | 'in-progress' | 'resolved';
  audit_id: string;
  created_at: string;
}

const AuditDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auditDetails, setAuditDetails] = useState<AuditDetails | null>(null);
   const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      if (!id) {
        console.error("No audit ID provided");
        return;
      }

      try {
        setLoading(true);
        // Fetch audit details
        const { data: auditData, error: auditError } = await supabase
          .from('audits')
          .select('*')
          .eq('id', id)
          .single();

        if (auditError) {
          throw auditError;
        }

        if (auditData) {
          setAuditDetails(auditData);
        } else {
          console.log(`Audit with id ${id} not found`);
          setAuditDetails(null);
        }

         // Fetch findings related to the audit
         const { data: findingsData, error: findingsError } = await supabase
         .from('findings')
         .select('*')
         .eq('audit_id', id);

       if (findingsError) {
         throw findingsError;
       }

       if (findingsData) {
         setFindings(findingsData);
       } else {
         console.log(`Findings for audit id ${id} not found`);
         setFindings([]);
       }
      } catch (error) {
        console.error("Error fetching audit details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditDetails();
  }, [id]);

  const columns = [
    {
      property: 'description',
      header: <Text weight="bold">Finding</Text>,
      primary: true,
    },
    {
      property: 'severity',
      header: <Text weight="bold">Severity</Text>,
      render: (datum: Finding) => <StatusChip status={datum.severity} size="small" />,
    },
    {
      property: 'status',
      header: <Text weight="bold">Status</Text>,
       render: (datum: Finding) => <StatusChip status={datum.status} size="small" />,
    },
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!auditDetails) {
    return (
      <Box>
        <Text>Audit not found.</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium" gap="small">
      <Button
        icon={<ArrowLeft />}
        label="Back to Audits"
        onClick={() => navigate('/inspections')}
        alignSelf="start"
      />
      <Heading level={2}>{auditDetails.title}</Heading>
      <Card background="white" elevation="small">
        <CardBody pad="medium">
          <Box gap="small">
            <Text weight="bold">Description:</Text>
            <Text>{auditDetails.description}</Text>
          </Box>
          <Box gap="small">
            <Text weight="bold">Location:</Text>
            <Text>{auditDetails.location}</Text>
          </Box>
          <Box gap="small">
            <Text weight="bold">Status:</Text>
            <StatusChip status={auditDetails.status} />
          </Box>
          <Box gap="small">
            <Text weight="bold">Created At:</Text>
            <Text>{new Date(auditDetails.created_at).toLocaleDateString()}</Text>
          </Box>
          <Box gap="small">
            <Text weight="bold">Updated At:</Text>
            <Text>{new Date(auditDetails.updated_at).toLocaleDateString()}</Text>
          </Box>
        </CardBody>
      </Card>

      <Heading level={3}>Findings</Heading>
       {findings.length > 0 ? (
        <Card background="white" elevation="small">
        <CardBody pad="medium">
          <DataTable
            columns={columns}
            data={findings}
          />
           </CardBody>
        </Card>
         ) : (
          <Text>No findings reported.</Text>
        )}
    </Box>
  );
};

export default AuditDetails;
