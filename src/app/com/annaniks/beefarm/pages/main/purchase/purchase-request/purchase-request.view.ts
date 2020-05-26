import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: "view-purchase-request",
    templateUrl: "purchase-request.view.html",
    styleUrls: ["purchase-request.view.scss"]
})

export class PurchaseRequestView implements OnInit {

    constructor(private _router:Router) { }

    ngOnInit() { }

    public onClickPurchaseBeehives():void{
        this._router.navigate(['/purchase/purchaseBeehives']);

    }
}