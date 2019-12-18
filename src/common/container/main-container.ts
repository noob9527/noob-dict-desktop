import { Container } from 'inversify';

const mainContainer = new Container({ defaultScope: 'Singleton' });

export {
  mainContainer,
};