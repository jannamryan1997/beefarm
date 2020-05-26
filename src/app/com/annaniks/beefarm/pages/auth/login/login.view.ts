import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: "auth-login",
    templateUrl: "login.view.html",
    styleUrls: ["login.view.scss"]
})

export class LoginView implements OnInit {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public logIn: FormGroup;
    public errorMessage: string;
    public loading: boolean = false;
    public closeLoginMain: boolean = true;

    constructor(
        private _fb: FormBuilder,
        private _httpClient: HttpClient, private _router: Router) { }
    ngOnInit() {
        this._formBuilder();
    }
    private _formBuilder(): void {
        this.logIn = this._fb.group({
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),]],
        })
    }
    private _login(email): void {
        this.loading = true;
        this.logIn.disable();
        this._httpClient.get('assets/json/login.json')
        .pipe(
            takeUntil(this._unsubscribe$),
            finalize(() => {
                this.loading = false;
                this.logIn.enable();
            })
        )
            .subscribe((data: any) => {
                data.map((element, index) => {
                    if (element.email === this.logIn.value.email) {
                        this._router.navigate(['purchase'])
                    }
                    else {
                        this.errorMessage = "User not found."
                    }
                })
            },
            )

    }
    public onclickLogin(): void {
        this._login(this.logIn.value.email);
    }

    public checkIsValid(controlName): boolean {
        return this.logIn.get(controlName).hasError('required') && this.logIn.get(controlName).touched;
    }

}