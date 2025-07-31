import { OrdersModule } from './orders.module';

describe('OrdersModule', () => {
  it('should be defined', () => {
    expect(OrdersModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof OrdersModule).toBe('function');
  });
});
