export class Parcel {
    namesender: string;
    email_out: string;
    sendtext: string;

    constructor(values: Object = {}) {
      //Constructor initialization
      Object.assign(this, values);
    } 
}