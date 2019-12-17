import 'reflect-metadata';
import { container } from "tsyringe";


describe('tsyringe', () => {
  it('use symbol as TypeToken', () => {
    interface IPerson {
      name: string
    }

    const IPersonToken = Symbol();
    const foo: IPerson = { name: 'foo' };
    container.register(IPersonToken, {
      useValue: foo
    });
    const res = container.resolve(IPersonToken);
    expect(res).toBe(foo);
  });

  it('use class as TypeToken 1', () => {
    class IPerson {
      name: string = '';
    }

    const foo: IPerson = { name: 'foo' };
    container.register(IPerson, {
      useValue: foo
    });
    const res = container.resolve(IPerson);
    expect(res).toBe(foo);
  });

  it('use class as TypeToken 2', () => {
    class IPerson {
      name: string = '';
    }

    class PersonImpl {
      name: string = 'bar';
    }

    container.register(IPerson, {
      useClass: PersonImpl
    });
    const res = container.resolve(IPerson);
    expect(res).toBeInstanceOf(PersonImpl);
  });
});