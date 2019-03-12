import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ToastService} from '../../../support/services';
import {MatDialog} from '@angular/material';
import * as Highcharts from 'highcharts';
import {HttpClient} from '@angular/common/http';


@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: [
        './dashboard-page.component.less'
    ],
})
export class DashboardPageComponent implements OnDestroy, AfterViewInit {

    chart: Highcharts.Chart;
    @ViewChild('container') public container: ElementRef<HTMLDivElement>;
    public loading = false;
    private destroyed$ = new Subject();
    public filter = {
        group: 'day',
        interval: [new Date(), new Date()]
    };
    public data = {
        balance: 0,
        cancelled_count: 0,
        chart: {labels: [], series: [], format: '{value:%d/%m/%Y}'},
        cost: 0,
        discount: 0,
        orders_count: 0,
        top_five: []
    };

    displayedColumns: string[] = ['position', 'description', 'quantity'];

    public constructor(
        private toastr: ToastService,
        private http: HttpClient,
        private dialogService: MatDialog
    ) {
        this.refresh();
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
        this.http.post('/api/dashboard/data', this.filter)
            .subscribe((data: any) => {
                this.data = data;
                this.createChart();
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

}
