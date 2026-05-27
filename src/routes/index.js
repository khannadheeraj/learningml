import React from 'react'
import SendInvitationDashboard from '../components/Invitation';

const Dashboard = React.lazy(() => import('../components/Dashboard/index'))
const LogOut = React.lazy(() => import('../components/LogOut/index'))



const routes = [
    { path: '/', exact: true, name: 'Home', element: <Dashboard /> },
    { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
    { path: '/logout', name: 'Logout', element: <LogOut /> },
    { path: '/send-invitation', name: 'Send Invitation', element: <SendInvitationDashboard /> },

]

export default routes;
