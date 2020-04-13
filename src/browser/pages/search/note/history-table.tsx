import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import { Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { SearchNoteState } from './search-note-model';
import { InlineEditTextarea } from './inline-edit-textarea';
import { InlineEditText } from './inline-edit-text';
import { useSelector } from 'dva';

interface HistoryViewProps {
}


const Container = styled.div`
  table {
    table-layout: fixed;
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
        width: 1em; 
      }
      th:nth-child(2) {
        width: 12em; 
      }
      th:nth-child(4) {
        width: 10em; 
      }
    }
  }
  tbody > tr {
    // loading spin
    td:nth-child(1) {
      i.anticon-loading {
        transition: opacity 2s ease;
        opacity: 0;
        &.loading {
          opacity: 1;
        }
      }
    }
  }
`;

const HistoryTable: React.FC<HistoryViewProps> = (props) => {
  const dispatch = useDispatch();
  const noteState: SearchNoteState = useSelector((state: any) => state.searchNote);
  const histories = _.sortBy(Object.values(noteState.histories), e => {
    return -e.oldData.create_at;
  });
  return (
    <>
      <Container>
        <table>
          <thead>
          <tr>
            <th/>
            <th>Time</th>
            <th>Context</th>
            <th>Source</th>
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
                  <Icon className={e.showSpinner ? 'loading' : ''} type="loading"/>
                </td>
                <td>
                  {
                    i ? moment(e.oldData.create_at).format('YYYY-MM-DD HH:mm:ss')
                      : 'Current'
                  }
                </td>
                <td className={'paragraph'}>
                  <InlineEditTextarea
                    editing={e.editing}
                    autoFocus={i !== 0} // disable autoFocus on the first element, cuz it leads a ui bug
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
                <td className={'source'}>
                  <InlineEditText
                    historyWrapper={e}
                    autoFocus={i !== 0} // disable autoFocus on the first element, cuz it leads a ui bug
                    onEditingChange={value => {
                      dispatch({
                        type: 'searchNote/changeEditing',
                        payload: {
                          ...e,
                          editing: value,
                        },
                      });
                    }}
                    placeholder={'source'}
                  />
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