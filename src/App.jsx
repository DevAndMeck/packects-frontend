import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Login } from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminClients from './pages/AdminClients';
import AdminEmployees from './pages/AdminEmployes';
import AdminProducts from './pages/AdminProducts';
import AdminSales from './pages/AdminSales';
// import Navbar from './components/dashboard/Navbar';
// import AdminSidebar from './components/dashboard/AdminSidebar';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<Navigate to="admin-dashboard" />}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
        <Route path="/admin-empleados" element={<AdminEmployees />} />
        <Route path="/admin-ventas" element={<AdminSales />} />
        <Route path="/admin-clientes" element={<AdminClients />} />
        <Route path="/admin-productos" element={<AdminProducts />} />
        <Route path='/employee-dashboard' element={<EmployeeDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
