import React from 'react'

function StepCard({ icon, title, description }) {
  return (
    <div
      className='max-w-72 px-6 py-8 text-center flex flex-col space-y-5 rounded-2xl'
      style={{ backgroundColor: '#EFEFEF' }}
    >
      <img src={icon} alt={`Icon ${title}`} className='h-8 mx-auto' />
      <p className='text-2xl'>{title}</p>
      <p className='text-sm'>{description}</p>
    </div>
  );
}

export default StepCard;