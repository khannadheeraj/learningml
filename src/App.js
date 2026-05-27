import React, { Suspense } from 'react'
import './scss/style.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './routes/routesConfig'

import '../src/styles/styles.css';  // Path to your CSS file


const loading = (<div className="pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>)

/*Containers */
const DefaultLayout = React.lazy(() => import('./layouts/index'))
const Login = React.lazy(() => import('./components/Login/index'))

const App = () => {

  return (
    <Router>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" name="Login" element={<PublicRoute element={<Login />} />} />
          <Route path="*" name="Home" element={<PrivateRoute element={<DefaultLayout />} />} />
        </Routes>
      </Suspense>
    </Router>
  )

}

export default App;
