import React from 'react';
import styled from 'styled-components';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';
import { Icon } from 'antd';
import { ThemedTooltip } from '../../themed-ui/tooltip/tooltip';

const Container = styled.span`
`;

interface EcDictCollinsProp {
  result: EcDictSearchSuccessResult
  className?: string
}

export const EcDictCollins: React.FC<EcDictCollinsProp> = (props: EcDictCollinsProp) => {
  const { result} = props;
  const tooltip = (<>
    <div>{`英国国家语料库词频排序: ${result.bnc}`}</div>
    <div>{`当代语料库词频排序: ${result.frq}`}</div>
  </>);
  return (
    <Container className={props.className}>
      <ThemedTooltip title={tooltip}>
        <span>柯林斯星级: </span>
        {Array.from({ length: 5 }).map((e, i) => {
          return (<Icon type={'star'} key={i} theme={i + 1 > (result.collins ?? 0) ? 'outlined':'filled'}/>);
        })}
      </ThemedTooltip>
    </Container>
  );
};
