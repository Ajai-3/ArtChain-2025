import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo: React.FC = () => {
  const navigate = useNavigate();
  return (
    <h1
      onClick={() => navigate('/')}
      className='text-main-color font-logo text-4xl font-bold cursor-pointer'
    >
      ArtChain
    </h1>
  );
};

export default Logo;
