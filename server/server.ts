import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { mergePatchBodyParcer } from './merge-patch.parser'
import { environment } from '../common/environment';
import { Router } from '../common/router';
import { handleError } from './error.handler';


export class Server {

  application: restify.Server

  initilizeDb(): mongoose.MongooseThenable{
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(environment.db.url, {
      useMongoClient: true
    }) 
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {

        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParcer)

        //routes

        for (let router of routers) {
          router.applyRoutes(this.application)
        }
      

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.on('restifyError', handleError)

      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initilizeDb().then(()=>
      this.initRoutes(routers).then(() => this))
  }
}