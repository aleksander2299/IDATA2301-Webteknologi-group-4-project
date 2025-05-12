import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios'

import '../../styles/main.css';
import './RoomDetailsPage.css';

import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
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

interface RoomProvider {
    roomProviderId: number;
    roomPrice: number;
    provider: {
      providerId: number;
      providerName: string;
    };
  }

  interface Booking {
    checkInDate: string; 
    checkOutDate: string; 
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
    
    // State to hold the dates selected by the picker
        const [checkInDate, setCheckInDate] = useState<Date | null>(null);
        const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

            // Function to receive dates from the CustomDatePicker component
        const handleDatesUpdate = (selected: { startDate: Date | null; endDate: Date | null }) => {
            console.log('HomePage received dates (for testing):', selected.startDate, selected.endDate);
            setCheckInDate(selected.startDate);
            setCheckOutDate(selected.endDate);
        };

    {/* Id is based on url so it needs to be tested since it can still be null or undefined */}
    const { id } = useParams<{ id: string }>();
    const numericId = id ? parseInt(id, 10) : null;
    const [searchParams] = useSearchParams();
    const token = localStorage.getItem('token');

    const [fromDate, setFromDate] = useState<string | null>(() => searchParams.get('from'));
    const [toDate, setToDate] = useState<string | null>(() => searchParams.get('to'));
    const [roomProviders,setProviders] = useState<RoomProvider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

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
        
        axios.get(`http://localhost:8080/api/rooms/${numericId}`)
          .then((response) => {
            setRoomDetails(response.data);
          })
          .catch((err) => {
            console.error(err);
          });
        



        axios.get(`http://localhost:8080/api/rooms/${numericId}/roomProviders`)
        .then((Response) => 
        {
           {/*log(JSON.stringify(Response.data, null, 2) + "here is roomproviders"); */} 
            setProviders(Response.data)
        
        }
        ).catch((error) => 
        {
            console.error(error.data + " HERE IS THE ERROR FOR NUMERICID")
        });




    }, [id, fromDate, toDate]);

    function changeProvider(e : React.ChangeEvent<HTMLSelectElement>){
        setSelectedProvider(parseInt(e.target.value))
        console.log(parseInt(e.target.value))
    }

    function bookRoom(){

        const booking: Booking = {
            checkInDate: fromDate ?? "",
            checkOutDate: toDate ?? "", 
        };


        axios.post(`http://localhost:8080/api/booking/withIds/${selectedProvider}/${localStorage.getItem('username')}`,booking,
        {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        })
        .then((Response) => 
            {
                console.log(localStorage.getItem("token"))
             
    
           
        }
    ).catch((error) => 
    {
        console.error(error.data)
        console.log(token + " TOKEN HERE ")
    });
            
    }
    


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
                    {/* Place the date picker component here */}
                         <div style={{ display: 'flex', alignItems: 'center' }}> {/* Optional wrapper for layout */}
                               <CustomDatePicker
                                   onDatesSelected={handleDatesUpdate} // Pass the handler function
                                   initialStartDate={checkInDate}      // Pass the current state
                                   initialEndDate={checkOutDate}        // Pass the current state
                               />
                         </div>
                    <select value={selectedProvider ?? ""} onChange={changeProvider}>
                
                    <option value="" disabled>
                        Choose your provider here
                    </option>
                    {roomProviders.length > 0 ?
                    roomProviders.map((rp) => (
                    <option key={rp.roomProviderId} value={rp.roomProviderId}>
                    {rp.provider.providerName} - ${rp.roomPrice}
                     </option>
                    )) :
                    (
                        <option value="">no room providers</option>
                    )    
                }
                </select>
                <button onClick={bookRoom}>Book room</button>
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