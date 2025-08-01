import { UsersModule } from './users.module';

describe('UsersModule', () => {
  it('should be defined', () => {
    expect(UsersModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof UsersModule).toBe('function');
  });
});
