import axios from "axios";
import { DocumentModel } from '../models/DocumentModel';

// כתובת בסיס — אם React ו-Node נמצאים יחד, אין צורך בכתובת מלאה
const API_BASE_URL = "/api/document".trim();

export function insertDocument(document: any) {
  console.log("📨 insertDocument called");
  console.log("📤 Sending POST to:", API_BASE_URL);

  return axios.post(API_BASE_URL, document);
}

export function getDocumentId(id: any) {
  console.log("🔍 Fetching document by ID:", id);
  return axios.get(`${API_BASE_URL}/${id}`);
}

export function sendSignature(data: any) {
  console.log("🖊️ Sending signature");
  return axios.post(`${API_BASE_URL}/signature`, data);
}

export function getDocumentForId(id: any) {
  console.log("📄 Getting document for signature ID:", id);
  return axios.get(`${API_BASE_URL}/signature/${id}`);
}
