import { Hono } from 'hono'
import { userController } from './controller/user-controller'
import { authorController } from './controller/author-controller'
import { bookController } from './controller/book-controller'
import { authenticationMiddleware } from './middleware/authentication'
import { errorHandler } from './error/error'

const app = new Hono()

app.route("/api", userController)
app.use(authenticationMiddleware)
app.route("/api", authorController)
app.route("/api", bookController)

app.onError(errorHandler)

export default app
