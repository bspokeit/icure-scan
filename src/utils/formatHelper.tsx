export const arrayBuffer2Base64 = (
  arrayBuffer: ArrayBuffer,
  type = 'image/jpeg'
): string => {
  return `data:${type};base64,${btoa(
    String.fromCharCode(...new Uint8Array(arrayBuffer))
  )}`;
};

export const URI2Blob = async (uri: string | undefined): Promise<Blob> => {
  if (!uri) {
    throw new Error(`No valid uri ({uri}) provided to create a Blob`);
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    throw error;
  }
};
