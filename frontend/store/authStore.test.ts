import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, company: null, token: null });
  });

  it('should initialize with null values', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.company).toBeNull();
    expect(state.token).toBeNull();
  });

  it('should set credentials on login', () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com', companyId: 1, isActive: true, requiresPasswordChange: false };
    const company = { id: 1, name: 'Test Company', type: 'CLIENT', primaryColor: null, secondaryColor: null, accentColor: null, logoPath: null };
    const token = 'fake-token';

    useAuthStore.getState().login(token, user, company);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.company).toEqual(company);
    expect(state.token).toEqual(token);
  });

  it('should clear credentials on logout', () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com', companyId: 1, isActive: true, requiresPasswordChange: false };
    const company = { id: 1, name: 'Test Company', type: 'CLIENT', primaryColor: null, secondaryColor: null, accentColor: null, logoPath: null };
    const token = 'fake-token';

    useAuthStore.getState().login(token, user, company);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.company).toBeNull();
    expect(state.token).toBeNull();
  });
});
