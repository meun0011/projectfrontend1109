import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/modules/DataSharingService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userDetail : any ;
  totalItem : number
  constructor(
    private router : Router,
    private dataSharingService: DataSharingService
  ) { 
    this.dataSharingService.userDetail.subscribe( value => {
      var userDetailSession : any = sessionStorage.getItem("userDetail")
      this.userDetail = JSON.parse(userDetailSession)
  });
  this.dataSharingService.cartNumber.subscribe(value => {
    if (value !== null && value !== undefined) {
      this.totalItem = Number(value); // Ensure value is converted to number
    }
  });
  }
  
  ngOnInit() {
    var userDetailSession : any = sessionStorage.getItem("userDetail")
    this.userDetail = JSON.parse(userDetailSession)
  }

  logout(){
    sessionStorage.removeItem("userDetail")
    this.dataSharingService.userDetail.next(true);
    this.router.navigate(['/login']);
  }

}
