import { Document as IcureDocument } from '@icure/api';

export class Document extends IcureDocument {
  id: string;

  constructor(json: JSON | any) {
    super(json);
    this.id = json.id!!;
  }
}
