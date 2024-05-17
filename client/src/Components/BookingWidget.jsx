import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns"
import axios from "axios"
import { Navigate } from "react-router-dom"
import { UserContext } from "../Contexts/UserContext"

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [redirect, setRedirect] = useState(false)
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (user)
            setName(user)
    }, user)

    let numberOfNights = 0
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) //returns number
    }

    async function handleBooking() {
        const data = {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            place: place._id,
            price: numberOfNights * place.price
        }
        const res = await axios.post('/booking', data)
        const bookingId = res.data._id
        setRedirect(`/account/bookings/${bookingId}`)
    }

    if (redirect) return <Navigate to={redirect} />

    return (
        <div className="">
            <div className="bg-white shadow p-4 rounded-2xl">
                <div className="text-2xl">
                    Price: ${place.price} / night
                </div>
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label htmlFor="">Check in:</label>
                        <input type="date" name="" id="" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-t">
                        <label htmlFor="">Check out:</label>
                        <input type="date" name="" id="" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-4 border-l">
                        <label htmlFor="">Number of guests</label>
                        <input type="number" name="" id="" value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)} />
                    </div>
                </div>
                {
                    numberOfNights > 0 && (
                        <>
                            <div className="py-3 px-4 border-4 border-l">
                                <label htmlFor="">Your full name</label>
                                <input type="text" placeholder="Your full name" name="" id="" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="py-3 px-4 border-4 border-l">
                                <label htmlFor="">Your phone number</label>
                                <input type="text" placeholder="Your phone number" name="" id="" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </>
                    )
                }
            </div>
            <button className="primary mt-4 cursor-pointer" onClick={handleBooking}>
                Book this place
                {
                    numberOfDays > 0 && (
                        <span>  ${numberOfNights * place.price}</span>
                    )
                }
            </button>
        </div>
    )
}