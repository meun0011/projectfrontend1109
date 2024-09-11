import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashbordAdmin',
  templateUrl: './dashbordAdmin.component.html',
  styleUrls: ['./dashbordAdmin.component.css']
})
export class DashbordAdminComponent implements OnInit {



  constructor(
    private callService : CallserviceService,
    private sanitizer: DomSanitizer,
    private router : Router,
    private cartService : CartService,
  ) { 
  }

  imageBlobUrl : any 
  imageBlobUrls : any = []
  productImgList : any
  productList : any
  productTypeList : any= []
  ngOnInit() {
   

    this.callService.getAllProduct().subscribe(res=>{
      
      if(res.data){
        this.productList = res.data
        for(let product of this.productList){
          product.imgList = []

          product.productType = this.productTypeList.filter((x : any)  => x.productTypeId == product.productTypeId);

          this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
            if(res.data){
              this.productImgList = res.data
              for(let productImg of this.productImgList){
                this.getImage(productImg.productImgName, product.imgList);
              }
            }else{
              // window.location.reload()
            }
          });
          
        }
      }
    }) 
  }

  getImage(fileNames : any ,  imgList : any){
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
        let objectURL = URL.createObjectURL(res);       
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push(this.imageBlobUrl)
    });
  }
  // async addToCart(productId: any): Promise<void> {
   
  //     await this.cartService.addToCart(productId);
     
    
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

setSeleted(product: any){
const queryParams = {
  responseData: JSON.stringify(product)
};
this.router.navigate(['/display'],{queryParams});
console.log('responseData', product);
}


}
