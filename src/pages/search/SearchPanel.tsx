import React from 'react';
import { useSelector } from 'dva';

export default () => {
  const htmls = useSelector((state: any) => state.search.htmls);

  const html = htmls && htmls[0] && htmls[0][1];

  console.log(htmls);

  return (
    <>
      {/*<iframe*/}
      {/*  src="https://www.bing.com/dict/search?q=go"*/}
      {/*  title="bing"*/}
      {/*  height="100%"*/}
      {/*  width="100%"*/}
      {/*/>*/}
      {/*<iframe*/}
      {/*  src="https://dictionary.cambridge.org/search/english/direct/?q=go"*/}
      {/*  title="cambridge"*/}
      {/*  height="100%"*/}
      {/*  width="100%"*/}
      {/*/>*/}
      <div>test</div>
      <div dangerouslySetInnerHTML={{ __html: html }}/>
    </>
  );
}
