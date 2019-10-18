import React from 'react';
import { INote } from "../../../../shared/db/note";

interface NoteViewProps {
  note: INote
}

const NoteView: React.FC<NoteViewProps> = (props: NoteViewProps) => {
  const { note } = props;
  return (
    <div> {JSON.stringify(note, null, 2)} </div>
  );
};

export default NoteView;