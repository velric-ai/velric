import * as pdfjsLib from "pdfjs-dist";

// Set the worker source - required for pdfjs-dist to work
// The worker handles parsing in a separate thread
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text from a PDF file on the client-side
 * This avoids sending the entire PDF to the server, reducing bandwidth and deployment size
 * 
 * @param file - The PDF File object from user input
 * @returns Promise<string> - The extracted text from the PDF
 * @throws Error if PDF parsing fails
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";

  // Extract text from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Join all text items on the page
      const text = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");

      fullText += text + "\n";
    } catch (pageError) {
      console.warn(`Failed to extract text from page ${i}:`, pageError);
      // Continue with next page instead of failing entirely
    }
  }

  if (!fullText.trim()) {
    throw new Error("No text could be extracted from the PDF. The PDF may be image-based or corrupted.");
  }

  return fullText;
}

/**
 * Extract text from a PDF with progress callback
 * Useful for providing user feedback during processing
 * 
 * @param file - The PDF File object
 * @param onProgress - Callback function to report progress (0-100)
 * @returns Promise<string> - The extracted text
 */
export async function extractTextFromPDFWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";
  const totalPages = pdf.numPages;

  // Extract text from each page
  for (let i = 1; i <= totalPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Join all text items on the page
      const text = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");

      fullText += text + "\n";

      // Report progress
      if (onProgress) {
        const progress = Math.round((i / totalPages) * 100);
        onProgress(progress);
      }
    } catch (pageError) {
      console.warn(`Failed to extract text from page ${i}:`, pageError);
      // Continue with next page
    }
  }

  if (!fullText.trim()) {
    throw new Error("No text could be extracted from the PDF. The PDF may be image-based or corrupted.");
  }

  return fullText;
}
