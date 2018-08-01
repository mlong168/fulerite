class DatasourcesEditController {
  constructor ($stateParams, $state, API) {
    'ngInject'

    this.$state = $state
    this.formSubmitted = false
    this.alerts = []

    if ($stateParams.alerts) {
      this.alerts.push($stateParams.alerts)
    }

    let datasourceId = $stateParams.datasourceId
    let Datasources = API.service('datasources-show', API.all('users'))
    Datasources.one(datasourceId).get()
      .then((response) => {
        this.datasource = API.copy(response);
      })
  }

  save (isValid) {
    if (isValid) {
      let $state = this.$state
      this.datasource.put()
        .then(() => {
          let alert = { type: 'success', 'title': 'Success!', msg: 'Role has been updated.' }
          $state.go($state.current, { alerts: alert})
        }, (response) => {
          let alert = { type: 'error', 'title': 'Error!', msg: response.data.message }
          $state.go($state.current, { alerts: alert})
        })
    } else {
      this.formSubmitted = true
    }
  }

  $onInit () {}
}

export const DatasourcesEditComponent = {
  templateUrl: './views/app/components/datasources-edit/datasources-edit.component.html',
  controller: DatasourcesEditController,
  controllerAs: 'vm',
  bindings: {}
}
