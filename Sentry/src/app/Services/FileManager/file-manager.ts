import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileManager {
  public readJsonFile(file: File): void {
    let reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const json = JSON.parse(event.target.result);
        console.log('JSON content:', json);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };
    reader.readAsText(file);
  }
}
