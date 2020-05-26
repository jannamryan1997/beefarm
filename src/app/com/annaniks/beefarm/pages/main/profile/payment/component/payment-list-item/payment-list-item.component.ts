import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { PayBillView } from 'src/app/com/annaniks/beefarm/core/modals';
import { Payment } from 'src/app/com/annaniks/beefarm/core/models/payment';
import { GoodsResponse } from 'src/app/com/annaniks/beefarm/core/models/goods';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { PurchaseService } from '../../../../purchase/purchase.service';

@Component({
    selector: "payment-list-item",
    templateUrl: "payment-list-item.component.html",
    styleUrls: ["payment-list-item.component.scss"]
})

export class PaymentListItemComponent implements OnInit {
    @Input() paymentData: Payment;
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public goodData: GoodsResponse[] = [];
    public shop:string;
    public goodDataName: string;
    public goodPrice: number;
    public hive: boolean = false;
    public section: string;
    constructor(private _dialog: MatDialog, private _purchaseService: PurchaseService) {
    }

    ngOnInit() {
        this._getGood();
        if (this.paymentData.cancel) {
            this.section = "cancel";
        }
        else if (this.paymentData.cancel == null && this.paymentData.paid) {
            this.section = "paid";
        }
        else if (this.paymentData.paid == null && this.paymentData.accepted) {
            this.section = "accepted";
        }
        else if (this.paymentData.cancel == null && this.paymentData.paid == null && this.paymentData.accepted == null) {
            this.section = "wait";
        }
    }
    private _openStandartHive(): void {
        this.hive = !this.hive;
    }

    public _getGood(): void {
        this._purchaseService.getGoot()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this.goodData = data;
                console.log(this.goodData,"goods");
                
                for (var i = 0; i < this.goodData.length; i++) {
                    if (this.paymentData.goods == parseInt(this.goodData[i].id)) {
                        this.goodDataName = this.goodData[i].name;
                        this.goodPrice = this.goodData[i].price;
                        this.shop=this.goodData[i].shop;
                        
                    }
                }
            })
    }

    public onclick(): void {
        this._openStandartHive();
    }

   public  redirecToShopPage():void {
        window.open( "https://beesvalleys.com/collections/started-yyyytr/products/beehive?variant=31662946844742", '_blank');
    }
}