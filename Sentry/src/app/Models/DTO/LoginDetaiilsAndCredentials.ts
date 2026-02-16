import { Credentials } from "../Credentials";

export interface LoginDetailsAndCredentials {
    publicId: string;
    userId: string;
    password: string;
    fileName: string;
    credentials: Credentials[];
}