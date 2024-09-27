import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import router from './Routes/Routes.jsx';
import AuthProvider from './context/AuthProvider.jsx';


  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>  {/* Wrap your application with AuthProvider */}
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>,
  );