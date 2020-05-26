import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuService } from '../../../../core/services/menu.service';
import { RouteStep } from '../../../../core/models/route-step';
import { takeUntil, finalize, count } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { ProfileService } from '../profile.service';
import { User, Country } from '../../../../core/models/profile';
import { AuthService } from '../../../../core/services/auth.services';
import { MainService } from '../../main.service';
import { SuccessfullyModal } from '../../../../core/modals';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: "user-account-view",
    templateUrl: "user-account.view.html",
    styleUrls: ["user-account.view.scss"]
})
export class UserAccountView implements OnInit {
    public userAccountGroup: FormGroup;
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public loading: boolean = false;
    public data = [];
    private _userId: string;
    private _promocode: string;
    private _contact: number;
    private _user: User;
    public selectedCountry: Country;
    public keyword = 'name';
    public messageError: string;
    public dialCode: string;
    public countryData: Country[] = [];
    public countryNumber: string;
    constructor(
        private _fb: FormBuilder,
        private _menuService: MenuService,
        private _profileService: ProfileService,
        private _mainService: MainService,
        private _dialog: MatDialog,
        private _http: HttpClient,
    ) {
        const routeSteps: RouteStep[] = [
            { label: 'Main', routerLink: '/' },
            { label: 'Profile', routerLink: '/profile' }
        ]
        this._menuService.setRouteSteps(routeSteps);
        this._http.get('assets/json/user.json').subscribe((data: User) => {
            this._user = data;
            this.userAccountGroup.patchValue({
                name: this._user.name,
                phonenumber: this._user.phone,
                email: this._user.email,
                details: this._user.details,
                country: this._user.country,
            })
        })
        this._getCountries();
    }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.userAccountGroup = this._fb.group({
            name: [null, Validators.required],
            phonenumber: [null, Validators.required],
            country: [null, Validators.required],
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            details: [null]
        })
        this.userAccountGroup.get('phonenumber').valueChanges.subscribe((data) => {
            let str: string = data.toString();
            this.countryNumber = str.substring(0, 3);
        })
    }

    private _getCountries(): void {
        this._mainService.getCountries()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data: Country[]) => {
                this.countryData = data;
                const userCountry: string = this._user.country;
                let country: Country;
                for (let i = 0; i < this.countryData.length; i++) {
                    if (this.countryData[i].code === userCountry) {
                        country = this.countryData[i];
                    }
                }
                if (country) {
                    this.userAccountGroup.patchValue({
                        country: country.name
                    })
                    this.selectedCountry = country;
                }
            },
                err => {
                    this.messageError = err.error.msg;
                }

            )

    }

    private _postProfile(): void {
        this.loading = true;
        this.userAccountGroup.disable();
        let profileData: User = {
            id: this._userId,
            email: this.userAccountGroup.value.email,
            contract: this._contact,
            phone: this.userAccountGroup.value.phonenumber,
            country: (this.selectedCountry && this.selectedCountry.code) ? this.selectedCountry.code : '',
            name: this.userAccountGroup.value.name,
            details: this.userAccountGroup.value.details,
            promocode: this._promocode,
        }
        this.loading = false;
        this.userAccountGroup.enable();
        this._dialog.open(SuccessfullyModal, {
            width: "666px",
            height: "360px",
            data: {
                msg: "profileUpdated"
            }
        })

    }
    public selectEvent(country: Country): void {
        this.selectedCountry = country;
    }

    public onclickPostProfile(): void {
        this._postProfile();
    }

    public checkIsValid(controlName): boolean {
        return this.userAccountGroup.get(controlName).hasError('required') && this.userAccountGroup.get(controlName).touched;
    }

    get countries(): Observable<any> {
        return this._mainService.getCountries();
    }

    public cancle(): void {
        this.userAccountGroup.patchValue({
            name: this._user.name,
            phonenumber: this._user.phone,
            email: this._user.email,
            details: this._user.details,
            country: this._user.country,
        })
        this._getCountries();
    }
    public onCountryChange(event): void {
        this.dialCode = event.dialCode;
        this.userAccountGroup.patchValue({
            phonenumber: this.dialCode
        })
    }
}