import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentModel } from "../../models/DocumentModel";

export const documentUrlSlice:any=createSlice({
    initialState:{url:'',id:0},
    name:'documentUrlSlice',
    reducers:{
        setUrlPdf: (state, action: PayloadAction<string>) => {
            state.url=action.payload
            
        },
        setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
}})

export const {setUrlPdf,setId}=documentUrlSlice.actions
export default documentUrlSlice.reducer