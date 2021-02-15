import { SettingsPhoneTwoTone } from '@material-ui/icons';
import React from 'react';

interface Props {
  id: string;
}

const DraggableWrapper: React.FC<Props> = ({ id, children }) => {
  const onOpen = () => {};
  const onDragStart = ({ dataTransfer, target }: React.DragEvent) => {
    dataTransfer.setData('id', id);
    setTimeout(() => {
      (target as any).style.visibility = 'hidden';
    }, 1);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const onDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    (e.target as any).style.visibility = 'visible';
  };
  return (
    <div
      draggable
      onClick={onOpen}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}>
      {children}
    </div>
  );
};

export default DraggableWrapper;
