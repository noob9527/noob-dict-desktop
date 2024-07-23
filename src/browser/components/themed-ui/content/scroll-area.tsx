import styled from 'styled-components'
import ScrollArea from 'react-scrollbar'

export const ThemedScrollArea = styled(ScrollArea)`
  &.scrollarea {
    height: 100%;

    .scrollbar {
      background-color: white !important;
    }
  }
`
