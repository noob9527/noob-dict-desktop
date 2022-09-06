import React from 'react';
import styled from 'styled-components';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';
import { EcDictTagList } from '../../../components/dict/ecdict/ecdict-tag';
import { EcDictCollins } from '../../../components/dict/ecdict/ecdict-collins';
import { EcDictWordFormList } from '../../../components/dict/ecdict/ecdict-wordforms';
import ColorId from '../../../styles/ColorId';
import { SearchEmptyResult, SearchResultType } from '@noob9527/noob-dict-core';

const Container = styled.div`
  color: ${props => props.theme[ColorId.foreground]};
  background-color: ${props => props.theme[ColorId.background]};

  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  height: 33px;
  min-height: 33px;
  line-height: 33px;
  //border-bottom: 1px solid gray;
  overflow: hidden;
  
  margin-left: 15px;
  > span {
    margin-right: 20px;
  }
  
  .ecdict-word-form-list {
    flex: 1 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ecdict-collins {
    //flex: 0 0;
    //white-space: nowrap;
  }
  .ecdict-tag-list {
    //flex: 0 0;
    //white-space: nowrap;
  }
`;

interface EcDictBarProps {
  result: EcDictSearchSuccessResult | SearchEmptyResult | null
}

const EcDictBar: React.FC<EcDictBarProps> = (props: EcDictBarProps) => {
  const { result } = props;

  if (!result) {
    return (<Container/>);
  } else if(SearchResultType.isEmptyResult(result)) {
    return (<Container/>);
  } else {
    const tags = result.tags.map(e => e.description);
    if (result.oxford) tags.push('OXFORD 3000');

    return (<Container>
      {tags.length
        ? (<EcDictTagList className="ecdict-tag-list" items={tags}/>)
        : null
      }
      <EcDictCollins className="ecdict-collins" result={result}/>
      <EcDictWordFormList className="ecdict-word-form-list" result={result}/>
    </Container>);
  }
};

export default EcDictBar;
