import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className={`p-4 rounded-lg shadow-lg ${color}`}>
      <div className='flex items-center'>
        {icon}
        <div className='ml-4'>
          <h4 className='text-lg font-bold text-white'>{text}</h4>
          <p className='text-2xl font-bold text-white'>{number}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
