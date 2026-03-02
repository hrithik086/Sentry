import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManager } from '../../Services/FileManager/file-manager';
import { DecryptedCredentials } from '../../Models/DecryptedCredentials';

interface ImportResult {
  rowNumber: number;
  status: 'success' | 'error';
  data: {
    domainName: string;
    userId: string;
    password: string;
  };
  errorMessage?: string;
}

@Component({
  selector: 'app-bulk-import-credentials',
  imports: [CommonModule],
  templateUrl: './bulk-import-credentials.html',
  styleUrl: './bulk-import-credentials.css',
})
export class BulkImportCredentials {
  selectedFile: File | null = null;
  selectedFileName: string = '';
  fileError: string = '';
  isImporting: WritableSignal<boolean> = signal(false);
  importResults: ImportResult[] = [];
  importMessage: string = '';
  messageType: string = '';
  private fileService = inject(FileManager);

  get successCount(): number {
    return this.importResults.filter(r => r.status === 'success').length;
  }

  get failureCount(): number {
    return this.importResults.filter(r => r.status === 'error').length;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    this.fileError = '';

    if (!files || files.length === 0) {
      this.selectedFile = null;
      this.selectedFileName = '';
      return;
    }

    const file = files[0];
    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      this.fileError = 'Please select a valid Excel file (.xlsx or .xls)';
      this.selectedFile = null;
      this.selectedFileName = '';
      return;
    }

    if (file.size > (5 * 1024 * 1024)) {
      this.fileError = 'File size must be less than 5MB';
      this.selectedFile = null;
      this.selectedFileName = '';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  downloadTemplate(): void {
    const link = document.createElement('a');
    link.setAttribute('href', 'Files/Bulk Import.xlsx');
    link.setAttribute('download', 'credential-import-template.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.importMessage = 'Template downloaded successfully!';
    this.messageType = 'success';
    setTimeout(() => {
      this.importMessage = '';
    }, 3000);
  }

  importCredentials(): void {
    if (!this.selectedFile) {
      this.fileError = 'Please select a file first';
      return;
    }

    this.fileService.readBulkImportXlsxFile(this.selectedFile, this.isImporting);
  }

  saveImportedCredentials(): void {
    const successfulRecords = this.importResults.filter(r => r.status === 'success');

    if (successfulRecords.length === 0) {
      this.importMessage = 'No successful records to save';
      this.messageType = 'error';
      return;
    }

    try {
      successfulRecords.forEach(record => {
        const credential: DecryptedCredentials = {
          domainName: record.data.domainName,
          userId: record.data.userId,
          password: '',
          decryptedPassword: record.data.password,
          decryptedSecurityKeys: '',
          decryptedPin: '',
          decryptedOtherDetails: [],
        };

        this.fileService.addNewCredential(credential);
      });

      this.importMessage = `Successfully imported ${successfulRecords.length} credential(s)!`;
      this.messageType = 'success';

      // Reset after successful import
      setTimeout(() => {
        this.resetImportForm();
      }, 2000);
    } catch (error) {
      this.importMessage = 'Error saving credentials. Please try again.';
      this.messageType = 'error';
      console.error('Error saving credentials:', error);
    }
  }

  private parseCSVRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }

    if (current) {
      result.push(current.trim().replace(/"/g, ''));
    }

    return result;
  }

  private resetImportForm(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.importResults = [];
    this.fileError = '';
    this.importMessage = '';
  }
}
