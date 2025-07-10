import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentModel } from "../../models/DocumentModel";

export const documentUrlSlice: any = createSlice({
    initialState: { url: '', id: 0, file: '', email: '' },
    name: 'documentUrlSlice',
    reducers: {
        setUrlPdf: (state, action: PayloadAction<string>) => {
            state.url = action.payload

        },
        setId: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setFile: (state, action: PayloadAction<string>) => {
            state.file = action.payload;
        }
    }
})

export const { setUrlPdf, setId,setEmail,setFile } = documentUrlSlice.actions
export default documentUrlSlice.reducer