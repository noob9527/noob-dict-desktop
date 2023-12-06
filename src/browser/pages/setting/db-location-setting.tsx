import React, { useRef } from 'react';
import { TransientState } from '../transient-model';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon } from 'antd';
import { UserProfile } from '../../../electron-shared/user-profile/user-profile';
import { ThemedButton } from '../../components/themed-ui/button/button';
import { rendererContainer } from '../../../common/container/renderer-container';
import { LocalDbService, LocalDbServiceToken } from '../../../common/services/db/local-db-service';

const localDbService = rendererContainer.get<LocalDbService>(LocalDbServiceToken);

const Container = styled.div`
  .status-icon {
    //margin: 0 5px;
    margin-right: 8px;
  }
`;

interface DbLocationSettingProps {
}

export const DbLocationSetting = (props: DbLocationSettingProps) => {

  const dispatch = useDispatch();
  const transientState: TransientState = useSelector((state: any) => state._transient);
  const settingState: UserProfile = useSelector((state: any) => state.setting);
  let ref1 = useRef<HTMLInputElement>(null);
  return (
    <Container>

      <span className="status-icon">
      {
        transientState.localDbAvailable
          ? (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>)
          :(<Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96"/>)
      }
      </span>
      <span>DB File Location: </span>
      <a
        role="button"
        onClick={() => {
          ref1.current?.click();
        }}
      >
        {
          settingState.dbFileLocation
            ? settingState.dbFileLocation
            :'Click to Set Correct Location'
        }
      </a>
      <ThemedButton onClick={() => {
        localDbService.init();
      }} style={{marginLeft: '10px'}}>generate</ThemedButton>

      <input
        type="file"
        style={{ display: 'none' }}
        ref={ref1}
        onChange={(event) => {
          console.log(event.target.files?.item(0)?.path);
          dispatch({
            type: 'setting/settingChange',
            payload: {
              dbFileLocation: event.target.files?.item(0)?.path || null,
            },
          });
        }}
      />
    </Container>
  );
};
