export const ab2Base64 = (ab) => {
  return `data:image/jpeg;base64,${btoa(
    String.fromCharCode(...new Uint8Array(ab))
  )}`;
};
