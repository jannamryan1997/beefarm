import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: "app-header",
    templateUrl: "header.component.html",
    styleUrls: ["header.component.scss"]
})

export class HeaderComponent implements OnInit {
    public menuOpened: boolean = false;
    public userName: string;
    public promoCodeGroup: FormGroup;
    public fa: string;
    constructor(
        private _router: Router,
        private _fb: FormBuilder,
        private _http:HttpClient
) {}
    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.promoCodeGroup = this._fb.group({
            promoCode: ["#1212232334"]
        })
       }

    private _signOff(): void {
     this._router.navigate(["/home"]);
    }
    public onclickSignOff(): void {
        this._signOff();
    }

    public onClickOpenMenu(): void {
        this.menuOpened = !this.menuOpened;
    }

    public router(router): void {
        this._router.navigate([router]);
        this.menuOpened = false;
    }

    public copyInputMessage(inputElement): void {
        this.promoCodeGroup.enable();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.promoCodeGroup.disable();
    }

}
