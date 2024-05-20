import { useEffect, useState } from 'react'
import Perks from '../Components/Perks'
import PhotosUploader from "../Components/PhotosUploader"
import axios from "axios"
import AccountNav from '../Components/AccountNav'
import { Navigate, useParams } from 'react-router-dom'

export default function PlacesFormPage() {
    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [photos, setPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [price, setPrice] = useState(100)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if (!id) { return }
        axios.get(`/places/${id}`).then(res => {
            const { data } = res
            setTitle(data.title)
            setAddress(data.address)
            setPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })
    }, [id])

    function inputHeader(title) {
        return (
            <h2 className="text-2xl mt-4">{title}</h2>
        )
    }

    function inputParagraph(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, paragraph) {
        return (
            <>
                {inputHeader(header)}
                {inputParagraph(paragraph)}
            </>
        )
    }

    async function savePlace(e) {
        e.preventDefault()
        const placeData = {
            title,
            address,
            photos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        }
        if (id) {
            await axios.put('/place', {
                id,
                ...placeData
            })
        }
        else {
            const rss = await axios.post('/place', placeData)
            console.log(rss)
        }
        setRedirect(true)
    }

    if (redirect) return <Navigate to='/account/places' />

    return (
        <div className="">
            <AccountNav />
            <form onSubmit={e => savePlace(e)}>
                {
                    preInput(
                        'Title', 'Title for your place. (Be concise and catchy)'
                    )
                }
                <input type="text" name="title" id="" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                {
                    preInput(
                        'Address', 'Address to this place'
                    )
                }
                <input type="text" name="address" id="" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                {
                    preInput(
                        'Description', 'Describe your place'
                    )
                }
                <textarea name="description" id="" cols="30" rows="10" value={description} onChange={e => setDescription(e.target.value)} />
                {
                    preInput(
                        'Extra perks', 'select all the perks of your place'
                    )
                }
                <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {
                    preInput(
                        'Photos', 'Show off your place'
                    )
                }
                <PhotosUploader photos={photos} onChange={setPhotos} />
                {
                    preInput(
                        'Extra info', 'Anything more to add?'
                    )
                }
                <textarea name="extraInfo" id="" cols="30" rows="10" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                {
                    preInput(
                        'Check In&Out', 'Check in/out times and maximum numerb of guests'
                    )
                }
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    <div className="">
                        <h3 className="mt-2 -mb-1 ">Check in time</h3>
                        <input type="text" name="checkIn" id="" placeholder="14:00" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                    </div>
                    <div className="">
                        <h3 className="mt-2 -mb-1 ">Check out time</h3>
                        <input type="text" name="checkOut" id="" placeholder="14:00" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>
                    <div className="">
                        <h3 className="mt-2 -mb-1 ">Max number of guests</h3>
                        <input type="number" name="maxGuests" id="" placeholder="4" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
                    </div>
                    <div className="">
                        <h3 className="mt-2 -mb-1 ">Price per night</h3>
                        <input type="number" name="price" id="" placeholder="100" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                </div>
                <button type="submit" className="primary my-4">
                    Save
                </button>
            </form>
        </div>
    )
}