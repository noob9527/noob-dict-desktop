import React from 'react';
import { IHistory } from "../../../../shared/db/history";
import ReactJson from "react-json-view";

interface HistoryViewProps {
  histories: IHistory[]
}

const HistoryView: React.FC<HistoryViewProps> = (props: HistoryViewProps) => {
  const { histories } = props;
  return (
    <div style={{ marginBottom: '50px' }}>
      {JSON.stringify(histories)}
    </div>
  );
};

export default HistoryView;