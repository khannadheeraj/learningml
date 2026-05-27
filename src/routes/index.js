import React from 'react'

const Dashboard = React.lazy(() => import('../components/Dashboard/index'))
const Colleges = React.lazy(() => import('../components/Colleges/index'))
const CollegeConfigurationForm = React.lazy(() => import('../components/Colleges/CollegeConfigurationForm/index'))
const LogOut = React.lazy(() => import('../components/LogOut/index'))



const routes = [
    { path: '/', exact: true, name: 'Home', element: <Dashboard /> },
    { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },

    // { path: '/colleges', name: 'Colleges', element: <Colleges /> },
    // { path: '/college-configuration/create', name: 'Colleges', element: <CollegeConfigurationForm /> },
    
    { path: '/logout', name: 'Logout', element: <LogOut /> },

]

export default routes;
