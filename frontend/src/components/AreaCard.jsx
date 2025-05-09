import React from 'react';
import pocket from '../image/pocket.svg';

function AreaCard({ imageArea, title, description, grade }) {
  return (
    <div className='px-24 flex flex-row space-x-4'>
      <div className="bg-white rounded-xl shadow-xl p-2 relative group w-60 h-60 overflow-hidden">
        <img src={imageArea} alt={`Icon ${title}`} className='w-full h-full object-cover object-center'
        />
      </div>
      <div className='bg-white rounded-xl py-6 px-8 shadow-xl flex flex-col space-y-10 flex-grow w-40'>
        <div className='space-y-6'>
          <h4 className='font-bold'>{title}</h4>
          <p>{description}</p>
        </div>
        <div className='flex flex-row items-center space-x-3'>
          <img src={pocket} alt="Icon Grade" className='h-4' />
          <p className='text-sm'>Grados: {grade}</p>
        </div>
      </div>
    </div>
  );
}

export default AreaCard;