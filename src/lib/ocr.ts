import { createWorker, type Worker } from 'tesseract.js'
import { preprocessForOCR } from './imageProcessing'

let workerPromise: Promise<Worker> | null = null

async function getWorker(onProgress?: (p: number) => void): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const w = await createWorker(['ind', 'eng'], 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress)
          }
        },
      })
      // PSM 4: single column of text of variable sizes — paling cocok untuk struk
      // preserve_interword_spaces: jaga spacing antar kolom (qty/harga/subtotal)
      await w.setParameters({
        // @ts-expect-error tesseract.js types tidak full
        tessedit_pageseg_mode: '4',
        preserve_interword_spaces: '1',
      })
      return w
    })()
  }
  return workerPromise
}

export interface OcrResult {
  text: string
  rawText: string
}

export async function runOCR(
  file: File | Blob,
  onProgress?: (p: number) => void,
): Promise<OcrResult> {
  const preprocessed = await preprocessForOCR(file)
  const worker = await getWorker(onProgress)
  const { data } = await worker.recognize(preprocessed)
  return { text: data.text, rawText: data.text }
}

export async function terminateOCR(): Promise<void> {
  if (workerPromise) {
    const w = await workerPromise
    await w.terminate()
    workerPromise = null
  }
}
