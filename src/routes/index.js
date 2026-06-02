import React from 'react'

const Dashboard = React.lazy(() => import('../components/Dashboard/index'))
const LogOut = React.lazy(() => import('../components/LogOut/index'))
const SendInvitationDashboard = React.lazy(() => import('../components/Invitation/index'))
const TestSendInvitation = React.lazy(() => import('../components/Invitation/TestSendInvitation'))
const UploadContacts = React.lazy(() => import('../components/UploadContacts/index'))



const routes = [
    { path: '/', exact: true, name: 'Home', element: <Dashboard /> },
    { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
    { path: '/logout', name: 'Logout', element: <LogOut /> },
    { path: '/upload-contacts', name: 'Upload Contacts', element: <UploadContacts /> },
    { path: '/send-invitation', name: 'Send Invitation', element: <SendInvitationDashboard /> },
     { path: '/test-send-invitation', name: 'Test Send Invitation', element: <TestSendInvitation /> },

]

export default routes;
