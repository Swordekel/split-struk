/**
 * Preprocess receipt image untuk akurasi OCR yang lebih baik:
 * 1. Honor EXIF orientation (foto HP)
 * 2. Upscale ke target resolution (~1800px sisi terpanjang)
 * 3. Grayscale + contrast boost
 * 4. Adaptive threshold sederhana untuk teks lebih tajam
 */
const TARGET_LONG_SIDE = 1800
const CONTRAST_FACTOR = 1.35
const THRESHOLD_BIAS = 5

async function loadOriented(file: File | Blob): Promise<ImageBitmap> {
  return await createImageBitmap(file, { imageOrientation: 'from-image' })
}

export async function preprocessForOCR(file: File | Blob): Promise<Blob> {
  const bitmap = await loadOriented(file)

  const longSide = Math.max(bitmap.width, bitmap.height)
  const scale = longSide > TARGET_LONG_SIDE ? TARGET_LONG_SIDE / longSide : 1
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    bitmap.close?.()
    throw new Error('Canvas 2D context unavailable')
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  // Pass 1: grayscale + compute mean for adaptive threshold
  let sum = 0
  const grays = new Uint8ClampedArray(w * h)
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    grays[j] = gray
    sum += gray
  }
  const mean = sum / grays.length

  // Pass 2: contrast boost around the mean (not 128) — adaptive ke lighting
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    let v = (grays[j] - mean) * CONTRAST_FACTOR + mean - THRESHOLD_BIAS
    v = Math.max(0, Math.min(255, v))
    data[i] = data[i + 1] = data[i + 2] = v
  }

  ctx.putImageData(imageData, 0, 0)

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      0.92,
    )
  })
}
