import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface CartItem {
  productId: number;
  productTypeId: number;
  productName: string;
  productDesc: string;
  price: number;
  imgList: { key: string, value: string }[];
  quantity: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productList: CartItem[] = [];
  grandTotal: number = 0;
  imageBlobUrl: any;
  userId: any;
  userDetail: any;
  productId: number[] = [];
  quantity: number[] = [];

  constructor(
    private callService : CallserviceService,
    private cartService : CartService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private activated: ActivatedRoute,
    private router: Router,
  ) {
    

  }
  orderForm: FormGroup = this.formBuilder.group({
    productId: [],
    quantity: [],
    shippingAddress: '',
    name: '',
    userId: '',
    phone: '',
  });


  ngOnInit() 
  {
     this.cartService.getProduct().subscribe(res => {
    this.productList = res 
    // .map((item: any) => ({ ...item, quantity: 1 }));
    console.log("productListCart", this.productList);
    for (let product of this.productList) {
      this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
        if (res.data) {
          product.imgList = [];
          this.getImageList(res.data, product.imgList);
        } else {
          window.location.reload();
        }
      });
    }
    this.updateGrandTotal();
    this.loadUserDetails();
  });
  this.userId = this.activated.snapshot.paramMap.get('userId');
}
  updateGrandTotal(): void {
    this.grandTotal = this.productList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
  removeItem(item: CartItem): void {
    if (confirm('Are you sure to remove this item from cart?')) {
      this.cartService.removeCartItem(item.productId);
      alert('Item removed from cart');
      this.productList = this.productList.filter(p => p.productId !== item.productId);
      this.updateGrandTotal();
    }
  }

  decrementQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity--;
    }
    this.updateGrandTotal();
    this.updateTotalItem(); 
    this.cartService.saveCartData();
  }

  incrementQuantity(product: any): void {
    product.quantity++;
    this.updateGrandTotal();
    this.updateTotalItem();
   this.cartService.saveCartData();
  }

  // decrementQuantity(item: CartItem): void {
  //   if (item.quantity > 1) {
  //     item.quantity--;
  //   } else {
  //     this.removeItem(item);
  //   }
  //   this.updateGrandTotal();
  // }

  // incrementQuantity(item: CartItem): void {
  //   item.quantity++;
  //   this.updateGrandTotal();
  // }

  loadUserDetails() {
    if (this.userId) {
      this.callService.getByUserId(this.userId).subscribe((res) => {
        if (res.data) {
          this.userDetail = res.data;
          this.setDataForm(this.userDetail);
        }
      });
    } else {
      let userDetailSession: any = sessionStorage.getItem('userDetail');
      this.userDetail = JSON.parse(userDetailSession);
      this.setDataForm(this.userDetail);

      console.log('userId', this.userDetail.userId);
    }
  }

  setDataForm(data: any) {
    this.orderForm.patchValue({
      userId: data.userId,
      // name: data.name || '',
      // shippingAddress: data.shippingAddress || '',
      // phone: data.phone || '',
    });
  }

  getUserById(userId: any) {
    this.callService.getByUserId(userId).subscribe((res) => {
      if (res.data) {
        this.setDataForm(res.data);
        sessionStorage.removeItem('userDetail');
        sessionStorage.setItem('userDetail', JSON.stringify(res.data));
      }
    });
  }

  onSubmit() {
    this.productId = this.productList.map((item) => item.productId);
    this.orderForm.patchValue({ productId: this.productId });

    this.quantity = this.productList.map((item) => item.quantity);
    this.orderForm.patchValue({ quantity: this.quantity });

    console.log(this.orderForm.value);

    const data = this.orderForm.value;
    Swal.fire({
      title: 'ต้องการสั่งซื้อ',
      text: 'คุณต้องการสั่งซื้อใช้หรือไม่!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#56C596',
      cancelButtonColor: '#d33',
      confirmButtonText: 'สั่งซื้อ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.callService.saveOrder(data).subscribe((res) => {
          if (res.data) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ!',
              text: 'สั่งซื้อสำเร็จ',
              confirmButtonText: 'ตกลง',
            }).then((ress) => {
              this.router.navigate(['/userpage']);
              this.cartService.removeAllCartItems()
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'บันทึกไม่สำเร็จ!',
              text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
              confirmButtonText: 'ตกลง',
            });
          }
        });
      }
    });
  }
  totalItem: number = 0;
  updateTotalItem() {
    this.totalItem = this.productList.reduce((total:any, product:any) => total + product.quantity, 0);
  }

}
