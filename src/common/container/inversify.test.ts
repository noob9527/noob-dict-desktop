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

  it('singleton', () => {
    // https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md
    const container = new Container();

    interface ICounter {
      count: number
    }

    const ICounterToken = Symbol();
    let count = 0;
    container.bind<ICounter>(ICounterToken)
      .toDynamicValue(() => ({ count: ++count }))
      .inSingletonScope();
    const counter1 = container.get<ICounter>(ICounterToken);
    const counter2 = container.get<ICounter>(ICounterToken);
    expect(counter1).toBe(counter2);
    expect(count).toBe(1);
  });

  it('rebind', () => {
    const container = new Container();

    interface ICounter {
      count: number
    }

    const ICounterToken = Symbol();
    let count = 0;
    container.bind<ICounter>(ICounterToken)
      .toDynamicValue(() => ({ count: ++count }))
      .inSingletonScope();
    const counter1 = container.get<ICounter>(ICounterToken);
    expect(counter1.count).toBe(1);

    container.rebind<ICounter>(ICounterToken)
      .toDynamicValue(() => ({ count: ++count }))
      .inSingletonScope();
    const counter2 = container.get<ICounter>(ICounterToken);
    expect(counter2.count).toBe(2);
  });
});