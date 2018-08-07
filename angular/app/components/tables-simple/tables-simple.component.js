class TablesSimpleController {
  constructor ($rootScope, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API, $stateParams) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.$rootScope = $rootScope
    this.formSubmitted = false
    this.alerts = []
    this.DTOptionsBuilder = DTOptionsBuilder
    this.DTColumnBuilder = DTColumnBuilder

  }

  updateDatasource (isValid) {
    this.$state.go(this.$state.current, {}, { alerts: 'test' })
    if (isValid) {
      let Datafeed = this.API.service('datafeed', this.API.all('users'))
      let $state = this.$state
      let DTColumnBuilder = this.DTColumnBuilder
      let DTOptionsBuilder = this.DTOptionsBuilder

      Datafeed.post({
        'datasource': 'api',
        'sql': 'select * from trxfeed_history limit 10;'//this.sql
      }).then((response) => {
        this.dtColumns = []
        let dataSet = response.plain()
        dataSet = dataSet['data']['response']

        if (dataSet.length == 0) return

        this.dtOptions = DTOptionsBuilder.newOptions()
          .withOption('data', dataSet)
          .withOption('responsive', true)
          .withBootstrap()
        
        var keys = Object.keys(dataSet[0])
        
        for (var index = 0;index < this.$rootScope.$display_columns.length; index++){
	
          this.dtColumns.push(this.DTColumnBuilder.newColumn(this.$rootScope.$display_columns[index]).withTitle(this.$rootScope.$display_columns[index]))
        }

        this.displayTable = true
      })
    } else {
      this.formSubmitted = true
    }
  }
  delete (datasourceId) {
    let API = this.API
    let $state = this.$state

    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: false
    }, function () {
      API.one('users').one('datasources', datasourceId).remove()
        .then(() => {
          swal({
            title: 'Deleted!',
            text: 'Datasource has been deleted.',
            type: 'success',
            confirmButtonText: 'OK',
            closeOnConfirm: true
          }, function () {
            $state.reload()
          })
        })
    })
  }


  $onInit () {}
}

export const TablesSimpleComponent = {
  templateUrl: './views/app/components/tables-simple/tables-simple.component.html',
  controller: TablesSimpleController,
  controllerAs: 'vm',
  bindings: {}
}
