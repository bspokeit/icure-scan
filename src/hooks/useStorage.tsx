/*
 * Copyright (C) 2022 Bspoke IT SRL
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

import EncryptedStorage from 'react-native-encrypted-storage';
import { PRIVATE_KEY_POSTFIX_1, PRIVATE_KEY_POSTFIX_2 } from '../constant';
import { HealthcareParty } from '../models';

export default () => {
  const setItem = async (key: string, value: string = ''): Promise<void> => {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = async (key: string): Promise<string | null> => {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const removeItem = async (key: string): Promise<void> => {
    try {
      return await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  const addPrivateKeyToStorage = async (hcp: HealthcareParty, content: string): Promise<void> => {
    if (!hcp || !hcp.id || !content) {
      return;
    }

    const splitPosition = Math.floor(content.length / 2);
    const part1 = content.substr(0, splitPosition);
    const part2 = content.substr(splitPosition);

    await setItem(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`, part1);
    await setItem(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`, part2);
  };

  const getPrivateKeyFromStorage = async (hcp: HealthcareParty): Promise<string | undefined> => {
    if (!hcp || !hcp.id) {
      return;
    }

    try {
      const part1 = await getItem(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`);
      const part2 = await getItem(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`);

      if (!part1 || !part2) {
        throw Error('No private key value found in storage');
      }

      return part1 + part2;
    } catch (error) {
      throw error;
    }
  };

  const removePrivateKeyFromStorage = async (hcp: HealthcareParty): Promise<void> => {
    if (!hcp || !hcp.id) {
      return;
    }

    await removeItem(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`);
    await removeItem(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`);
  };

  return {
    addPrivateKeyToStorage,
    getPrivateKeyFromStorage,
    removePrivateKeyFromStorage,
    setItem,
    getItem,
    removeItem,
  };
};
