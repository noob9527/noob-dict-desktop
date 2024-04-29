import { franc } from 'franc-min'
import { detect } from './lan-detector'

describe('franc test', () => {
  it('basic case ', () => {
    const cases = [
      'This is a test',
      '这是一个测试',
      'こんにちは',
      'a',
      '好',
      '私',
      'Watashi',
    ]
    const res = cases.map((e) => {
      // return [e, franc(e )]
      return [
        e,
        franc(e, {
          minLength: 2,
          only: ['cmn', 'eng', 'jpn'],
        }),
      ]
    })

    console.log(res)
    console.log(JSON.stringify(res))
  })
})

describe('lan-detector', () => {
  it('basic case ', () => {
    const cases = [
      'This is a test',
      '这是一个测试',
      'こんにちは',
      'a',
      '好',
      '私',
      'Watashi',
    ]
    const res = cases.map((e) => {
      return [e, detect(e)]
    })

    console.log(res)
    console.log(JSON.stringify(res))
  })
})
