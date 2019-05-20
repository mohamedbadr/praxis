
export class ProductModel {
  productId: number;
  productCode: string;
  productName: string;
  price: number;
  companyId: string;
  images: Array<ProductImage>;
  quantity: number;
  customerId: string;
}

export class ProductImage {
  productImageId: number;
  imageUrl: string;
  description: string;
}
