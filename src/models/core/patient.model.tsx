import { Patient as IcurePatient } from '@icure/api';

export class Patient extends IcurePatient {
  id: string;

  constructor(json: JSON | any) {
    super(json);
    this.id = json.id!!;
  }
}
