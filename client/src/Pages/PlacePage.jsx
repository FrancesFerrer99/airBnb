import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BookingWidget from "../Components/BookingWidget"
import Gallery from "../Components/Gallery"
import AddressLink from "../Components/AddressLink"

export default function PlacePage() {
    const { id } = useParams()
    const [place, setPlace] = useState(null)

    useEffect(() => {
        if (!id) return
        axios.get(`/places/${id}`).then(res => {
            setPlace(res.data)
        })
    }, [id])

    if (!place) return ('')

    return (
        <div className="bg-gray-100 -mx-8 px-8 pt-8 mt-4">
            <h1 className="text-2xl " >{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <Gallery place={place} />
            <div className="mb-8 mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div className="">
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}<br />
                    Check-out: {place.checkOut}<br />
                    Max number of guests: {place.maxGueests}<br />
                </div>
                <div className="">
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div className="">
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="text-gray-700 text-sm leading-5  mb-4 mt-2">
                    {place.extraInfo}
                </div>
            </div>
        </div>
    )
}