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

import * as SecureStore from 'expo-secure-store';
import { PRIVATE_KEY_POSTFIX_1, PRIVATE_KEY_POSTFIX_2 } from '../constant';
import { HealthcareParty } from '../models';

export default () => {
  const addPrivateKeyToStorage = async (
    hcp: HealthcareParty,
    content: string
  ): Promise<void> => {
    if (!hcp || !hcp.id || !content) {
      return;
    }

    const splitPosition = Math.floor(content.length / 2);
    const part1 = content.substr(0, splitPosition);
    const part2 = content.substr(splitPosition);

    await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`, part1);
    await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`, part2);
  };

  const getPrivateKeyFromStorage = async (
    hcp: HealthcareParty
  ): Promise<string | undefined> => {
    if (!hcp || !hcp.id) {
      return;
    }

    try {
      const part1 = await SecureStore.getItemAsync(
        `${hcp.id}${PRIVATE_KEY_POSTFIX_1}`
      );
      const part2 = await SecureStore.getItemAsync(
        `${hcp.id}${PRIVATE_KEY_POSTFIX_2}`
      );

      if (!part1 || !part2) {
        throw Error('No private key value found in storage');
      }

      return part1 + part2;
    } catch (error) {
      throw error;
    }
  };

  const removePrivateKeyFromStorage = async (
    hcp: HealthcareParty
  ): Promise<void> => {
    if (!hcp || !hcp.id) {
      return;
    }

    await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`);
    await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`);
  };

  return {
    addPrivateKeyToStorage,
    getPrivateKeyFromStorage,
    removePrivateKeyFromStorage,
  };
};
