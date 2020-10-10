import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: string[] = [];
  opened: boolean = true;
  userId = sessionStorage.getItem('userId');
  username = sessionStorage.getItem('username');  

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.userId){
      this.router.navigate(['/home'])
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  
  logOut() {    
    sessionStorage.removeItem('userId');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
