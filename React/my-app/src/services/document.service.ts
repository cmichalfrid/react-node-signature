import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';
const API_URL = process.env.REACT_APP_API_URL;

export function insertDocument(document:any) {
    console.log("Sending POST to URL:", API_URL);
  return axios.post(`${API_URL}`, document);
}

export function getDocumentId(id:any) {
  return axios.get(`${API_URL}/${id}`);
}

export function sendSignature(data:any) {
  return axios.post(`${API_URL}/signature`, data);
}

export function getDocumentForId(id:any) {
  return axios.get(`${API_URL}/signature/${id}`);
}
