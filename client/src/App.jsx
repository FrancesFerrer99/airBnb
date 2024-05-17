import { Route, Routes } from 'react-router-dom'
import IndexPage from './Pages/IndexPage'
import LoginPage from './Pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './Pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './Contexts/UserContext'
import AccountPage from './Pages/AccountPage'
import PlacesPage from './Pages/PlacesPage'
import PlacesFormPage from './Pages/PlacesFormPage'
import PlacePage from './Pages/PlacePage'
import BookingsPage from './Pages/BookingsPage'
import BookingPage from './Pages/BookingPage'

axios.defaults.baseURL = 'http://127.0.0.1:4000'
axios.defaults.withCredentials = true

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/account/bookings' element={<BookingsPage />} />
          <Route path='/bookings/:id' element={<BookingPage />} />
          <Route path='/account/places' element={<PlacesPage />} />
          <Route path='/account/places/new' element={<PlacesFormPage />} />
          <Route path='/account/places/:id' element={<PlacesFormPage />} />
          <Route path='/place/:id' element={<PlacePage/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}
export default App
