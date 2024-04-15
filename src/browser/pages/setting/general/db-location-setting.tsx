import React, { useRef } from 'react';
import { TransientState } from '../../transient-model';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon } from 'antd';
import { UserProfile } from '../../../../electron-shared/user-profile/user-profile';
import { ThemedButton } from '../../../components/themed-ui/button/button';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { LocalDbService, LocalDbServiceToken } from '../../../../common/services/db/local-db-service';
import { settingChange, useSettingStore } from '../setting-store';
import { useTransientStore } from '../../transient-store';

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
  const localDbAvailable  = useTransientStore.use.localDbAvailable()
  const  dbFileLocation  = useSettingStore.use.dbFileLocation()
  let ref1 = useRef<HTMLInputElement>(null);
  return (
    <Container>

      <span className="status-icon">
      {
        localDbAvailable
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
          dbFileLocation
            ? dbFileLocation
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
          settingChange({
              dbFileLocation: event.target.files?.item(0)?.path || null,
          })
        }}
      />
    </Container>
  );
};
