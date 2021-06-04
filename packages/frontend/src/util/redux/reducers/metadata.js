import { createSlice } from '@reduxjs/toolkit';

const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    authenticated: true,
    token: null,
  },
  reducers: {
    login: async (state, action) => {},
  },
});

export const { login } = metadataSlice.actions;

export default metadataSlice.reducer;
