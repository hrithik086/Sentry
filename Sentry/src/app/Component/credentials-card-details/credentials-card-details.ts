import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CredentialsCardDetails } from '../../Models/ViewModel/CredentialsCardDetails';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credentials-card-details',
  imports: [CommonModule],
  templateUrl: './credentials-card-details.html',
  styleUrl: './credentials-card-details.css',
})
export class CredentialsCardDetailsComponent {
  @Input()
  public item: CredentialsCardDetails

  @Output()
  public toggleExpandEvent = new EventEmitter<string>();
  @Output()
  public togglePasswordEvent = new EventEmitter<string>();

  public toggleExpand(id: string){
    this.toggleExpandEvent.emit(id);
  }

  public togglePassword(id: string){
    this.togglePasswordEvent.emit(id);
  }

  public mask(password: string) {
    return '•'.repeat(Math.min(12, password.length));
  }

  public getInitials(name: string) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  public copyToClipboard(text: string) {
    if (!text) return;
    if ((navigator as any).clipboard && (navigator as any).clipboard.writeText) {
      (navigator as any).clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }
}
