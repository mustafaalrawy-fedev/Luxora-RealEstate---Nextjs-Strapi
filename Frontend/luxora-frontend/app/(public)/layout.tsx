import React from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const PublicLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default PublicLayout