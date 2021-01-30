import { HealthcareParty as IcureHealthcareParty } from '@icure/api';

export class HealthcareParty extends IcureHealthcareParty {
  id: string;

  constructor(json: JSON | any) {
    super(json);
    this.id = json.id!!;
  }
}
