import { Hono } from 'hono'
import { authController } from './controller/auth-controller'
import { authorController } from './controller/author-controller'
import { bookController } from './controller/book-controller'
import { authenticationMiddleware } from './middleware/authentication'
import { errorHandler } from './error/error'
import { ApplicationVariables } from './model/app-model'

const app = new Hono<{Variables: ApplicationVariables}>()

app.route("/api", authController)
app.use(authenticationMiddleware)
app.route("/api", authorController)
app.route("/api", bookController)

app.onError(errorHandler)

export default app
