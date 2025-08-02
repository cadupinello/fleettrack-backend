import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './modules/auth/auth.route'
import driverRoutes from './modules/drivers/driver.route'

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'OK' })
})

app.use('/api/auth', authRoutes)
app.use('/api/drivers', driverRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
