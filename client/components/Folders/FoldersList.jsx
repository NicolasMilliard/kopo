import React from 'react';
import Link from 'next/link';

const FoldersList = ({ folders }) => {
  return (
    <div className='flex flex-wrap mt-20 mb-8'>
      {folders.map(folder => (
        <Link key={folder.folderId} href={`/folders/${folder.newFolder}`}>
          <div className='kopo-folder-container mr-8 mb-8 hover:drop-shadow-lg'>
            <div className='kopo-folder-wrapper'>
              <h3 className='kopo-folder-title'>{folder.folderId.slice(0, 5)}...{folder.folderId.slice(folder.folderId.length - 4)}</h3>
              <p className='kopo-folder-step'></p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FoldersList