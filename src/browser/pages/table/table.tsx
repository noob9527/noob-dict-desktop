import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { TableState } from './table-model';
import { Table } from 'antd';
import moment from 'moment';
import { EditableCell } from './editable-cell';
import { FilterDropDown } from './filter-dropdown';
import { ThemedContent } from '../../components/themed-ui/content/content';
import ColorId from '../../styles/ColorId';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

// @ts-ignore
const TableContainer = styled(ThemedContent)`
  padding: 20px;
  height: 100%;
`;

const StyledTable = styled(Table)`
  height: 100%;
  //overflow: hidden;
  //max-height: 80vh;
  table {
    border-radius: 0 !important;
  }
  .ant-table-header {
    color: ${props => props.theme[ColorId.foreground]};
    background-color: ${props => props.theme[ColorId.background]};
  }

  .ant-table-thead tr th {
    color: ${props => props.theme[ColorId.foreground]};
    background-color: ${props => props.theme[ColorId.background]};
  }
  .ant-table-row {
    color: ${props => props.theme[ColorId.foreground]};
    background-color: ${props => props.theme[ColorId.background]};
    &:hover > td {
      color: ${props => props.theme[ColorId.foreground]} !important;
      background-color: ${props => props.theme[ColorId.background]} !important;
    }
  }

  .ant-pagination {
    .ant-pagination-item {
      a {
        color: ${props => props.theme[ColorId.foreground]};
        background-color: ${props => props.theme[ColorId.background]};
      }
    }
    .ant-pagination-prev,.ant-pagination-next,.ant-pagination-jump-next {
      .ant-pagination-item-link {
        color: ${props => props.theme[ColorId.foreground]};
        background-color: ${props => props.theme[ColorId.background]};
      }
    }
    .ant-pagination-item-container .ant-pagination-item-ellipsis {
      color: ${props => props.theme[ColorId.foreground]};
      background-color: ${props => props.theme[ColorId.background]};
    }
  }

  .ant-table-placeholder{
    border-radius: 0;
    p {
      color: ${props => props.theme[ColorId.foreground]};
    }
    color: ${props => props.theme[ColorId.foreground]};
    background-color: ${props => props.theme[ColorId.background]};
  }
`;

const StyledColumn = styled(Table.Column)`

`;

const TablePage: React.FC = () => {
  const dispatch = useDispatch();
  const tableState: TableState = useSelector((state: any) => state.table);
  const {
    historyParam,
    loading,
    totalCount: total,
  } = tableState;
  const {
    page,
    size,
  } = historyParam;

  const histories = Object.values(tableState.histories).map(e => {
    return {
      ...e,
      createAtStr: moment(e.newData.create_at).format('YY/MM/DD HH:mm'),
      // updateAtStr: moment(e.newData.update_at).format('YY/MM/DD HH:mm'),
    };
  });

  useEffect(() => {
    dispatch({
      type: 'table/fetchHistories',
    });
  }, []);

  function handleSave(id: number) {
    dispatch({
      type: 'table/syncHistoryContext',
      payload: {
        history_id: id,
      },
    });
    dispatch({
      type: 'table/changeEditing',
      payload: {
        id,
        editing: false,
      },
    });
  }

  function handleCancel(id: number) {
    dispatch({
      type: 'table/cancelChangeHistory',
      payload: {
        history_id: id,
      },
    });
    handleEditingChange(id, false);
  }

  function handleEditingChange(id: number, editing: boolean) {
    dispatch({
      type: 'table/changeEditing',
      payload: {
        id,
        editing,
      },
    });
  }

  function handleTableChange(pagination, filters, sorter) {
    dispatch({
      type: 'table/changeHistoryParams',
      payload: {
        page: pagination.current,
        size: pagination.pageSize,
        textLike: filters['text']?.[0],
        sourceLike: filters['source']?.[0],
      },
    });
  }

  return (
    <>
      <Container>
        <TableContainer>
          <StyledTable
            bordered
            dataSource={histories}
            rowKey={(e: any) => e.id}
            pagination={{
              // position: 'top',
              hideOnSinglePage: false,
              current: page,
              pageSize: size,
              total,
            }}
            // https://github.com/ant-design/ant-design/issues/12088
            scroll={{ y: 'calc(100vh - 160px)' }}
            loading={loading}
            onChange={handleTableChange}
          >
            <StyledColumn
              title="text"
              dataIndex="newData.text"
              key="text"
              filterDropdown={(props: any) =>
                <FilterDropDown {...props} />
              }
              width={160}
              render={(text, record: any) => {
                return (
                  <span><a
                    onClick={() => {
                      dispatch({
                        type: 'search/search',
                        payload: {
                          text,
                        },
                      });
                    }}
                  >{text}</a></span>
                );
              }}
            />
            <StyledColumn
              title="context"
              dataIndex="newData.context.paragraph"
              key="paragraph"
              onCell={(record: any) => ({
                record,
              })}
              render={(text, record: any) => {
                return (<EditableCell
                  record={record}
                  value={record.newData.context?.paragraph}
                  inputType={'text-area'}
                  onChange={(value) => {
                    dispatch({
                      type: 'table/changeHistory',
                      payload: {
                        history: {
                          ...record.newData,
                          context: {
                            ...record.newData.context,
                            paragraph: value,
                          },
                        },
                      },
                    });
                  }}
                />);
              }}
            />
            <StyledColumn
              title="source"
              dataIndex="newData.context.source"
              key="source"
              onCell={(record: any) => ({
                record,
              })}
              filterDropdown={(props: any) =>
                <FilterDropDown {...props} />
              }
              render={(text, record: any) => {
                return (<EditableCell
                  record={record}
                  value={record.newData.context?.source}
                  inputType={'text'}
                  onChange={(value) => {
                    dispatch({
                      type: 'table/changeHistory',
                      payload: {
                        history: {
                          ...record.newData,
                          context: {
                            ...record.newData.context,
                            source: value,
                          },
                        },
                      },
                    });
                  }}
                />);
              }}
              width={180}
            />
            <StyledColumn
              title="create time"
              dataIndex="createAtStr"
              key="createAt"
              onCell={(record: any) => ({
                record,
              })}
              width={130}
            />
            {/*<StyledColumn*/}
            {/*  title="update time"*/}
            {/*  dataIndex="updateAtStr"*/}
            {/*  key="updateAt"*/}
            {/*  onCell={(record) => ({*/}
            {/*    record,*/}
            {/*  })}*/}
            {/*  width={130}*/}
            {/*/>*/}
            <StyledColumn
              title="operation"
              dataIndex="operation"
              width={130}
              render={(text, record: any) => {
                if (record.editing) {
                  return (
                    <span>
                      <a
                        onClick={() => handleSave(record.id)}
                        style={{ marginRight: 8 }}
                      >Save</a>
                      <a
                        onClick={() => {
                          handleCancel(record.id);
                        }}
                      >Cancel</a>
                    </span>
                  );
                } else {
                  return (
                    <a
                      onClick={() => {
                        handleEditingChange(record.id, true);
                      }}
                    >Edit</a>
                  );
                }
              }}/>
          </StyledTable>
        </TableContainer>
      </Container>
    </>
  )
    ;
};

export { TablePage };
