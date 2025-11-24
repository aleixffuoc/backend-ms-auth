import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import Routes from './routes'

const app = express()

app.disable('x-powered-by')

app.use(json())
app.use(urlencoded({ extended: true }))

// Security middleware
app.use(helmet())
app.use(hpp())
app.use(cookieParser())
app.use(cors())

// Dev Middlewares
app.use(morgan('dev'))

//Routes
app.use(Routes)

//Port
const PORT = 9001

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`)
})

export default app
