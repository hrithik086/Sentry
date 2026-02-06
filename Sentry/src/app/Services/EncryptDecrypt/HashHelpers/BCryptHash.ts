import * as bcrypt from 'bcryptjs';

export class BCryptHash{
    private readonly salt : string = 'A3Qo.rxY2+=C=w(';
    private readonly computationRounds : number = 12;

    public async hashPlainText(plainText : string) : Promise<string> {
        plainText = this.salt+plainText;
        try{
            return await bcrypt.hash(plainText, this.computationRounds);
        }
        catch{
            //log error here
            return '';
        }
    }
}