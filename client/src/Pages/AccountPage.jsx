import { useContext, useState } from "react"
import { UserContext } from "../Contexts/UserContext"
import { Navigate, useParams } from "react-router-dom"
import axios from "axios"
import LoginPage from "./LoginPage"
import PlacesPage from "./PlacesPage"
import AccountNav from "../Components/AccountNav"

export default function AccountPage() {
    const { user, ready, setUser } = useContext(UserContext)
    const [redirect, setRedirect] = useState(null)
    let { subpage } = useParams()

    if (subpage === undefined) subpage = 'profile'

    async function logout() {
        await axios.post('/logout')
        setUser(null)
        setRedirect('/')
    }

    if (redirect) return <Navigate to={redirect} />

    if (!ready) {
        return 'Loading...'
    }

    if (ready && !user && !redirect) {
        return <Navigate to={<LoginPage />} />
    }

    return (
        <div className="">
            <AccountNav />
            {
                subpage === 'profile' && (
                    <div className="text-center">
                        Logged in as {user.name} ({user.email})<br />
                        <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                    </div>
                )
            }
            {
                subpage === 'places' && (
                    <div className="">
                        <PlacesPage />
                    </div>
                )
            }
        </div>
    )
}