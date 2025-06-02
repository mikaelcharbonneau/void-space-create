
import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Card, CardBody, Avatar, Form, FormField, TextInput } from 'grommet';
import { Edit, User } from 'grommet-icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface UserProfile {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  department: string;
  updated_at: string;
}

interface UserStats {
  user_id: string;
  walkthroughs_completed: number;
  issues_resolved: number;
  reports_generated: number;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    department: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name,
          phone: data.phone || '',
          department: data.department
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box pad="medium" align="center" justify="center" fill>
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium" gap="medium">
      <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>
        Profile
      </Heading>

      <Card background="white" pad="medium">
        <CardBody gap="medium">
          <Box direction="row" align="center" gap="medium">
            <Avatar background="brand" size="large">
              <User />
            </Avatar>
            <Box>
              <Text size="large" weight="bold">
                {profile?.full_name || user?.email}
              </Text>
              <Text color="text-weak">{user?.email}</Text>
              {profile?.department && (
                <Text size="small" color="text-weak">
                  {profile.department}
                </Text>
              )}
            </Box>
            <Box margin={{ left: 'auto' }}>
              <Button
                icon={<Edit />}
                label={editing ? 'Cancel' : 'Edit'}
                onClick={() => setEditing(!editing)}
                secondary
              />
            </Box>
          </Box>

          {editing ? (
            <Form
              onSubmit={handleSave}
              value={formData}
              onChange={setFormData}
            >
              <FormField name="full_name" label="Full Name">
                <TextInput name="full_name" />
              </FormField>
              <FormField name="phone" label="Phone">
                <TextInput name="phone" />
              </FormField>
              <FormField name="department" label="Department">
                <TextInput name="department" />
              </FormField>
              <Box direction="row" gap="small" justify="center">
                <Button type="submit" primary label="Save Changes" />
                <Button
                  type="button"
                  label="Cancel"
                  onClick={() => setEditing(false)}
                />
              </Box>
            </Form>
          ) : (
            <Box gap="small">
              <Box direction="row" justify="between">
                <Text weight="bold">Full Name:</Text>
                <Text>{profile?.full_name || 'Not set'}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Phone:</Text>
                <Text>{profile?.phone || 'Not set'}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Department:</Text>
                <Text>{profile?.department || 'Not set'}</Text>
              </Box>
            </Box>
          )}
        </CardBody>
      </Card>

      {stats && (
        <Card background="white" pad="medium">
          <CardBody>
            <Heading level={3} margin={{ top: 'none', bottom: 'medium' }}>
              Statistics
            </Heading>
            <Box gap="small">
              <Box direction="row" justify="between">
                <Text weight="bold">Walkthroughs Completed:</Text>
                <Text>{stats.walkthroughs_completed}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Issues Resolved:</Text>
                <Text>{stats.issues_resolved}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Reports Generated:</Text>
                <Text>{stats.reports_generated}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default Profile;
