import React from 'react';
import { ISearchHistory } from '../../../../common/model/history';
import styled from 'styled-components';

interface HistoryViewProps {
  histories: ISearchHistory[]
}


const Container = styled.div`

`;

const HistoryTable: React.FC<HistoryViewProps> = (props) => {
  const { histories } = props;

  return (
    <>
      <Container>
        <table>
          <thead>
          <tr>
            <th>Time</th>
            <th>Context</th>
          </tr>
          </thead>
          <tbody>
          {histories.map((e, i) => (
            <tr key={i}>
              <td>{new Date(e.createAt).toISOString()}</td>
              <td>{e.context}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </Container>
    </>
  );
};

export default HistoryTable;