import { ErrorHandler } from "@angular/core";

export class GlobalErrorHandler implements ErrorHandler{
    handleError(error: any): void {
        if(error instanceof Error)
            console.error(error.message);
    }

}