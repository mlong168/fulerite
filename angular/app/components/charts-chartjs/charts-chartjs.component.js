class ChartsChartjsController {
  constructor ($rootScope, FeedService) {
    'ngInject'

    this.data = {};
    FeedService.getData()
      .then((response) => {
        response = response.plain()
        
        var data = [];
        var labels = [];
        for (var i = 0; i< response.data['feeds']['data'].length; i++){
          data[i] = response.data['feeds']['data'][i]['fmt-load-amount'];
          labels[i] = response.data['feeds']['data'][i]['key'];
        }
        $rootScope.feedLabels = labels;
        $rootScope.feedValues = data;
        this.lineChartLabels = labels;
        this.lineChartSeries = ['Series A'];
        this.lineChartData = [
          data
        ]
      })
  }                         

  $onInit () {

    /*this.lineChartLabels = this.data['tid']
    this.lineChartSeries = ['Series A', 'Series B']
    this.lineChartData = [
      this.data['fmt-load-amount'],
      this.data['fmt-load-price']
    ]*/

    this.areaChartLabels = ['Januarys', 'February', 'March', 'April', 'May', 'June', 'July']
    this.areaChartSeries = ['Series A', 'Series B']
    this.areaChartData = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ]
    this.areaChartColours = [
      {
        fillColor: '#D2D6DE',
        strokeColor: '#D2D6DE',
        pointColor: 'rgba(148,159,177,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(148,159,177,0.8)'
      },
      {
        fillColor: '#4B94C0',
        strokeColor: '#4B94C0',
        pointColor: '#2980b9',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(77,83,96,1)'
      }
    ]

    this.onClick = function () {}

    this.barChartLabels = ['Januarys', 'February', 'March', 'April', 'May', 'June', 'July']
    this.barChartSeries = ['Series A', 'Series B']
    this.barChartData = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ]
    this.barChartColours = [
      {
        fillColor: '#D2D6DE',
        strokeColor: '#D2D6DE',
        pointColor: 'rgba(148,159,177,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(148,159,177,0.8)'
      },
      {
        fillColor: '#00A65A',
        strokeColor: '#00A65A',
        pointColor: '#2980b9',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(77,83,96,1)'
      }
    ]

    this.pieLabels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales']
    this.pieData = [300, 500, 100]
  }
}

export const ChartsChartjsComponent = {
  templateUrl: './views/app/components/charts-chartjs/charts-chartjs.component.html',
  controller: ChartsChartjsController,
  controllerAs: 'vm',
  bindings: {}
}
