import {Component} from '@angular/core';
import {OrderEntity} from '../../../../core/entities/order-entity';

@Component({
    selector: 'app-orders-page',
    templateUrl: './orders-page.component.html',
    styleUrls: [
        './orders-page.component.less'
    ],
})
export class OrdersPageComponent {

    public orders: OrderEntity[] = [];
    public loading = false;
    public showFinalized = false;
    public filter = {
        interval: [new Date(), new Date()]
    };

    toggleFinalized() {
        this.showFinalized = !this.showFinalized;
    }
}
