class DatasourcesAddController {
  constructor (API, $state, $stateParams) {
    'ngInject'

    this.$state = $state
    this.formSubmitted = false
    this.API = API
    this.alerts = []

    if ($stateParams.alerts) {
      this.alerts.push($stateParams.alerts)
    }
  }

  save (isValid) {
    this.$state.go(this.$state.current, {}, { alerts: 'test' })
    if (isValid) {
      let Datasources = this.API.service('datasources', this.API.all('users'))
      let $state = this.$state

      Datasources.post({
        'driver': this.driver,
        'db_name': this.db_name,
        'alias': this.alias,
        'username': this.username,
        'password': this.password,
        'port': this.port
      }).then(function () {
        let alert = { type: 'success', 'title': 'Success!', msg: 'Datasource has been added.' }
        $state.go($state.current, { alerts: alert})
      }, function (response) {
        let alert = { type: 'error', 'title': 'Error!', msg: response.data.message }
        $state.go($state.current, { alerts: alert})
      })
    } else {
      this.formSubmitted = true
    }
  }

  $onInit () {}
}

export const DatasourcesAddComponent = {
  templateUrl: './views/app/components/datasources-add/datasources-add.component.html',
  controller: DatasourcesAddController,
  controllerAs: 'vm',
  bindings: {}
}
