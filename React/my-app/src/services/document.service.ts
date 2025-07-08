import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';

const API_BASE_URL = "/api/document".trim();

export function insertDocument(document: any) {
  return axios.post(API_BASE_URL, document);
}

export function getDocumentId(id: any) {
  return axios.get(`${API_BASE_URL}/${id}`);
}

export function sendSignature(data: any) {
  return axios.post(`${API_BASE_URL}/signature`, data);
}

export function getDocumentForId(id: any) {
  return axios.get(`${API_BASE_URL}/signature/${id}`, {
    responseType: 'blob',
  });
}
