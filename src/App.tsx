import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import ComponentsDemo from './pages/ComponentsDemo'
import { SnackbarProvider } from './components/common/Snackbar'
// Import CSS
import './index.css'

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="components" element={<ComponentsDemo />} />
            {/* We point all other menu items to Dashboard for now to demonstrate layout */}
            <Route path="users" element={<Dashboard />} />
            <Route path="clients" element={<Dashboard />} />
            <Route path="hospitals/*" element={<Dashboard />} />
            <Route path="installation" element={<Dashboard />} />
            <Route path="amc-list" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  )
}

export default App
