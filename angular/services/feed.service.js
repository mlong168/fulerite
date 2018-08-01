export class FeedService {
  constructor ($auth, $rootScope, API) {
    'ngInject'
    this.$auth = $auth
    this.API = API
    this.$rootScope = $rootScope
  }

  getData () {
    let $auth = this.$auth

    if ($auth.isAuthenticated()) {
      let API = this.API
      let Data = API.service('data', API.all('feeds'))

      return Data.one().get();
    } else {
      return null
    }
  }
}