import { AiFillPlusCircle } from 'react-icons/ai';
import Members from './Members';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import MainWindow from './MainWindow';

export default function CreateHeader({ onClick }) {
  return (
    <div className='flex flex-col'>
      <div className='flex mr-5 h-16 font-bold justify-between'>
        <div className='flex items-center'>
          <h3 className='font-extrabold text-3xl m-0'>Create Task</h3>
          <AiFillPlusCircle onClick={onClick} className='h-12 w-12 mb-1 ml-1 cursor-pointer' />
        </div>
        <Members />
      </div>
    </div>
  );
}
