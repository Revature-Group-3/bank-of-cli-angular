import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-action-dialog',
  imports: [ MatDialogModule, MatButtonModule ],
  templateUrl: './dialog-box.html',
  styleUrl: './dialog-box.css',
  standalone: true
})

export class DialogBox {
  constructor(
    private dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectOption (action: string) {
    this.dialogRef.close(action);
  }



}
