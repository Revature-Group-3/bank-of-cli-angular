import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [ MatDialogModule, MatButtonModule ],
  templateUrl: './dialogue-box.html',
  styleUrl: './dialogue-box.css'
})

export class DialogueBox {
  constructor(
    private dialogRef: MatDialogRef<DialogueBox>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectOption (action: string) {
    this.dialogRef.close(action);
  }

}
