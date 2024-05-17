import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function IndexPage() {
  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios.get('/places').then(res => {
      setPlaces(res)
    })
  }, [])

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {
        places.length > 0 && places.map(place => {
          <Link to={'/place/'+place._id}>
            <div className="bg-gray-500 mb-2 rouded-2xl flex">
              {
                place.photos?.[0] && <img className="aspect-square object-cover rouded-2xl" src={'http://localhost:4000/uploads/' + place.photos?.[0]} alt="" />
              }
            </div>
            <h2 className="font-bold leading-4" >{place.address}</h2>
            <h3 className="text-sm truncate leading-3">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        })
      }
    </div>
  )
}