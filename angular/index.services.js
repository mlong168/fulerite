import { ContextService } from './services/context.service'
import { APIService } from './services/API.service'
import { FeedService } from './services/feed.service'

angular.module('app.services')
  .service('ContextService', ContextService)
  .service('API', APIService)
  .service('FeedService', FeedService)
