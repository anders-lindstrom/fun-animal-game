// Utility for saving/sharing canvas drawings

// Ensure filename has .png extension and no invalid characters
function sanitizeFilename(name: string): string {
  // Remove any existing extension
  let clean = name.replace(/\.(png|jpg|jpeg)$/i, '');
  // Replace invalid characters with dashes
  clean = clean.replace(/[^a-zA-Z0-9-_]/g, '-');
  // Remove multiple dashes
  clean = clean.replace(/-+/g, '-');
  // Add .png extension
  return `${clean}.png`;
}

export async function shareOrDownloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string = 'my-drawing'
): Promise<void> {
  const safeFilename = sanitizeFilename(filename);

  // Get canvas as blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png'
    );
  });

  // Try Web Share API first (mobile)
  if (navigator.share && 'canShare' in navigator) {
    const file = new File([blob], safeFilename, { type: 'image/png' });
    const shareData = { files: [file] };

    try {
      // Check if sharing files is supported
      if ((navigator as Navigator & { canShare?: (data: ShareData) => boolean }).canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      // User cancelled or share failed, fall through to download
      console.log('Share cancelled or failed, downloading instead');
    }
  }

  // Fallback: Download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to generate fun filenames for drawings
export function generateDrawingFilename(prefix: string = 'drawing'): string {
  const adjectives = ['amazing', 'super', 'cool', 'awesome', 'fantastic'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const time = new Date().toTimeString().slice(0, 5).replace(':', '');
  return `${prefix}-${adjective}-${time}`;
}
