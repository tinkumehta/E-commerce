import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { Login, Register, Footer,
   Header, ProductDetails, ProductCreate, 
   Products, Profile } from './components'

import ProtectedRoute from './components/Pages/PrivateRoutes'

function App() {
  

  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route 
        path='/product/:id'
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
        />
        <Route
         path='/createproduct'
         element={
          <ProtectedRoute>
            <ProductCreate/>
          </ProtectedRoute>
         }
         />
        <Route
         path='/product'
         element={
          <ProtectedRoute>
            <Products/>
          </ProtectedRoute>
         }
         />
        <Route
         path='/profile'
         element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
         }
         />

    </Routes>
    <Footer />
    </BrowserRouter>
  )
}

export default App
