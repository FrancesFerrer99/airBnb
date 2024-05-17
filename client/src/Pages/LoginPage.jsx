import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { setUser } = useContext(UserContext)

    async function handleLoginSubmit(e) {
        e.preventDefault()
        try {
            const rss = await axios.post('/login', { email, password })
            setUser(rss.data)
            setRedirect(true)
        } catch (e) {
            alert(e.message)
        }
    }

    if (redirect) {
        return <Navigate to='/' replace={true} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="your@mail.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input type="password" placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="primary hover:bg-hover">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? <Link to='/register' className="underline text-black">Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}