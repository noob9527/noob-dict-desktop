import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Empty } from 'antd';
import { EmptyProps } from 'antd/es/empty';

const StyledEmpty = styled(Empty)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ThemedEmpty: React.FC<EmptyProps> = (props) => {
  const p = Object.assign({}, {
    description: 'No Result'
  }, props);
  return <Fragment>
    <StyledEmpty {...p} />
  </Fragment>;
};


export { ThemedEmpty };
