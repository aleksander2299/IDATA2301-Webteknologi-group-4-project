import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import '../../styles/main.css';
import './RoomDetailsPage.css';

import Footer from '../../components/layout/Footer.jsx';

import roomImg from '../../Images/room image placeholder.jpg';

interface RoomDetails {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  roomType: string;
  bedType: string;
  checkIn: string;
  checkOut: string;
  internet: string;
  parking: string;
  gym: string;
  pets: string;
}

{/* Fake temporary data */}
const ALL_HOTEL_DETAILS: Record<string, RoomDetails> = {
    '1': { id: '1', name: 'Hotel 1 - Grand View', location: 'Location 1', description: 'This hotel has a nice view and premium amenities.',
        imageUrl: '/images/hotel-room-1.jpg', roomType: 'Suite', bedType: 'King',
        checkIn: '3:00 PM', checkOut: '11:00 AM', internet: 'Included', parking: 'Available', gym: 'Available', pets: 'No' },
    '2': { id: '2', name: 'Hotel 2 - Ocean Breeze', location: 'Location 2', description: 'This hotel has a nice oceanside view and relaxing atmosphere.',
        imageUrl: '/images/hotel-room-2.jpg', roomType: 'Double', bedType: 'Queen', checkIn: '2:00 PM', checkOut: '12:00 PM',
        internet: 'Included', parking: 'Available', gym: 'Not Available', pets: 'Yes' },
};

function RoomDetailsPage () {

    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const dateFrom = searchParams.get('from');
    const dateTo = searchParams.get('to');


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Fetching Details for hotel id: ${id}');
        setIsLoading(true);
        setError(null);
    }, [id,dateFrom,dateTo]);

    return (
        <div>
            <header>
                <div className="home"><b>Stay Finder</b></div>
            </header>
            <div className="content-container">
                <h1 className="roomnametext">Thon Hotel Ålesund, City Centre. Ålesund, Norway.</h1>
            </div>
            <section className="content-container">
                <div className="image">
                    <img src={roomImg} alt="RoomDetailsPlaceholderImg"/>
                </div>
                <section className="bookingbox">
                    <div className="bookingboxtext">How long will you stay?</div>
                    <button className="button1">Start Date</button>
                    <button className="button2">End Date</button>
                    <button className="button3">BOOK NOW!</button>
                </section>
            </section>
            <section className="content-container">
                <div className="detailsbox">
                    <div className="description">
                        <h2 className="bigwhitetext">Description</h2>
                        <p className="smallwhitetext">
                            Lovely hotel suite in the heart of Ålesund! You and your partner get one of the best views the city has to offer overlooking the bay,
                            a king-sized bed with maximum comfortability and wonderful room service!

                        </p>
                    </div>
                    <div className="site-specification">
                        <h2 className="bigwhitetext">Room Specifications</h2>
                        <p className="smallwhitetext">
                            Room type: Suite<br />
                            Bed type: Double<br />
                            Room capacity: 2<br />
                            Check-in: 3:00 PM<br />
                            Check-out: 11:00 AM<br />
                            Internet: Included<br />
                            Parking: Available<br />
                            Gym: Available<br />
                            Pet Friendly: Yes<br />
                        </p>
                    </div>
                </div>
            </section><Footer />
        </div>
    );

}

export default RoomDetailsPage;