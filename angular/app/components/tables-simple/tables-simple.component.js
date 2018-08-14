class TablesSimpleController {
  constructor ($rootScope, $window, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.$rootScope = $rootScope
    this.formSubmitted = false
    this.alerts = []
    //this.DTOptionsBuilder = DTOptionsBuilder
    //this.DTColumnBuilder = DTColumnBuilder
    this.$compile = $compile
    this.$scope = $scope

    this.dtColumns = []

    if (this.$rootScope.providers == null || this.$rootScope.current_datasource == null) return

    for (var index = 0; index < this.$rootScope.providers.length; index++){
       this.dtColumns.push(DTColumnBuilder.newColumn(this.$rootScope.providers[index]['column_id']).withTitle(this.$rootScope.providers[index]['title']))
    }

    this.$rootScope.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('ajax', {
        dataSrc: function(data){
            return data.data
        },
        url: "/api/users/datafeed?datasource=" + this.$rootScope.current_datasource,
        data: function (d) {
            //d.datasource = 'api'//this.$rootScope.current_datasource
        },
        type:"POST",
        beforeSend: function(xhr){
          xhr.setRequestHeader("Authorization", 
            'Bearer ' + $window.localStorage.satellizer_token)
        }
      })
      .withOption('processing', true) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10) // Page size
      .withPaginationType('simple_numbers')
      .withOption('responsive', true)
      .withOption('aaSorting',[0,'asc']) // for default sorting column // here 0 means first column

    this.displayTable = true

  }

  $onInit () {}

}

export const TablesSimpleComponent = {
  templateUrl: './views/app/components/tables-simple/tables-simple.component.html',
  controller: TablesSimpleController,
  controllerAs: 'vm',
  bindings: {}
}
