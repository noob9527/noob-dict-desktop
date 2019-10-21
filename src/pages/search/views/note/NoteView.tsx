import React from 'react';
import { INote } from "../../../../shared/db/note";
import ReactJson from 'react-json-view';

interface NoteViewProps {
  note: INote
}

const NoteView: React.FC<NoteViewProps> = (props: NoteViewProps) => {
  const { note } = props;
  const { searchResult } = note;
  return (
    <div style={{ marginBottom: '50px' }}>
      <ReactJson src={searchResult}/>
    </div>
  );
};

export default NoteView;