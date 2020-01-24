import React, { Fragment, useCallback } from 'react';
import { ISearchHistory } from '../../../../common/model/history';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import { ThemedTextArea } from '../../../components/themed-ui/input/textarea';
import { Button, Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { DataWrapper } from './search-note-model';
import { InlineEditTextarea } from './inline-edit-textarea';

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
            {/*<th>Easy Edit</th>*/}
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
                  <InlineEditTextarea
                    showLoading={e.syncing}
                    editing={e.editing}
                    onEditingChange={value => {
                      // if it is the first element, we force the editing state
                      const editing = i === 0 || value;
                      dispatch({
                        type: 'searchNote/changeEditing',
                        payload: {
                          ...e,
                          editing,
                        },
                      });
                    }}
                    value={e.newData.context?.paragraph ?? ''}
                    placeholder={`give me more context about '${e.oldData.text}' to improve your memory`}
                    onChange={value => {
                      dispatch({
                        type: 'searchNote/typeHistoryContext',
                        payload: {
                          history: {
                            ...e.oldData,
                            context: {
                              ...e.oldData.context,
                              paragraph: value,
                            },
                          },
                        },
                      });
                    }}
                  />
                  {/*<div>typing: {e.typing + ''}</div>*/}
                  {/*<div>syncing: {e.syncing + ''}</div>*/}
                  {/*<div>dirty: {e.dirty + ''}</div>*/}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </>
  );
};

export default HistoryTable;