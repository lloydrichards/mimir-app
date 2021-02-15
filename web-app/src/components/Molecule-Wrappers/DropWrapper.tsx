import React from 'react';

interface Props {
  onOpen: (state: boolean) => void;
  onDrop: (data: any, status: string) => void;
  status: string;
}

const DropWrapper: React.FC<Props> = ({ onOpen, onDrop, status, children }) => {
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const data = e.dataTransfer.getData('id');
    onOpen(false);
    onDrop(data, status);
  };
  return (
    <div
      onDragOver={allowDrop}
      onDragLeave={() => onOpen(false)}
      onDragEnter={() => onOpen(true)}
      onDrop={handleDrop}
      className='drop-wrapper'>
      {children}
    </div>
  );
};

export default DropWrapper;
