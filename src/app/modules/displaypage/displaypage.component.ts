import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from '../services/cart.service';

interface CartItem {
  productId: number;
  productTypeId: number;
  productName: string;
  productDesc: string;
  price: number;
  imgList: string[];
  quantity: number;}
@Component({
  selector: 'app-displaypage',
  templateUrl: './displaypage.component.html',
  styleUrls: ['./displaypage.component.css']
})



export class DisplaypageComponent implements OnInit {

  public productList: CartItem[] = [];
  imageBlobUrl :any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private cartService : CartService,
    

  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['responseData']) {
        try {
          const parsedData = JSON.parse(params['responseData']);
          // ตรวจสอบว่า parsedData เป็น Object หรือ Array
          if (Array.isArray(parsedData)) {
            this.productList = parsedData;
          } else {
            // ถ้าเป็น Object ให้ใส่ลงใน Array
            this.productList = [parsedData];
          }
        } catch (error) {
          console.error('Failed to parse responseData:', error);
          this.productList = [];
        }
      }
      console.log('productList1', this.productList);
      for (let product of this.productList) {
        this.callService
          .getProductImgByProductId(product.productId)
          .subscribe((res) => {
            if (res.data) {
              product.imgList = [];
              this.getImageList(res.data, product.imgList);
            } else {
              window.location.reload();
            }
          });
      }
    });
  }
  getImageList(imageNames: any[], imgList: any) {
    for (let imageName of imageNames) {
      this.callService.getBlobThumbnail(imageName.productImgName).subscribe((res) => {
        let objectURL = URL.createObjectURL(res);
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push(this.imageBlobUrl);
      });
    }
  }
  // async addToCart(productId: any): Promise<void> {
   
  //   await this.cartService.addToCart(productId);
  // }
  async addtoCart(productId: any): Promise<void> {
    try {
      
      const existingProduct = this.cartService.getCartItemById(productId);

      if (existingProduct) {
        // ถ้าสินค้ามีอยู่แล้วในรถเข็น ให้เพิ่มจำนวนสินค้า
        existingProduct.quantity += 1;
        await this.cartService.updateCartItem(existingProduct);
      } else {
        // ถ้าสินค้าไม่มีในรถเข็น ให้เพิ่มเป็นรายการใหม่
        await this.cartService.addtoCart(productId);
      }
    } catch (error) {

    }
    finally{

    }}
 
 
  

}
