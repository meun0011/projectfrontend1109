import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { DataSharingService } from '../DataSharingService';

interface CartItem {
  productId: number;
  productTypeId: number;
  productName: string;
  productDesc: string;
  price: number;
  imgList: string[];
  quantity: number;
}
@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {
  public shippingCost: number = 40;
  public grandTotal: number = 0;
  constructor(
    private callService: CallserviceService,
    private activated: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private dataSharingService: DataSharingService,
  ) {
    this.updateForm = this.formBuilder.group({
      userId: '',
      name: '',
      shippingAddress: '',
      status: '',
      phone: '',
      productId: this.formBuilder.array([]),
      quantity: this.formBuilder.array([]),
    });
  }
  updateForm: FormGroup;
  userId: any;
  orderList: any[] = [];
  userDetail: any;
  selectedProduct: any;
  provincesData: any[] = [];
  selectedOrder: any;  
  selectedProducts: number;
  promprayNumber = '0633821403';
  linkPrompray: string = '';
  selectedFiles: any = [];
  isSubmit: boolean = false;
  selectedpayments: any

  statuses = [
    { value: '1', label: 'กำลังตรวจสอบ' },
    { value: '2', label: 'ชำระเงินเเล้ว รอรับสินค้า' },
    { value: '3', label: 'ยังไม่ชำระเงิน' },
    { value: '4', label: 'ชำระเงินไม่ครบตามจำนวน' }
  ];
  

  ngOnInit() {

    let userDetailSession: any = sessionStorage.getItem('userDetail');
    this.userDetail = JSON.parse(userDetailSession);

    this.callService
      .getOrderIdByUserId(this.userDetail.userId)
      .subscribe((res) => {
        if (res.data) {
          this.orderList = res.data;
          console.log('orderList', res.data);
          this.orderList.forEach((order) => {
            this.getUserDetails(order.userId).then((userData) => {
              order.userData = userData;
            });
          });

        this.callService.getAllPaymentImage().subscribe(
          (data: any) => {
            const paymentImages = data.data;

            this.orderList.forEach((order: any) => {
              // กรองภาพการชำระเงินที่ตรงกับ ordersId ใน orderList

              order.paymentImage = paymentImages.filter(
                (payment: any) => order.ordersId === payment.ordersId
              );

              order.paymentImage.forEach((payment: any) => {
                payment.imgList = [];
                this.callService
                  .getSlipImgByUserId(payment.ordersId)
                  .subscribe((imgRes: any) => {
                    if (imgRes.data) {
                      this.getImage(imgRes.data, payment.imgList);
                    }
                  });
              });
            });

            // Log เพื่อตรวจสอบข้อมูล
            console.log('orderList with payment images', this.orderList);
          },
          (error: any) => {
            console.error('Error fetching payment images', error);
          }
        );
        console.log('getAllOrder', this.orderList);

          // เรียกฟังก์ชัน getAllProduct() หลังจากดึง orderList แล้ว
          this.callService.getAllProduct().subscribe((res: any) => {
            if (res.data) {
              const allProducts = res.data;

              // เพิ่ม productList ในแต่ละ order
              this.orderList.forEach((order: any) => {
                order.productList = allProducts.filter((product: any) =>
                  order.productId.includes(product.productId)
                );
                console.log('productList', order.productList);
                order.productList.forEach((product: any) => {
                  product.imgList = [];
                  this.callService
                    .getProductImgByProductId(product.productId)
                    .subscribe((imgRes) => {
                      if (imgRes.data) {
                        this.getImageList(imgRes.data, product.imgList);
                      }
                    });
                });
              });
            }
          });
        }
      });
      this.dataSharingService.userDetail.subscribe((value) => {
        const userDetailSession: any = sessionStorage.getItem('userDetail');
        this.userDetail = JSON.parse(userDetailSession);
      });
  }

  getImage(imageNames: any[], imgList: any[]) {
    for (let imageName of imageNames) {
      this.callService
        .getSlipImgBlobThumbnail(imageName.slipImgName)
        .subscribe((res) => {
          if (res) {
            let objectURL = URL.createObjectURL(res);
            let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            imgList.push(safeUrl);
          }
        });
    }
  }
  getImageList(imageNames: any[], imgList: any[]) {
    for (let imageName of imageNames) {
      this.callService
        .getBlobThumbnail(imageName.productImgName)
        .subscribe((res) => {
          if (res) {
            let objectURL = URL.createObjectURL(res);
            let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            imgList.push(safeUrl);
          }
        });
    }
  }
  getUserDetails(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.callService.getByUserId(userId).subscribe((response) => {
        if (response.status === 'SUCCESS') {
          resolve(response.data);
        } else {
          reject('Error fetching user details');
        }
      });
    });
  }

  getQuantity(order: any, productId: number): number {
    const productIndex = order.productId.indexOf(productId);
    return productIndex > -1 ? order.quantity[productIndex] : 0;
  }
  onDeleteOrder(ordersId: any) {
    if (ordersId) {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณจะไม่สามารถย้อนกลับได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.callService.deleteOrder(ordersId).subscribe((res) => {
            if (res.data) {
              Swal.fire(
                'ลบแล้ว!',
                'ข้อมูลการสั่งซื้อของคุณถูกลบแล้ว.',
                'success'
              ).then(() => {
                window.location.reload();
              });
            }
          });
        }
      });
    }
  }
  setDataForms(selectedProduct: any): void {
    this.updateForm.patchValue({
      
      shippingAddress: selectedProduct.shippingAddress,
      name: selectedProduct.name,
      phone: selectedProduct.phone,
      
    });
  }

  setDataForm(selectedProduct: any): void {
    this.updateForm.patchValue({
      userId: selectedProduct.userId,
      status: selectedProduct.status,
    });

    this.updateForm.setControl(
      'productId',
      this.formBuilder.array(selectedProduct.productId || [])
    );
    this.updateForm.setControl(
      'quantity',
      this.formBuilder.array(selectedProduct.quantity || [])
    );
  }

  setSelectedProduct(order: any): void {
    this.selectedProduct = order;
    console.log('Selected Product:', this.selectedProduct);
    this.setDataForms(order);
    this.setDataForm(order);
  }

  onSubmit(): void {
    console.log('Form Values:', this.updateForm.value);

    const order = this.updateForm.value;

    console.log('Request Payload:', {
      order: order,
      ordersId: this.selectedProduct.ordersId,
    });

    this.callService
      .updateOrder(order, this.selectedProduct.ordersId)
      .subscribe(
        (res) => {
          console.log('Response:', res);
          if (res.data) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ!',
              text: 'แก้ไขข้อมูลสำเร็จ',
              confirmButtonText: 'ตกลง',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'บันทึกไม่สำเร็จ!',
              text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
              confirmButtonText: 'ตกลง',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'ข้อผิดพลาด!',
            text: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
            confirmButtonText: 'ตกลง',
          });
          console.error('Error:', error);
        }
      );
  }

  setSelectedOrder(order: any): void {
    this.selectedOrder = order;
    console.log('Selected Order:', this.selectedOrder);
    
    if (order.productList && order.productList.length > 0 && order.productList[0].imgList.length > 0) {
    } else {
    }
  }

  setSelectedProducts(order: any, total: number): void {
    this.selectedProduct = order;
    this.selectedProducts = total;
    console.log('Selected Product:', this.selectedProduct);
    console.log('Selected Products:', this.selectedProducts);
    this.getData();
  }

  updateGrandTotal(): void {
    this.grandTotal =
      this.orderList.reduce(
        (total, order) => total + this.calculateOrderTotal(order),
        0
      ) + this.shippingCost;
    console.log('grandTotal', this.grandTotal);
    this.getData();
    // เรียก getData() เพื่ออัปเดตลิงก์ PromptPay ทันทีหลังจากอัปเดตราคาสุดท้าย
  }

  calculateOrderTotal(order: any): number {
    return order.productList.reduce(
      (total: number, product: any) =>
        total + product.price * this.getQuantity(order, product.productId),
      0
    );
  }
  getData() {
    this.linkPrompray = `https://promptpay.io/${this.promprayNumber}/${this.selectedProducts}.png`;
    console.log(this.linkPrompray);
  }

  onFileChanged(event: any) {
    this.selectedFiles.push(event.target.files);
  }
  setSubmit(){
    this.isSubmit = false;
  }
  // saveSlip(){
  //   this.callService.saveSlipImgOrderId
  // }
  saveSlip(orders: any) {
    const requests = [];

    for (const file of this.selectedFiles[0]) {
      const formData = new FormData();
      formData.append('file', file);

      // เก็บผลลัพธ์ของการสมัครสมาชิกแต่ละตัว
      requests.push(
        this.callService
          .saveSlipImgOrderId(formData, orders.ordersId)
          .toPromise()
      );
    }

    Promise.all(requests)
      .then((responses) => {
        console.log('saveImage=>', responses);

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลสำเร็จ',
          confirmButtonText: 'ตกลง',
        }).then((result) => {
          if (result.isConfirmed) {
            // อัปเดต UI หรือทำการกระทำอื่น ๆ แทนการรีเฟรชหน้า
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error('Error saving images:', error);
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด!',
          text: 'ไม่สามารถบันทึกข้อมูลได้',
          confirmButtonText: 'ตกลง',
        });
      });
  }
  payment1:any




  payments(payment: any) {
    this.selectedpayments = payment;
    console.log('Selected Product:', this.selectedpayments);
  }
}
