import React from 'react';
import { IHistory } from "../../../../shared/db/history";

interface HistoryViewProps {
  histories: IHistory[]
}

const HistoryView: React.FC<HistoryViewProps> = (props: HistoryViewProps) => {
  const { histories } = props;
  return (
    <div> {JSON.stringify(histories, null, 2)} </div>
  );
};

export default HistoryView;