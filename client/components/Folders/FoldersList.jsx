import Link from 'next/link';
import React from 'react';

const FoldersList = ({ folders }) => {
  return (
    <div className="flex flex-wrap mt-20 mb-8">
      {folders.map((folder) => (
        <Link key={folder.folderId} href={`/folders/${folder.newFolder}`}>
          <div className="kopo-folder-container mr-8 mb-8 hover:drop-shadow-lg">
            <div className="kopo-folder-wrapper">
              <h3 className="kopo-folder-title">
                {
                  folder.folderName.length > 0 ?
                    <span>{folder.folderName}</span>
                    :
                    <span>Votre dossier</span>
                }
              </h3>
              <h4 className='italic mt-2 text-sm'>{folder.folderId.slice(0, 5)}...{folder.folderId.slice(folder.folderId.length - 4)}</h4>
              <p className="kopo-folder-step"></p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FoldersList;
