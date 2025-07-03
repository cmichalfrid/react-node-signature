import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';

export function insertDocument(document: any) {
  
  console.log("bgyuvhbijnkmknuyvtcrxezwexcrtvyujnmk");
  
  
return axios.post('https://react-node-signature-1.onrender.com/api/document', document);

}

export function getDocumentId(id:any) {
  return axios.get(`https://react-node-signature-1.onrender.com/api/document/${id}`);
}

export function sendSignature(data:any) {
  return axios.post(`https://react-node-signature-1.onrender.com/api/document/signature`, data);
}

export function getDocumentForId(id:any) {
  return axios.get(`https://react-node-signature-1.onrender.com/api/document/signature/${id}`);
}
