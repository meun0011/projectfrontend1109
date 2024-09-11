import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

const API_ENDPOINT = environment.API_ENDPOINT;
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': '*/*' }) };
const httpOptionsMultipart = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'accept': '*/*' }) };
const httpOptionsText = { headers: new HttpHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }) };


@Injectable({
  providedIn: 'root'
})
export class CallserviceService {

  constructor(
    private http: HttpClient
  ) { }

  getAllRole() : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/role/getAll'));
  }

  saveRegister(data : any) : Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(API_ENDPOINT.concat('/register/save'), body, httpOptions)
  }

  authen(userName:any, password:any) : Observable<any> {

    return this.http.get(API_ENDPOINT.concat('/login/authen?userName=' + userName + '&password='+ password))
  }

  updateProfile(data : any, userId : any) : Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(API_ENDPOINT.concat('/register/update/'+ userId), body, httpOptions)
  }

  getByUserId(userId:any) : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/register/getById?userId=' + userId))
  }

  getAllUser() : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/manage/user/getAllUser'));
  }

  deleteUserByUserId(userId : any) : Observable<any> {
    return this.http.delete(API_ENDPOINT.concat('/register/delete?userId='+ userId));
  }


  getProductImgByProductId(productId:any) : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/product/getProductImgByProductId?productId=' + productId))
  }

  getBlobThumbnail(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'    
    });
    return this.http.get<Blob>(API_ENDPOINT.concat('/product/getImageByte?fileName='+fileName)
    , {headers: headers, responseType: 'blob' as 'json' });
  }

  getImageByte(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'    
    });
    return this.http.get<Blob>(API_ENDPOINT.concat('/product/getImageByte?fileName='+fileName)
    , {headers: headers, responseType: 'blob' as 'json' });
  }

  getAllProduct() : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/product/getAll'));
  }

  getProductTypeAll() : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/product/getProductTypeAll'));
  }

  saveImage(formData: FormData, productId : any) : Observable<any> {
    return this.http.post<any>(API_ENDPOINT.concat('/product/saveImage/' + productId), formData)
  }

  saveProduct(data : any) : Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(API_ENDPOINT.concat('/product/save'), body, httpOptions)
  }

  removeImgByProductId(productId : any) : Observable<any> {
    return this.http.delete(API_ENDPOINT.concat('/product/removeImgByProductId?productId='+ productId));
  }

  deleteProduct(productId : any) : Observable<any> {
    return this.http.delete(API_ENDPOINT.concat('/product/delete?productId='+ productId));
  }

  getProductByProductId(productId:any) : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/product/getById?productId=' + productId))
  }

  updateProduct(data : any, productId : any) : Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(API_ENDPOINT.concat('/product/update/'+ productId), body, httpOptions)
  }

  deleteImage(fileName : any) : Observable<any> {
    return this.http.delete(API_ENDPOINT.concat('/product/deleteImgByFileName?fileName='+ fileName));
  }
  saveOrder(data : any) : Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(API_ENDPOINT.concat('/order/save'), body, httpOptions)
  }
  getAllOrder(): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/order/getAll'));
  }
  deleteOrder(ordersId: any): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat('/order/delete?ordersId=' + ordersId)
    );
  }
  updateOrder(data: any, ordersId: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(
      API_ENDPOINT.concat('/order/update/' + ordersId),
      body,
      httpOptions
    );
  }
  saveProfileImgUserId(formData: FormData, userId:any) : Observable<any> {
    return this.http.post<any>(API_ENDPOINT.concat('/manage/user/saveImage/' + userId), formData)
  }
 
  deleteProfileImage(fileName : any) : Observable<any> {
    return this.http.delete(API_ENDPOINT.concat('/manage/user/deleteImgByFileName?fileName='+ fileName));
  }
  // removeImgByProductId(productId : any) : Observable<any> {
  //   return this.http.delete(API_ENDPOINT.concat('/product/removeImgByProductId?productId='+ productId));
  // }
  getProfileImgByUserId(userId:any) : Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/manage/user/getProfileImgByUserId?userId=' + userId))
  }

  getProfileImgBlobThumbnail(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'    
    });
    return this.http.get<Blob>(API_ENDPOINT.concat('/manage/user/getImageByte?fileName='+fileName)
    , {headers: headers, responseType: 'blob' as 'json' });
  }

  getProfileImageByte(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'    
    });
    return this.http.get<Blob>(API_ENDPOINT.concat('/manage/user/getImageByte?fileName='+fileName)
    , {headers: headers, responseType: 'blob' as 'json' });
  }

  saveSlipImgOrderId(formData: FormData, orderId : any) : Observable<any> {
  return this.http.post<any>(API_ENDPOINT.concat('/slip/saveSlip/' + orderId), formData)
}

// ------------------------------------------


deleteSlipImage(fileName: any): Observable<any> {
  return this.http.delete(
    API_ENDPOINT.concat(
      '/slip/deleteImgByFileName?fileName=' + fileName
    )
  );
}

getSlipImgByUserId(ordersId: any): Observable<any> {
  return this.http.get(
    API_ENDPOINT.concat('/slip/getSlipImgByOrdersId?ordersId=' + ordersId)
  );
}

getSlipImgBlobThumbnail(fileName: string): Observable<Blob> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  return this.http.get<Blob>(
    API_ENDPOINT.concat('/slip/getImageByte?fileName=' + fileName),
    { headers: headers, responseType: 'blob' as 'json' }
  );
}

getSlipImageByte(fileName: string): Observable<Blob> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  return this.http.get<Blob>(
    API_ENDPOINT.concat('/slip/getImageByte?fileName=' + fileName),
    { headers: headers, responseType: 'blob' as 'json' }
  );
}

getAllPaymentImage(): Observable<any> {
  return this.http.get(API_ENDPOINT.concat('/slip/getAllPayments'));
}  
getOrderIdByUserId(userId: any): Observable<any> {
  return this.http.get(
    API_ENDPOINT.concat('/order/getByUserId?userId=' + userId)
  );
}
}





