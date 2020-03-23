import React, { useRef, useState } from 'react';
import useEventListener from '../../../../hooks/use-event-listener';
import styled from 'styled-components';
import speaker from './speaker.svg';

const AudioButton = styled.button`
  //display: inline-block;
  width: 1.2em;
  height: 1.2em;
  text-decoration: none;
  margin: 0 8px;
  padding: 0;
  line-height: 1;
  //vertical-align: text-bottom;
  vertical-align: middle;
  border: none;
  background: no-repeat left / cover url(${speaker});
  user-select: none;
  cursor: pointer;
  
  &:hover,&:focus{
    outline: none;
  }
  &.isActive {
    animation: speaker-playing 1s steps(6) infinite;
  }
  @keyframes speaker-playing {
    from {
      background-position-x: 0;
    }
    70% {
      background-position-x: 100%;
    }
    100% {
      background-position-x: 100%;
    }
  }
`;

interface SpeakerProp {
  src?: string
}

const Speaker: React.FC<SpeakerProp> = (props) => {
  const [playing, setPlaying] = useState(false);
  const audioEle = useRef<HTMLAudioElement>(null);

  useEventListener('ended', (event) => {
    setPlaying(false);
  });

  return (
    <>
      <AudioButton
        className={playing ? 'isActive' : ''}
        onClick={handleClick}>
        <audio
          ref={audioEle}>
          {props.src ? <source src={props.src}/> : null}
        </audio>
      </AudioButton>
    </>
  );

  async function handleClick() {
    const ref = audioEle?.current;
    if(!ref) {
      return Promise.resolve(); // we may set a timeout here?
    }
    setPlaying(true);
    // https://stackoverflow.com/questions/43577182/react-js-audio-src-is-updating-on-setstate-but-the-audio-playing-doesnt-chang
    await ref.pause();
    await ref.load();
    await ref.play();
  }
};

export default Speaker;