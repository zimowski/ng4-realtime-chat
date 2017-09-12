import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import 'rxjs/add/operator/takeWhile';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public signupForm: FormGroup;
  public loading: boolean;
  private isAlive = true;
  @Output() onSignup: EventEmitter<any> = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private snackBar: MdSnackBar) { }

  public ngOnInit(): void {
    // Build signup form
    this.signupForm = this.buildForm();
  }

  public ngOnDestroy(): void {
    // Unsubscribe observables
    this.isAlive = false;
  }

  public buildForm(): FormGroup {
    // Form sheet
    return this.formBuilder.group({
      username: [
        {
          value:  '',
          disabled: this.loading
        }, [
          Validators.required,
          Validators.pattern('[A-Za-z0-9_. ]{3,30}')
        ]
      ],
      password: [
        {
          value: '',
          disabled: this.loading
        }, [
          Validators.required,
          Validators.minLength(4)
        ]
      ],
      repeat_password: [
        {
          value: '',
          disabled: this.loading
        }, [
          Validators.required,
          Validators.minLength(4)
        ]
      ],
      gender: [
        {
          value: '',
          disabled: this.loading
        }, [
          Validators.pattern('(M|F){1}')
        ]
      ],
      city: [
        {
          value: '',
          disabled: this.loading
        }, [
          Validators.pattern('[A-Za-z ]{3,25}')
        ]
      ]
    });
  }

  public signup(): void {
    this.loading = true;
    this.authService
      .signup(this.signupForm.value)
      .takeWhile(() => this.isAlive)
      .subscribe(
        (response) => {
          this.snackBar.open(response.response || 'Signup error', null, {
            duration: 6000
          });

          if (response.status) {
            this.onSignup.emit({
              username: this.signupForm.get('username').value,
              password: this.signupForm.get('password').value
            });
          }
          this.loading = false;
        }, (error) => {
          this.snackBar.open(error.response || 'Signup error', null, {
            duration: 6000
          });
          this.loading = false;
        }
      );
  }
}
