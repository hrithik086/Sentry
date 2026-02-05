export class NoCredentialFoundError extends Error{
    constructor(msg:string){
        super(msg);
        this.name = 'NoCredentialFoundError';
    }
}