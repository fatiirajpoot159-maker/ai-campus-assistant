/**
 * Client-side File Parser for PDF, DOCX, and TXT files
 */
import mammoth from "mammoth";
export async function parseUploadedFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === "txt" || file.type === "text/plain") {
    return await readTxtFile(file);
  } else if (extension === "docx" || file.type.includes("wordprocessingml")) {
    return await readDocxFile(file);
  } else if (extension === "pdf" || file.type === "application/pdf") {
    return await readPdfFile(file);
  } else {
    // Fallback text reader
    return await readTxtFile(file);
  }
}
function readTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
async function readDocxFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "Document text extracted.";
  } catch (err) {
    console.warn("Mammoth DOCX parsing fallback:", err);
    return await readTxtFile(file);
  }
}
async function readPdfFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    const rawText = decoder.decode(arrayBuffer);
    // Extract text streams enclosed in ( ) inside PDF syntax or plain text
    const matches = rawText.match(/\(([^()]+)\)/g);
    if (matches && matches.length > 5) {
      const extracted = matches
        .map(m => m.slice(1, -1))
        .filter(str => str.length > 3 && !/[^\x20-\x7E]/.test(str))
        .join(" ");
      if (extracted.length > 50) return extracted;
    }
    
    // Clean fallback string extraction
    const cleanText = rawText.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " ");
    return cleanText.slice(0, 5000) || `PDF Document: ${file.name}`;
  } catch (err) {
    return `Uploaded PDF document: ${file.name}`;
  }
}