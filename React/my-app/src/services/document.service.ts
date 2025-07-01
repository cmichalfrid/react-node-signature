import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';

const baseUrl = process.env.REACT_APP_BASE_URL;

export function insertDocument(document:any){
    return axios.post(`${baseUrl}/api/document`, document);
}

export function getDocumentId(id:number){
    return axios.get(`${baseUrl}/api/document/${id}`);
}

export function sendSignature(data:any){
    return axios.post(`${baseUrl}/api/document/signature`, data);
}

export function getDocumentForId(id:number){
    return axios.get(`${baseUrl}/api/document/signature/${id}`);
}
