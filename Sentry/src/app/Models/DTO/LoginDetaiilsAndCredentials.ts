import { Credentials } from "../Credentials";

export interface LoginDetailsAndCredentials {
    publicId: string; //TODO (publickey)
    userId: string;
    password: string;
    fileName: string;
    credentials: Credentials[];
}