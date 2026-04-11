import React from 'react'
import { Routes, Route } from 'react-router-dom' // Routes replaces Switch

import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Detail from '../pages/detail/Detail'
import SignInPage from '../pages/SignInPage'
import SignUpPage from '../pages/SignUpPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/:category/search/:keyword" element={<Catalog />} />
      <Route path="/:category/:id" element={<Detail />} />
      <Route path="/:category" element={<Catalog />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes
