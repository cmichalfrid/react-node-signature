import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentModel } from "../../models/DocumentModel";

export const documentUrlSlice: any = createSlice({
    initialState: { url: '', id: 0, file: '', email: '' },
    name: 'documentUrlSlice',
    reducers: {
        setUrlPdf: (state, action: PayloadAction<string>) => {
            state.url = action.payload
            localStorage.setItem('url', action.payload);
        },
        setId: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
            localStorage.setItem('id', action.payload.toString());
        }
    }
})

export const { setUrlPdf, setId, setEmail, setFile } = documentUrlSlice.actions
export default documentUrlSlice.reducer