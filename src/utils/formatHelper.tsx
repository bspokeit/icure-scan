/*
 * Copyright (C) 2021 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

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
