import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../utilities/base.component';
import { InjectHelper } from 'src/app/utilities/helpers/inject.helper';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductModel } from '../../../core/models/product.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styles: ['.thumbnail{margin-bottom:10px !important}']
})
export class EditProductComponent extends BaseComponent implements OnInit {

  productId: number;
  product: ProductModel;
  form: FormGroup;
  selectedImageId: number;
  uploader: FileUploader = new FileUploader({
    isHTML5: true
  });
  @ViewChild('deleteDialog') deleteDialog: DeleteDialogComponent;

  constructor(
    injectHelper: InjectHelper,
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    super(injectHelper);
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.productId = +params.get('id');
        this.loadProduct();
      });
  }

  private loadProduct() {
    this.productService.getProductById(this.productId)
      .subscribe(product => {
        this.product = product;
        this.createForm();
      }, error => {
        this.handleError(error);
      });
  }

  private createForm() {
    this.form = this.fb.group({
      code: [this.product.productCode, Validators.compose([Validators.required])],
      name: [this.product.productName, Validators.compose([Validators.required])],
      price: [this.product.price, Validators.compose([Validators.required])],
      document: [null, null],
    });
  }

  onDelete(id: number) {
    this.selectedImageId = id;
    this.deleteDialog.showDialog();
  }

  onDeleteConfirmed() {
    this.productService.deleteProductImage(this.selectedImageId)
      .subscribe(result => {
        if (result) {
          this.product.images = this.product.images.filter(i => i.productImageId !== this.selectedImageId);
          this.selectedImageId = 0;
          this.showSuccessNotification('Image has been deleted successfully');
        }
      }, error => {
        this.handleError(error);
      });
  }

  onSubmit() {
    if (this.uploader.queue.length + this.product.images.length > 10) {
      this.showWarningMessage('Yoy can upload only 10 images');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('companyId', this.authService.getUserId());
    formData.append('productCode', this.form.controls.code.value);
    formData.append('productName', this.form.controls.name.value);
    formData.append('price', this.form.controls.price.value);

    for (let j = 0; j < this.uploader.queue.length; j++) {
      const fileItem = this.uploader.queue[j]._file;
      formData.append('file', fileItem, fileItem.name);
    }

    this.productService.editProduct(this.productId, formData)
      .subscribe(result => {
        this.product = result;
        this.createForm();
        this.uploader.clearQueue();
        this.showSuccessNotification('Product has bees saved successfully');
      });
  }



}
