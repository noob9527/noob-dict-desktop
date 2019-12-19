import React from 'react';
// import ReactJson from 'react-json-view';
import { INote } from '../../../../db/note';

interface NoteViewProps {
  note: INote
}

const NoteView: React.FC<NoteViewProps> = (props: NoteViewProps) => {
  const { note } = props;
  const { searchResult } = note;
  return (
    <div style={{ marginBottom: '50px' }}>
      <div>{JSON.stringify(searchResult)}</div>
      {/*<ReactJson src={searchResult}/>*/}
    </div>
  );
};

export default NoteView;