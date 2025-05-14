import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import '../../styles/main.css';
import './RoomDetailsPage.css';

import ConfirmationBox from '../../components/ConfirmationBox/ConfirmationBox.tsx';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.tsx';


    // Being reused for now however is the same between pages that need it
    function formatDateForURL(date: Date | null): string | null {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function parseURLDate(dateString: string | null): Date | null {
        // Copied from internet, just tests if the URL date is an actual date following ISO standards
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;
        const date = new Date(dateString);
        // getTime returns NaN if the time is invalid
        if (isNaN(date.getTime())) return null;
        return date;
    }

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
    roomName: string;
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

    // State to set visibility of confirmation box
    const [showConfirmation, setShowConfirmation] = useState(false);

    {/* Id is based on url so it needs to be tested since it can still be null or undefined */}
    const { id } = useParams<{ id: string }>();
    const numericId = id ? parseInt(id, 10) : null;
    // Needs to be decoupled
    const [searchParams , setSearchParams] = useSearchParams();
    const token = localStorage.getItem('token');

    const [fromDate, setFromDate] = useState<string | null>(() => parseURLDate(searchParams.get('from')));
    const [toDate, setToDate] = useState<string | null>(() => parseURLDate(searchParams.get('to')));
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

        const fromParam = parseURLDate(searchParams.get('from'));
        const toParam = parseURLDate(searchParams.get('to'));

        // Set initial values to datepicker
        setCheckInDate(fromParam);
        setCheckOutDate(toParam);

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
            console.log(response.data)
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




    }, [ searchParams ]);

// Used to update DatePicker on this page based on searchParams
    const handleDatesUpdate = (selected: { startDate: Date | null; endDate: Date | null }) => {
            setCheckInDate(selected.startDate);
            setCheckOutDate(selected.endDate);

            const currentParams = new URLSearchParams(searchParams.toString());
            const formattedStart = formatDateForURL(selected.startDate);
            const formattedEnd = formatDateForURL(selected.endDate);

            if (formattedStart) {
                currentParams.set('from', formattedStart);
            } else {
                currentParams.delete('from');
            }
            if (formattedEnd) {
                currentParams.set('to', formattedEnd);
            } else {
                currentParams.delete('to');
            }
            // Update URL. The useEffect will then react to this change.
            setSearchParams(currentParams, { replace: true }); // Using replace to avoid too many history entries
        };

    function changeProvider(e : React.ChangeEvent<HTMLSelectElement>){
        setSelectedProvider(parseInt(e.target.value))
        console.log(parseInt(e.target.value))
    }

    function bookRoom(){

        const booking: Booking = {
            checkInDate: checkInDate ? checkInDate.toISOString() : "",  
            checkOutDate: checkOutDate ? checkOutDate.toISOString() : "",
        };

    


        axios.post(`http://localhost:8080/api/booking/withIds/${selectedProvider}/${localStorage.getItem('username')}`,booking,
        {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        })
        .then((Response) => 
            {

                console.log(JSON.stringify(Response.data)) 
        }
    ).catch((error) => {
        if (error.response) {
          console.error("Status:", error.response.status); 
          console.error("Data:", error.response.data); 
        } else {
          console.error("General Error:", error.message);
        }
      });
            
    }

    function handleBookingConfirmed() {
        setShowConfirmation(false); // Closes the confirmation box
        bookRoom();                 // runs bookRoom function
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
                <h1 className="roomnametext">{roomDetails.roomName}</h1>
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
                
                <button onClick={() => setShowConfirmation(true)}>Book room</button>
                {/* <button onClick={bookRoom}>Book room</button> */} 
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
            </section>
            {showConfirmation && (
                <ConfirmationBox
                    onConfirm={handleBookingConfirmed}
                    onCancel={() => setShowConfirmation(false)}
                />
)}
            <Footer />
        </div>
    );

}



export default RoomDetailsPage;