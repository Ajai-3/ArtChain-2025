import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logo:React.FC = () => {
  const navigate = useNavigate();
  return (
    <h1 onClick={() => navigate('/')} className='text-main-color font-logo text-4xl font-bold'>ArtChain</h1>
  )
}

export default Logo