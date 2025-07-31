import { CartModule } from './cart.module';

describe('CartModule', () => {
  it('should be defined', () => {
    expect(CartModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof CartModule).toBe('function');
  });
});
