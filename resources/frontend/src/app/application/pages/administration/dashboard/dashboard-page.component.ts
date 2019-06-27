import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ToastService} from '../../../../support/services';
import {MatDialog} from '@angular/material';
import * as Highcharts from 'highcharts';
import {AbstractTableComponent} from '../../../components';
import {DashboardService} from '../../../../core/services';
import {take} from 'rxjs/internal/operators/take';
import {tap} from 'rxjs/internal/operators/tap';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: [
        './dashboard-page.component.less'
    ],
})
export class DashboardPageComponent extends AbstractTableComponent<any> implements OnDestroy, AfterViewInit {

    chart: Highcharts.Chart;
    @ViewChild('container') public container: ElementRef<HTMLDivElement>;
    public loading = false;
    private destroyed$ = new Subject();
    public data = {
        balance: 0,
        cancelled_count: 0,
        chart: {labels: [], series: [], format: '{value:%d/%m/%Y}'},
        cost: 0,
        discount: 0,
        orders_count: 0,
        time_avg: '-'
    };

    displayedColumns: string[] = ['position', 'description', 'quantity'];

    public constructor(
        private toastr: ToastService,
        private dashboardService: DashboardService,
        dialogService: MatDialog
    ) {
        super(dialogService, {group: 'day', interval: [new Date(), new Date()]});
        this.refresh();
    }

    public paginate(page?, perPage?, sortable?, filter?) {
        return this.dashboardService.paginate(
            page,
            perPage,
            sortable,
            filter
        );
    }

    ngAfterViewInit(): void {
        this.createChart();
    }

    createChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        if (!this.container.nativeElement) {
            return;
        }
        this.chart = Highcharts.chart(this.container.nativeElement, {
            title: {
                text: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            xAxis: {
                type: 'datetime',
                categories: this.data.chart.labels,
                labels: {
                    format: `{value:${this.data.chart.format}}`
                }
            },
            tooltip: {
                xDateFormat: this.data.chart.format,
                shared: true
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                }
            },
            series: this.data.chart.series,
            credits: {
                enabled: false
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 700,
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'top',
                            layout: 'horizontal',
                            floating: false
                        }
                    }
                }]
            }
        } as any);
    }

    refresh() {
        super.refresh();
        this.dashboardService.data(this.filter).pipe(
            take(1),
            tap(data => this.data = data),
            tap(() => this.createChart())
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
