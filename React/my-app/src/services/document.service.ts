import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';

export function insertDocument(document: any) {
  
  console.log(document);
  // https://react-node-signature-1.onrender.com/api/document
  
  return axios.post(`http://localhost:3001/api/document`, document, )

}

export function getDocumentId(id:any) {
  return axios.get(`http://localhost:3001/api/document/${id}`);
}

export function sendSignature(data:any) {
  return axios.post(`http://localhost:3001/api/document`, data);
}

export function getDocumentForId(id:any) {
  return axios.get(`http://localhost:3001/api/document/${id}`);
}
