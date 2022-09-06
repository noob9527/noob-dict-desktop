import { ThemedButton } from '../../components/themed-ui/button/button';
import React, { useRef } from 'react';
import { TransientState } from '../transient-model';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfile } from '../../../common/model/user-profile';
import styled from 'styled-components';
import { shell } from 'electron';
import { Icon } from 'antd';

const Container = styled.div`
  .status-icon {
    //margin: 0 5px;
    margin-right: 8px;
  }
`;

export const EcdictLocationSetting = () => {

  const dispatch = useDispatch();
  const transientState: TransientState = useSelector((state: any) => state._transient);
  const settingState: UserProfile = useSelector((state: any) => state.setting);
  let ref1 = useRef<HTMLInputElement>(null);
  return (
    <Container>

      <span className="status-icon">
      {
        transientState.ecDictAvailable
          ? (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>)
          :(<Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96"/>)
      }
      </span>
      <span>ECDICT DB File Location: </span>
      {/*{*/}
      {/*  settingState.ecDictFileLocation*/}
      {/*    ? (<a*/}
      {/*      onClick={() => {*/}
      {/*        ref1.current?.click();*/}
      {/*        // shell.showItemInFolder(settingState.ecDictFileLocation!!);*/}
      {/*      }}*/}
      {/*      role="button"*/}
      {/*    >{settingState.ecDictFileLocation}</a>)*/}
      {/*    :(<span>Not Available</span>)*/}
      {/*}*/}
      <a
        role="button"
        onClick={() => {
          ref1.current?.click();
        }}
      >
        {settingState.ecDictFileLocation ? settingState.ecDictFileLocation:'Click to Set Correct Location'}
      </a>

      <input
        type="file"
        style={{ display: 'none' }}
        ref={ref1}
        onChange={(event) => {
          console.log(event.target.files?.item(0)?.path);
          dispatch({
            type: 'setting/settingChange',
            payload: {
              ecDictFileLocation: event.target.files?.item(0)?.path || null,
            },
          });
        }}
      />
    </Container>
  );
};
