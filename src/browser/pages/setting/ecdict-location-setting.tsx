import { ThemedButton } from '../../components/themed-ui/button/button'
import React, { useRef } from 'react'
import { UserProfile } from '../../../electron-shared/user-profile/user-profile'
import styled from 'styled-components'
import { shell } from 'electron'
import { Icon } from 'antd'
import { settingChange, useSettingStore } from './setting-store'
import { useTransientStore } from '../transient-store'

const Container = styled.div`
  .status-icon {
    //margin: 0 5px;
    margin-right: 8px;
  }
`

export const EcdictLocationSetting = () => {
  const ecDictAvailable = useTransientStore.use.ecDictAvailable()
  const ecDictFileLocation = useSettingStore.use.ecDictFileLocation()
  let ref1 = useRef<HTMLInputElement>(null)
  return (
    <Container>
      <span className="status-icon">
        {ecDictAvailable ? (
          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        ) : (
          <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
        )}
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
          ref1.current?.click()
        }}
      >
        {ecDictFileLocation
          ? ecDictFileLocation
          : 'Click to Set Correct Location'}
      </a>

      <input
        type="file"
        style={{ display: 'none' }}
        ref={ref1}
        onChange={(event) => {
          console.log(event.target.files?.item(0)?.path)
          settingChange({
            ecDictFileLocation: event.target.files?.item(0)?.path || null,
          })
        }}
      />
    </Container>
  )
}
