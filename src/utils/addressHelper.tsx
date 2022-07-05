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

import { Address } from '@icure/api';
import { compact, find, first } from 'lodash';

export const mainAddress = (addresses?: Address[]): Address => {
  return (
    find(addresses, a => {
      return a.addressType === Address.AddressTypeEnum.Home;
    }) ??
    first(addresses) ??
    new Address({})
  );
};

export const addressAsString = (addresses?: Address[]): string => {
  const address = mainAddress(addresses);

  if (address) {
    const street = `${address?.street || ''} ${
      address?.houseNumber || ''
    }`.trim();
    const locality = `${address?.postalCode || ''} ${
      address?.city || ''
    }`.trim();

    return compact([street, locality]).join(', ');
  }

  return '';
};
