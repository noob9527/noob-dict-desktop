import { Container } from 'inversify';

const rendererContainer = new Container({ defaultScope: 'Singleton' });

export {
  rendererContainer,
};