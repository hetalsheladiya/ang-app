import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  // responseData = ''
  isSubmitted = false;
  errorMsg = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    if(sessionStorage.getItem('userId')) {
      this.router.navigate(['/home'])
    }
    else{
      this.router.navigate(['/login'])
    }
  }
  get fc(){
    return this.loginForm.controls;
  }
  onSubmit() {
    this.isSubmitted = true;    
    this.api.login(this.loginForm.value).subscribe((res: any) => {            
        if(res.status == 'success') {           
          var userId = res.data._id;  
          var username = res.data.username;          
          sessionStorage.setItem('userId', userId); 
          sessionStorage.setItem('username', username); 
          this.router.navigate(['/home']);
        }
        else{
            this.errorMsg = res.data.msg;
        }                   
    })
  }
}
