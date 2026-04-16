import profileRoutes from './profileRoutes';

describe('Profile Routes Module', () => {
  it('should export a valid routes object', () => {
    expect(profileRoutes).toBeDefined();
    expect(profileRoutes).not.toBeNull();
  });

  it('should have all HTTP methods available', () => {
    expect(profileRoutes.get).toBeDefined();
    expect(profileRoutes.post).toBeDefined();
    expect(profileRoutes.put).toBeDefined();
    expect(profileRoutes.delete).toBeDefined();
  });

  it('should have route registration methods as functions', () => {
    expect(typeof profileRoutes.get).toBe('function');
    expect(typeof profileRoutes.post).toBe('function');
    expect(typeof profileRoutes.put).toBe('function');
    expect(typeof profileRoutes.delete).toBe('function');
  });

  it('should be a middleware function', () => {
    expect(typeof profileRoutes).toBe('function');
  });

  it('should have stack of routes', () => {
    expect(profileRoutes.stack).toBeDefined();
    expect(Array.isArray(profileRoutes.stack)).toBe(true);
  });
});
