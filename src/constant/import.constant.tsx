import * as ImagePicker from 'expo-image-picker';

export const IMPORT_OPTION: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,
  quality: 0.5,
  allowsMultipleSelection: true,
  base64: true,
};
