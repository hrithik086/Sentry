export class DuplicateCredentialError extends Error{
    constructor(msg:string){
        super(msg);
        this.name = 'DuplicateItemError';
    }
}