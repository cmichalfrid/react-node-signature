import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';

export function insertDocument(document:any){
    return  axios.post(`http://127.0.0.1:3001/api/document`,document)
}

export function getDocumentId(id:number){
    return  axios.get(`http://127.0.0.1:3001/api/document${id}`)
}
export function sendSignature(data:any){
    return  axios.post(`http://127.0.0.1:3001/api/document/signature`,data)
}
     export function getDocumentForId(id:number){
    return  axios.get(`http://127.0.0.1:3001/api/document/signature/${id}`)
}