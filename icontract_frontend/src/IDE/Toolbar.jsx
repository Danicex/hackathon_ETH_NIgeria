import { useMyContext } from '@/Context/AppContext'
import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function Toolbar() {
  const [open, setOpen] = useState(false)
  const projectInfo = JSON.parse(localStorage.getItem('project_info')) || {
    name: 'no project',
    description: '',
    created_at: ''
  }
  return (
    <div className='px-4 pt-2'>
      <div className='flex justify-between items-start'>
        <div>
          <h2 className='bold capitalize'>{projectInfo.name}</h2>
          {open && (
            <div>
              <p className='text-gray-400'>Description: {projectInfo.description}</p>
              <small className='text-gray-500'>Created: {new Date(projectInfo.created_at).toLocaleString()}</small>
            </div>
          )}
        </div>

        <button className='p-0' onClick={() => setOpen(!open)}>{open ?
          <ChevronUp />
          :
          <ChevronDown />
        }</button>

      </div>

    </div>
  )
}
