import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../Components/AddressLink";
import Gallery from "../Components/Gallery";
import BookingDates from "../Components/BookingDates";

export default function BookingPage() {
    const { id } = useParams()
    const [booking, setBooking] = useState(null)

    useEffect(() => {
        if (id)
            axios.get('/bookings').then(res => {
                const foundBooking = res.data.find(({ _id }) => _id === id)
                if (foundBooking)
                    setBooking(foundBooking)
            })
    }, [id])

    if (!booking) return ''

    return (
        <div className="">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <AddressLink className='my block'>{booking.place.address}</AddressLink>
            <div className="flex justify-between items-center bg-gray-200 py-6 my-6 rounded-2xl">
                <div className="">
                    <h2 className="text-2xl mb-4">Your booking information</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary hover:bg-hover p-6 text-white rounded-2xl">
                    <div className="">Total price</div>
                    <div className="text-3xl">${booking.price}</div>
                </div>
            </div>
            <Gallery place={booking.place} />
        </div>
    )
}