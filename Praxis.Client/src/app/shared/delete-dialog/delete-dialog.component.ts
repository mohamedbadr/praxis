import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-delete-dialog',
  template: `<p-dialog
  header="Conform Delete"
  width="500"
  [(visible)]="visible"
  [modal]="true"
  [responsive]="true">
  <p>This record will be deleted, are you sure you want to continue</p>
  <p-footer>
    <button
      type="button"
      class="btn btn-default"
      (click)="visible=false">
      Cancel
    </button>
    <button
      type="button"
      class="btn btn-danger"
      (click)="onConfirmDelete()">
      Delete
    </button>
  </p-footer>
</p-dialog>
`
})
export class DeleteDialogComponent implements OnInit {

  @Output() confirmed = new EventEmitter<boolean>();
  lang = environment.defaultLanguage;
  visible = false;

  constructor() { }

  ngOnInit() {
  }

  showDialog() {
    this.visible = true;
  }

  onConfirmDelete() {
    this.visible = false;
    this.confirmed.emit(true);
  }

}
