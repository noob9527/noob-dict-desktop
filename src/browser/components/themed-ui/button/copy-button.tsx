import React from 'react';
import { ThemedTooltip } from '../tooltip/tooltip';
import { Button, Icon } from 'antd';
import styled from 'styled-components';
import { ButtonProps } from 'antd/lib/button';
import ColorId from '../../../styles/ColorId';

const Container = styled(Button)`
  &.ant-btn {
    height: unset;
  }
  .anticon {
    color: ${props => props.theme[ColorId.word_link]};
  }
`;

interface CopyButtonProps extends ButtonProps {
  tooltip?: string
}

const defaultCopyButtonProps: CopyButtonProps = {
  tooltip: 'copy',
};

export const CopyButton: React.FC<CopyButtonProps> = (props: CopyButtonProps) => {
  return (
    <ThemedTooltip title={props.tooltip}>
      <Container
        tabIndex={-1}
        type="link"
        shape="circle"
        ghost
        {...props}
        >
        <Icon type="copy"/>
      </Container>
    </ThemedTooltip>
  );
};

CopyButton.defaultProps = defaultCopyButtonProps;
