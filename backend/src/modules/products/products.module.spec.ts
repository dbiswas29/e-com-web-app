import { ProductsModule } from './products.module';

describe('ProductsModule', () => {
  it('should be defined', () => {
    expect(ProductsModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof ProductsModule).toBe('function');
  });
});
