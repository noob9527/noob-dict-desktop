import React from 'react';
import { ISearchHistory } from '../../../../common/model/history';
import styled from 'styled-components';
import { Table } from 'antd';
import moment from 'moment';
import _ from 'lodash';

interface HistoryViewProps {
  histories: ISearchHistory[]
}

const StyledTable = styled(Table)`

`;

const HistoryTable: React.FC<HistoryViewProps> = (props) => {
  const { histories } = props;

  const dataSource = _.chain(histories)
    .sortBy(e => e.createAt)
    .map((e, i) => {
      const first = i === 0;
      return {
        ...e,
        first,
        createAtStr: first ? 'Current' : moment(e.createAt).format('YYYY-MM-DD HH:mm:ss'),
        key: i,
      };
    }).value();

  const columns = [
    {
      title: 'Time',
      key: 'Time',
      dataIndex: 'createAtStr',
    },
    {
      title: 'Context',
      key: 'Context',
      dataIndex: 'context',
    },
  ];

  return (
    <>
      <StyledTable columns={columns} dataSource={dataSource}/>
    </>
  );
};

export default HistoryTable;