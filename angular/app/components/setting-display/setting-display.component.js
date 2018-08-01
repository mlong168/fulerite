class SettingDisplayController {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API, $rootScope) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.selected_columns = []
    this.selected_allcolumns = []
    $rootScope.$display_columns = []
    this.$rootScope = $rootScope

    let Datasources = this.API.service('datasources', this.API.all('users'))

    Datasources.getList()
      .then((response) => {
        this.datasources = response.plain()        
      })
  }

  updateDataSource() {
    let AllColumns = this.API.service('columns', this.API.all('feeds'))

    AllColumns.getList()
      .then((response) => {
        this.allColumns = response.plain()
      })

  }

  addColumns() {
    for (var index = 0; index < this.selected_allcolumns.length; index++){
      if (this.$rootScope.$display_columns.indexOf(this.selected_allcolumns[index]) == -1){
        this.$rootScope.$display_columns.push(this.selected_allcolumns[index])
      }
    }
  }

  removeColumns() {
    for (var index = 0; index < this.selected_columns.length; index++){
      this.$rootScope.$display_columns.pop(this.selected_allcolumns[index])
    }
  }

  $onInit () {}
}


export const SettingDisplayComponent = {
  templateUrl: './views/app/components/setting-display/setting-display.component.html',
  controller: SettingDisplayController,
  controllerAs: 'vm',
  bindings: {}
}
