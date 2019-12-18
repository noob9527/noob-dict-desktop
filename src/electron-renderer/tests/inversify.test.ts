import 'reflect-metadata';
import { Container } from 'inversify';


describe('inversify', () => {
  it('use symbol as TypeToken', () => {
    const container = new Container();

    interface IPerson {
      name: string
    }

    const IPersonToken = Symbol();
    const foo: IPerson = { name: 'foo' };
    container.bind<IPerson>(IPersonToken).toConstantValue(foo);
    const res = container.get<IPerson>(IPersonToken);
    expect(res).toBe(foo);
  });
});