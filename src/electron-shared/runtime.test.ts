import { Runtime } from "./runtime";

describe("runtime", () => {
  describe("isDev", () => {
    it("basic", () => {
      console.log(Runtime.isDev);
      expect(Runtime.isDev).toBeTruthy();
    });
  });
});
