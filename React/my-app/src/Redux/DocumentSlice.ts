import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documentData: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocumentData(state, action) {
      state.documentData = action.payload;
    },
   
  },
});

export const {setDocumentData } = documentSlice.actions;
export default documentSlice.reducer;
