import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios'

import '../../styles/main.css';
import './RoomDetailsPage.css';

import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.tsx';

import roomImg from '../../Images/room image placeholder.jpg';

{/* Interface with all datatypes to be taken from database */}
interface RoomDetailsDummy {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  roomType: string;
  bedType: string;
  roomCapacity: string;
  checkIn: string;
  checkOut: string;
  internet: string;
  parking: string;
  gym: string;
  pets: string;
}


interface RoomDetails{
    id: string;
    name: string;
    description: string;
    roomType: string;
    imageUrl: string;
    
}

{/* Fake temporary data */}
const ALL_HOTEL_DETAILS: Record<string, RoomDetailsDummy> = {
    '1': { id: '1', name: 'Hotel 1 - Grand View', location: 'Location 1', description: 'This Room has a nice view and premium amenities.',
        imageUrl: '/images/hotel-room-1.jpg', roomType: 'Suite', bedType: 'King', roomCapacity: '2',
        checkIn: '3:00 PM', checkOut: '11:00 AM', internet: 'Included', parking: 'Available', gym: 'Available', pets: 'No' },
    '2': { id: '2', name: 'Hotel 2 - Ocean Breeze', location: 'Location 2', description: 'This Room has a nice oceanside view and relaxing atmosphere.',
        imageUrl: '/images/hotel-room-2.jpg', roomType: 'Double', bedType: 'Queen', roomCapacity:'3', checkIn: '2:00 PM', checkOut: '12:00 PM',
        internet: 'Included', parking: 'Available', gym: 'Not Available', pets: 'Yes' },
};

function RoomDetailsPage () {

    {/* Id is based on url so it needs to be tested since it can still be null or undefined */}
    const { id } = useParams<{ id: string }>();
    const numericId = id ? parseInt(id, 10) : null;
    const [searchParams] = useSearchParams();

    const [fromDate, setFromDate] = useState<string | null>(() => searchParams.get('from'));
    const [toDate, setToDate] = useState<string | null>(() => searchParams.get('to'));

    const [isLoading, setIsLoading] = useState<boolean>(true);
    {/* roomDetails and error can both be an object or null since they start out as null and then can get objects */}
    const [error, setError] = useState<string | null>(null);
    const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

    {/* Never have any early returns before useEffect */}
    useEffect(() => {
        console.log(`Fetching Details for hotel id: ${id}`);
        setIsLoading(true); // Start loading
        setError(null);     // Clear previous errors

        {/* Ensure id exists and is not null */}
        if (!id) {
            setError("No Hotel ID provided in the URL.");
            setIsLoading(false);
            {/* Exit Early */}
            return;
        }
        
        axios.get(`http://localhost:8080/api/rooms/${numericId}`).then((Response) => 
        {
            setRoomDetails(Response.data);
            console.log(Response.data + 'hahahahahahahaha')
            console.log({numericId})

        })
        .catch((err) => {
       
            console.error(err.data)
      
        });




    }, [id, fromDate, toDate]);


    if (!roomDetails) {
        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>; // Show error if any
        return <div>Room details not available.</div>;
    }

    if (!roomDetails) {
            return <div>Room details not available.</div>;
    }


    return (
        <div>
            <Header />
            <div className="content-container">
                <h1 className="roomnametext">{roomDetails.name}</h1>
            </div>
            <section className="content-container">
                <div className="image">
                    <img src={roomDetails.imageUrl} alt="RoomDetailsPlaceholderImg"/>
                </div>
                <section className="bookingbox">
                    <div className="bookingboxtext">How long will you stay?</div>
                    <button className="button1">{fromDate || 'N/A'}</button>
                    <button className="button2">{toDate || 'N/A'}</button>
                    <button className="button3">BOOK NOW!</button>
                </section>
            </section>
            <section className="content-container">
                <div className="detailsbox">
                    <div className="description">
                        <h2 className="bigwhitetext">Description</h2>
                        <p className="smallwhitetext">
                            {roomDetails.description}
                        </p>
                    </div>
                    <div className="site-specification">
                        <h2 className="bigwhitetext">Room Specifications</h2>
                        <p className="smallwhitetext">
                            Room type: {roomDetails.roomType}<br />
                          
                           {/* 
                            Check-in: {roomDetails.checkIn}<br />
                            Check-out: {roomDetails.checkOut}<br />
                            Bed type: {roomDetails.bedType}<br />
                            Room capacity: {roomDetails.roomCapacity}<br />
                            Internet: {roomDetails.internet}<br />
                            Parking: {roomDetails.parking}<br />
                            Gym: {roomDetails.gym}<br />
                            Pet Friendly: {roomDetails.pets}<br />*/}
                        </p>
                    </div>
                </div>
            </section><Footer />
        </div>
    );

}


export default RoomDetailsPage;