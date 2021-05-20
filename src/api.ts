import express, { Router, Application } from 'express'

export default class Api {
    public router: Router

    constructor(app: Application) {
        this.router = Router()
        app.use('/api', this.router)
        this.router.use(express.json())

        this.boot()
    }

    public async boot() {
        this.router.get('/example-route', await this.apiMethod('ExampleController.index'))
    }

    /**
     * @param slug Api Method slug with format: [CONTROLLER_NAME].[METHOD_NAME]
     * @returns The requested method
     */
    public async apiMethod(slug:string):Promise<any> {
        const split = slug.split('.')
        const controllerName = split[0]
        const methodName = split[1]

        const controllerImport = await import(`./http/controllers/${controllerName}.js`)
        const Controller = new controllerImport['default']()
        
        return Controller[methodName]
    }
}
