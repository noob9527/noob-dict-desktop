import React, { Fragment } from 'react';
import { ISearchHistory } from '../../../../common/model/history';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import { ThemedTextArea } from '../../../components/themed-ui/input/textarea';
import { Button, Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { DataWrapper } from './search-note-model';

interface HistoryViewProps {
  histories: {
    [index: number]: DataWrapper<ISearchHistory>
  }
}


const Container = styled.div`
  table{
    width: 100%
    tr {
      text-align: center;
      td.paragraph {
        height: 31px; // work as min-height
        text-align: left;
      }
    }
    thead > tr {
      th:nth-child(1) {
        width: 12em; 
      }
    }
  }
`;

const EditorContainer = styled.div`
  position: relative;
  .ant-input-affix-wrapper {
    width: calc(100% - 21px);
  }
  //i.ant-input-textarea-clear-icon {
  //  z-index: 999; 
  //}
  i.anticon-loading {
    position: absolute;
    right: 0;
    //right: 7px;
    top: calc(50% - 7px);

    transition: opacity 2s ease;
    opacity: 0;
    &.loading {
      opacity: 1;
    }
  }
`;

const HistoryTable: React.FC<HistoryViewProps> = (props) => {
  const dispatch = useDispatch();
  const histories = _.sortBy(Object.values(props.histories), e => {
    return -e.oldData.createAt;
  });

  return (
    <>
      <Container>
        <table>
          <thead>
          <tr>
            <th>Time</th>
            <th>Context</th>
            {/*<th>Action</th>*/}
          </tr>
          </thead>
          <tbody>
          {histories
            .filter((e, i) => {
              return !i || e.oldData.context!!;
            })
            .map((e, i) => (
              <tr key={(e.id ?? 0).toString()}>
                <td>
                  {
                    i ? moment(e.oldData.createAt).format('YYYY-MM-DD HH:mm:ss')
                      : 'Current'
                  }
                </td>
                <td className={'paragraph'}>
                  {
                    !e.editing ? <div style={{ whiteSpace: 'pre-line' }}>{e.oldData.context?.paragraph}</div>
                      :
                      <EditorContainer>
                        <ThemedTextArea
                          value={e.newData.context?.paragraph ?? ''}
                          placeholder={`give me more context about '${e.oldData.text}' to improve your memory`}
                          autoSize={{ minRows: 1 }}
                          allowClear={true}
                          onChange={event => {
                            dispatch({
                              type: 'searchNote/typeHistoryContext',
                              payload: {
                                history: {
                                  ...e.oldData,
                                  context: {
                                    ...e.oldData.context,
                                    paragraph: event.currentTarget.value,
                                  },
                                },
                              },
                            });
                          }}
                        />
                        <Icon className={e.syncing ? 'loading' : ''} type="loading"/>
                      </EditorContainer>
                  }
                </td>
                {/*<td>*/}
                {/*  /!*<div>typing: {e.typing + ''}</div>*!/*/}
                {/*  /!*<div>syncing: {e.syncing + ''}</div>*!/*/}
                {/*  /!*<div>dirty: {e.dirty + ''}</div>*!/*/}
                {/*</td>*/}
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </>
  );
};

export default HistoryTable;