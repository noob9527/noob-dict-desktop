import appModel from './app-model'

it('test', () => {
  const res = Object.values(appModel.effects)
  console.log(res);
  console.log(res[0]);
  console.log(res[0] instanceof Function);
});