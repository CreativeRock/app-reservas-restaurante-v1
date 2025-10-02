import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
})
export class ErrorMessage {
  @Input() message: string = '';
}
