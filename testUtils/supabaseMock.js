const createSupabaseMock = () => {
  const mockFrom = jest.fn();

  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockMaybeSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  // Define the chain for 'profiles' table
  mockFrom.mockImplementation((table) => {
    switch (table) {
      case 'profiles':
        return {
          select: mockSelect.mockReturnThis(),
          eq: mockEq.mockReturnThis(),
        };
      case 'events':
        return {
          select: mockSelect.mockResolvedValue({ data: [], error: null }),
        };
      case 'volunteer_history':
        return {
          select: mockSelect.mockReturnThis(),
          eq: mockEq.mockReturnThis(),
          maybeSingle: mockMaybeSingle,
          insert: mockInsert,
        };
      case 'notifications':
        return {
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete,
        };
      default:
        return {};
    }
  });

  const supabaseMock = {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
    },
    // Expose mocks for individual methods if needed
    _mocks: {
      select: mockSelect,
      eq: mockEq,
      maybeSingle,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    },
  };

  return supabaseMock;
};

export default createSupabaseMock;
