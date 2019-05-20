import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    DialogModule
  ],
  exports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    DialogModule,
    DeleteDialogComponent
  ],
  declarations: [DeleteDialogComponent]
})
export class SharedModule { }
