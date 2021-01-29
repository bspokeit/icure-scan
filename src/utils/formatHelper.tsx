export const arrayBuffer2Base64 = (
  arrayBuffer: ArrayBuffer,
  type = 'image/jpeg'
) => {
  return `data:${type};base64,${btoa(
    String.fromCharCode(...new Uint8Array(arrayBuffer))
  )}`;
};

export const URI2Blob = async (uri: string): Promise<Blob> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    throw error;
  }
};