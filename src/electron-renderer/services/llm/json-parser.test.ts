import { getJsonObj } from './json-parser'

describe('json parser', () => {
  describe('getJsonObjStr', () => {
    it('basic', () => {
      const obj = {
        foo: "foo"
      }
      const text = JSON.stringify(obj)
      const res = getJsonObj(text)
      expect(res).toEqual(obj)
    })

    it('should extract json string', () => {
      const obj = {
        foo: "foo"
      }
      const text = `
        some text
        ${JSON.stringify(obj, null, 2)}
        some text
      `
      const res = getJsonObj(text)
      expect(res).toEqual(obj)
    })

    it('should parse malformed json', () => {
      const obj = {
        foo: "foo"
      }
      const text = `
        some text
        {
          "foo": "foo", 
        }
        some text
      `
      const res = getJsonObj(text)
      expect(res).toEqual(obj)
    })
  })
})
