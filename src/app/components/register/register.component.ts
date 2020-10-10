import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataComponent } from 'src/app/dialog-data/dialog-data.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitted = false;
  errorMsg = '';
  responseData = {};
  constructor(
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  get fc(){
    return this.registerForm.controls;
  }
  signup() {
    this.isSubmitted = true;
    console.log(this.registerForm.value);
    this.api.register(this.registerForm.value).subscribe((res: any) => {
      console.log(res);
      if(res.status == 'success'){
        this.responseData = res.data;
        this.dialog.open(DialogDataComponent,{data:{status: res.status, message: res.msg}});      
        setTimeout(() => {
          this.dialog.closeAll();
        }, 1000);        
        this.router.navigate(['/login'])
      }
      else {
        this.errorMsg = res.msg;  
        this.dialog.open(DialogDataComponent,{data:{status: res.status, message: this.errorMsg}});      
        setTimeout(() => {
          this.dialog.closeAll();
        }, 1000);
      }
    })
  }

}
