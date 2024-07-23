import React from 'react'
import styled from 'styled-components'
import { ThemedTextArea2 } from '../../../components/themed-ui/input/textarea2'
import { Workflow } from '../../../../common/services/llm/workflow'
import { useParams } from 'react-router-dom'
import { SettingActions, useSettingStore } from '../setting-store';
import { defaultPromptTpls } from '../../../../common/services/llm/prompts/prompts';
import { ThemedButton } from '../../../components/themed-ui/button/button';
import persistChange = SettingActions.persistChange;
import cancelChange = SettingActions.cancelChange;

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  margin-right: 20px;
  padding-top: 20px;
  //padding: 20px 0;
  display: flex;
  flex-direction: column;
`

const StyledTextArea = styled(ThemedTextArea2)`
  height: 100%;
  font-size: 1.5rem;
  width: 100%;
  resize: none;
  flex-grow: 1;
`

const StyledButton = styled(ThemedButton)`
  min-width: 80px;

  & + & {
    margin-left: 20px;
  }
`

const Footer = styled.footer`
  margin: 20px 0;
  height: 32px;
  display: flex;
  justify-content: center;
`

export const PromptSetting = () => {
  const workflow: Workflow = (useParams() as any).workflow
  // const header = {
  //   [Workflow.trans_text_to_en]: '',
  //   [Workflow.trans_text_en_to_cn]: '',
  //   [Workflow.rewrite_text_en]: '',
  //   [Workflow.quiz_singular_choice]: '',
  // }[workflow]
  const default_tpl = defaultPromptTpls[workflow]
  const llm = useSettingStore.use.llm()
  const persisted = useSettingStore.use.persisted()

  return (
    <Container>
      {/*<h1>Quiz Generation Prompt</h1>*/}
      <StyledTextArea
        value={llm.prompts?.[workflow] ?? default_tpl}
        placeholder="Write your prompt here"
        onChange={(e) => {
          // should not call setting change here
          // as this is a session level change.
          useSettingStore.setState((state) => {
            if (!state.llm.prompts) {
              state.llm.prompts = {
                [Workflow.trans_word_en_to_cn]: null,
                [Workflow.trans_text_to_en]: null,
                [Workflow.trans_text_en_to_cn]: null,
                [Workflow.rewrite_text_en]: null,
                [Workflow.quiz_singular_choice]: null,
              }
            }
            state.llm.prompts!![workflow] = e.target.value
          })
        }}
      />

      <Footer>
        <StyledButton
          disabled={persisted.llm.prompts?.[workflow] == llm.prompts?.[workflow]}
          onClick={() => {
            persistChange()
          }}
        >
          Save
        </StyledButton>
        <StyledButton
          disabled={persisted.llm.prompts?.[workflow] == llm.prompts?.[workflow]}
          onClick={() => {
            cancelChange()
          }}
        >
          Cancel
        </StyledButton>
        <StyledButton
          disabled={persisted.llm.prompts?.[workflow] == null}
          onClick={() => {
            useSettingStore.setState((state) => {
              state.llm.prompts = {
                [Workflow.trans_word_en_to_cn]: null,
                [Workflow.trans_text_to_en]: null,
                [Workflow.trans_text_en_to_cn]: null,
                [Workflow.rewrite_text_en]: null,
                [Workflow.quiz_singular_choice]: null,
              }
            })
            persistChange()
          }}
        >
          Restore to Default
        </StyledButton>
      </Footer>
    </Container>
  )
}
