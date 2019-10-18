import React from 'react';

interface EngineViewProps {
  html: string
}

const EngineView: React.FC<EngineViewProps> = (props: EngineViewProps) => {
  const { html } = props;
  return (
    <iframe width="100%" height="100%" frameBorder={0} srcDoc={html}/>
  );
};

export default EngineView;