import { Component, inject } from '@angular/core';
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
  isImporting: boolean = false;
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
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      this.fileError = 'Please select a valid Excel file (.xlsx, .xls, or .csv)';
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

    this.isImporting = true;
    this.importResults = [];
    this.fileError = '';

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());

        if (rows.length < 2) {
          this.fileError = 'File is empty or contains only headers';
          this.isImporting = false;
          return;
        }

        // Parse header row
        const headerRow = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const requiredColumns = ['Domain Name', 'Username/Email', 'Password'];
        const missingColumns = requiredColumns.filter(col => !headerRow.includes(col));

        if (missingColumns.length > 0) {
          this.fileError = `Missing required columns: ${missingColumns.join(', ')}`;
          this.isImporting = false;
          return;
        }

        // Find column indices
        const domainIndex = headerRow.indexOf('Domain Name');
        const userIdIndex = headerRow.indexOf('Username/Email');
        const passwordIndex = headerRow.indexOf('Password');
        const pinIndex = headerRow.indexOf('PIN');
        const securityKeysIndex = headerRow.indexOf('Security Keys');

        // Parse data rows
        const results: ImportResult[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cells = this.parseCSVRow(rows[i]);

          if (cells.length === 0) continue;

          const domainName = cells[domainIndex]?.trim() || '';
          const userId = cells[userIdIndex]?.trim() || '';
          const password = cells[passwordIndex]?.trim() || '';
          const pin = cells[pinIndex]?.trim() || '';
          const securityKeys = cells[securityKeysIndex]?.trim() || '';

          const result: ImportResult = {
            rowNumber: i,
            status: 'success',
            data: { domainName, userId, password },
          };

          // Validate required fields
          if (!domainName) {
            result.status = 'error';
            result.errorMessage = 'Domain Name is required';
          } else if (!userId) {
            result.status = 'error';
            result.errorMessage = 'Username/Email is required';
          } else if (!password) {
            result.status = 'error';
            result.errorMessage = 'Password is required';
          }

          results.push(result);
        }

        if (results.length === 0) {
          this.fileError = 'No valid records found in the file';
          this.isImporting = false;
          return;
        }

        this.importResults = results;
        this.importMessage = `Processed ${results.length} records. ${this.successCount} can be imported.`;
        this.messageType = 'info';
      } catch (error) {
        this.fileError = 'Error parsing file. Please ensure it is a valid CSV or Excel file.';
        console.error('Error reading file:', error);
      } finally {
        this.isImporting = false;
      }
    };

    reader.onerror = () => {
      this.fileError = 'Error reading the file';
      this.isImporting = false;
    };

    reader.readAsText(this.selectedFile);
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
