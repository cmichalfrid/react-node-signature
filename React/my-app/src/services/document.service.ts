import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';
const API_URL = process.env.REACT_APP_API_URL;

export function insertDocument(document:any) {
  return axios.post(`api/document`, document);
}

export function getDocumentId(id:any) {
  return axios.get(`api/document${id}`);
}

export function sendSignature(data:any) {
  return axios.post(`api/document`, data);
}

export function getDocumentForId(id:any) {
  return axios.get(`api/document${id}`);
}
