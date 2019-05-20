import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../utilities/base.component';
import { InjectHelper } from 'src/app/utilities/helpers/inject.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(
    injectHelper: InjectHelper,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    super(injectHelper);
  }

  ngOnInit() {

    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required])],
      document: [null, null],
    });
  }

  onSubmit() {

    if (this.uploader.queue.length > 10) {
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

    this.productService.addProduct(formData)
      .subscribe(result => {
        if (result) {
          this.form.reset();
          this.uploader.clearQueue();
          this.showSuccessNotification('Product has bees saved successfully');
        }
      });
  }

}
