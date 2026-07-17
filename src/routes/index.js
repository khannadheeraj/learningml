import React from 'react'

const Dashboard = React.lazy(() => import('../components/Dashboard/index'))
const SendInvitationDashboard = React.lazy(() => import('../components/Invitation/index'))
const UploadContacts = React.lazy(() => import('../components/UploadContacts/index'))
const ManageContacts = React.lazy(() => import('../components/ManageContacts/index'))



const routes = [
    { path: '/', exact: true, name: 'Home', element: <Dashboard /> },
    { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
    { path: '/upload-contacts', name: 'Upload Contacts', roles: ['SUPER_ADMIN'], element: <UploadContacts /> },
    { path: '/send-invitation', name: 'Send Invitation', roles: ['SUPER_ADMIN'], element: <SendInvitationDashboard /> },
    // <Route path="/contacts" element={<ContactsListPage />} />
    { path: '/manage-contacts', name: 'Send Invitation', roles: ['SUPER_ADMIN'], element: <ManageContacts /> },

    //  { path: '/test-send-invitation', name: 'Test Send Invitation', element: <TestSendInvitation /> },

]

export default routes;
