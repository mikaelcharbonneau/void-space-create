
import { useState } from 'react';
import { Box, Card, CardBody, CardHeader, Button, Form, FormField, TextInput } from 'grommet';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@hpe.com',
    phone: '+1 (555) 123-4567',
    location: 'San Jose, CA',
    department: 'IT Operations',
    joinDate: '2022-03-15',
    role: 'Senior Technician'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form logic would go here
  };

  return (
    <Box pad="medium" gap="medium">
      <Box direction="row" justify="between" align="center">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!isEditing ? (
          <Button
            icon={<Edit2 size={16} />}
            label="Edit Profile"
            onClick={() => setIsEditing(true)}
            primary
          />
        ) : (
          <Box direction="row" gap="small">
            <Button
              icon={<Save size={16} />}
              label="Save"
              onClick={handleSave}
              primary
            />
            <Button
              icon={<X size={16} />}
              label="Cancel"
              onClick={handleCancel}
              secondary
            />
          </Box>
        )}
      </Box>

      <Box direction="row" gap="large" wrap>
        <Card flex="grow" margin="none">
          <CardHeader pad="medium" background="light-2">
            <Box direction="row" align="center" gap="small">
              <User size={20} />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </Box>
          </CardHeader>
          <CardBody pad="medium">
            {isEditing ? (
              <Form>
                <FormField label="Full Name">
                  <TextInput
                    value={userInfo.name}
                    onChange={(event) => setUserInfo({...userInfo, name: event.target.value})}
                  />
                </FormField>
                <FormField label="Email">
                  <TextInput
                    value={userInfo.email}
                    onChange={(event) => setUserInfo({...userInfo, email: event.target.value})}
                  />
                </FormField>
                <FormField label="Phone">
                  <TextInput
                    value={userInfo.phone}
                    onChange={(event) => setUserInfo({...userInfo, phone: event.target.value})}
                  />
                </FormField>
                <FormField label="Location">
                  <TextInput
                    value={userInfo.location}
                    onChange={(event) => setUserInfo({...userInfo, location: event.target.value})}
                  />
                </FormField>
              </Form>
            ) : (
              <Box gap="medium">
                <Box direction="row" align="center" gap="small">
                  <User size={16} />
                  <Box>
                    <text className="text-sm text-gray-500">Full Name</text>
                    <text className="font-medium">{userInfo.name}</text>
                  </Box>
                </Box>
                <Box direction="row" align="center" gap="small">
                  <Mail size={16} />
                  <Box>
                    <text className="text-sm text-gray-500">Email</text>
                    <text className="font-medium">{userInfo.email}</text>
                  </Box>
                </Box>
                <Box direction="row" align="center" gap="small">
                  <Phone size={16} />
                  <Box>
                    <text className="text-sm text-gray-500">Phone</text>
                    <text className="font-medium">{userInfo.phone}</text>
                  </Box>
                </Box>
                <Box direction="row" align="center" gap="small">
                  <MapPin size={16} />
                  <Box>
                    <text className="text-sm text-gray-500">Location</text>
                    <text className="font-medium">{userInfo.location}</text>
                  </Box>
                </Box>
              </Box>
            )}
          </CardBody>
        </Card>

        <Card flex="grow" margin="none">
          <CardHeader pad="medium" background="light-2">
            <Box direction="row" align="center" gap="small">
              <Calendar size={20} />
              <h2 className="text-lg font-semibold">Work Information</h2>
            </Box>
          </CardHeader>
          <CardBody pad="medium">
            <Box gap="medium">
              <Box>
                <text className="text-sm text-gray-500">Department</text>
                <text className="font-medium">{userInfo.department}</text>
              </Box>
              <Box>
                <text className="text-sm text-gray-500">Role</text>
                <text className="font-medium">{userInfo.role}</text>
              </Box>
              <Box>
                <text className="text-sm text-gray-500">Join Date</text>
                <text className="font-medium">{new Date(userInfo.joinDate).toLocaleDateString()}</text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      <Card margin="none">
        <CardHeader pad="medium" background="light-2">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody pad="medium">
          <Box direction="row" gap="medium" justify="center">
            <Button label="Change Password" secondary />
            <Button label="Export Data" secondary />
            <Button label="Account Settings" secondary />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Profile;
