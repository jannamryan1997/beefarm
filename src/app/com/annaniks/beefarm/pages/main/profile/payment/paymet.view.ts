import { Component, OnInit, OnDestroy } from "@angular/core";
import { MenuService } from '../../../../core/services/menu.service';
import { RouteStep } from '../../../../core/models/route-step';
import { PaymentService } from './payment.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Payment } from '../../../../core/models/payment';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: "payment-view",
    templateUrl: "payment.view.html",
    styleUrls: ["payment.view.scss"]
})
export class PaymentView implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public paymentResponseData: Payment[] = [];
    public loading: boolean = false;
    constructor(
        private _menuService: MenuService,
        private _paymentService: PaymentService,
        private _http:HttpClient
    ) {
        const routeSteps: RouteStep[] = [
            { label: 'Main', routerLink: '/' },
            { label: 'Payments', routerLink: '/profile/payments' }
        ]
        this._menuService.setRouteSteps(routeSteps);
    }

    ngOnInit() {
        this._getPayment();
    }

    private _getPayment(): void {
        this.loading = true;
        this._http.get('assets/json/payment.json')
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            )
            .subscribe((data: Payment[]) => {
                this.paymentResponseData = data;
                console.log(this.paymentResponseData);

            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }


}