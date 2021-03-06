class SettingDisplayController {
  constructor ($rootScope, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$rootScope = $rootScope
    this.formSubmitted = false
    this.alerts = []
    this.DTOptionsBuilder = DTOptionsBuilder
    this.DTColumnBuilder = DTColumnBuilder
    this.$compile = $compile
    this.$scope = $scope

    let Datasources = this.API.service('datasources', this.API.all('users'))

    Datasources.getList()
      .then((response) => {
        this.datasources = response.plain()        
      })
  }

  changeDatasource (){
    let Dataprovider = this.API.service('dataprovider', this.API.all('users'))
    let DTColumnBuilder = this.DTColumnBuilder
    let DTOptionsBuilder = this.DTOptionsBuilder

    if (this.$rootScope.current_datasource == null) return

    Dataprovider.getList({
      'datasource': this.$rootScope.current_datasource
    }).then((response) => {
      this.dtColumns = []                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
      let dataSet = response.plain()

      if (dataSet.length == 0) return
      this.$rootScope.current_sql = dataSet[0]['sql']
      this.dataSet = dataSet[0]['providers']
      this.$rootScope.providers = this.dataSet

      this.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('data', this.dataSet)
        .withOption('createdRow', createdRow)
        .withOption('responsive', true)
        .withBootstrap()
      
      this.dtColumns.push(DTColumnBuilder.newColumn('column_id').withTitle('ID'))
      this.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml))

      this.displayTable = true
    })

    let createdRow = (row) => {
      this.$compile(angular.element(row).contents())(this.$scope)
    }

    let actionsHtml = (data) => {
      return `
          <button class="btn btn-xs btn-danger" ng-click="vm.delete('${data.column_id}')">
              <i class="fa fa-trash-o"></i>
          </button>`
    }
  }

  setDataprovider (isValid) {
    if (isValid) {
      let Dataprovider = this.API.service('dataprovider', this.API.all('users'))

      Dataprovider.post({
        'datasource': this.$rootScope.current_datasource,
        'sql': this.$rootScope.current_sql
      }).then((response) => {
        var dataSet = response.plain()
        dataSet = dataSet['data']

        if (dataSet.length == 0) return
        this.dtOptions.data = dataSet  
      })
    } else {
      this.formSubmitted = true
    }
  }
  delete (fieldId) {
    let API = this.API
    let dtOptions = this.dtOptions
    let dataSet = dtOptions.data

    // swal({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this data!',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#DD6B55',
    //   confirmButtonText: 'Yes, delete it!',
    //   closeOnConfirm: false,
    //   showLoaderOnConfirm: true,
    //   html: false
    // }, function () {
      for ( var index = 0; index < dataSet.length; index++){
        if (dataSet[index]['column_id'] == fieldId){
          dataSet.splice(index,1)
          API.one('users').one('dataprovider').remove({'datasource_id':'api', 'column_id':fieldId})
            .then(() => {
              
            })
        }
      }
      // swal({
      //   title: 'Deleted!',
      //   text: 'Selected field has been deleted.',
      //   type: 'success',
      //   confirmButtonText: 'OK',
      //   closeOnConfirm: true
      // }, function () {
      //   $state.reload()
      // })
    //})
  }

  $onInit () {
    this.changeDatasource()
  }
}

export const SettingDisplayComponent = {
  templateUrl: './views/app/components/setting-display/setting-display.component.html',
  controller: SettingDisplayController,
  controllerAs: 'vm',
  bindings: {}
}
