import { getSession } from './actions';
import supabase from '@/api/supabaseClient'; // Mock supabase client

jest.mock('@/api/supabaseClient', () => ({
  auth: {
    getSession: jest.fn(),
  },
}));

describe('getSession', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should return session data when available', async () => {
    // Mock successful session fetch
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    const session = await getSession();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(session).toEqual({ user: { id: '123' } });
  });

  it('should return null if there is an error fetching session', async () => {
    // Mock error in fetching session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Error fetching session',
    });

    const session = await getSession();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(session).toBeNull();
  });
});
