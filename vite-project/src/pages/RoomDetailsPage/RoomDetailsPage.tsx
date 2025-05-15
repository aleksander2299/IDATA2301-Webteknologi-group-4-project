import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import '../../styles/main.css';
import './RoomDetailsPage.css';

import ConfirmationBox from '../../components/ConfirmationBox/ConfirmationBox.tsx';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.tsx';
import { features } from 'process';
import { Console } from 'console';

import { parseURLDate} from "../../utils/navigationUtils.ts";
import roomImg from '../../Images/room image placeholder.jpg';
import { stringify } from 'querystring';




interface RoomDetails{
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    imageUrl: string;
}

interface Source{
   sourceId: number;
   sourceName:  string;
   locationType: string;
   city:  string;
   country: string;
}

interface RoomProvider {
    roomProviderId: number;
    roomPrice: number;
    provider: {
      providerId: number;
      providerName: string;
    };
  }

  interface ExtraFeatures{
    feature: string;
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
    const [Source, setSource] = useState<Source | null>(null);
    const [ExtraFeatures,setExtraFeatures] = useState<ExtraFeatures[]>([]);
    const [BookingDates, setBookingDates] = useState<[string, string ][]>([]);

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
            {/*console.log(response.data)*/}
          })
          .catch((err) => {
            console.error(err);
          });

          axios.get(`http://localhost:8080/api/rooms/${numericId}/source`)
          .then((response) => {
            setSource(response.data)
          })
          .catch((error) => {
            if (error.response) {
              console.error("Status:", error.response.status); 
              console.error("Data:", error.response.data); 
            } else {
              console.error("General Error:", error.message);
            }
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


    useEffect(() => {
        if(roomDetails === null){
            return
        }
        axios.get(`http://localhost:8080/api/rooms/2/dates`)
        .then((response) => {
            setBookingDates(response.data)
        })
        .catch((err) => {
          console.error(err)
        })
      
    },[roomDetails])

    useEffect (() =>{

        if(Source === null){
            return 
        }

        axios.get(`http://localhost:8080/api/source_extra_features/extra_features/sourceFeatures/${Source?.sourceId}`)
        .then((response) => {
         {/* console.log(JSON.stringify(response.data) + " here is source extra features");
          console.log(Source?.sourceId + "SOURCEID")
          console.log("SOURCEID SHOULD BEHERERER")
          console.log(JSON.stringify(response.data) + " stringify ") */}
          setExtraFeatures(response.data);
        })
        .catch((error) => {
          if (error.response) {
            {/*console.error("Status:", error.response.status); 
            console.error("Data:", error.response.data); 
            console.log(JSON.stringify(Source) +" SOURCE ID ?????????")*/}
          } else {
            {/*console.error("General Error:", error.message);*/}
          }
        });


    },[Source]);


    useEffect(() => {
        if(BookingDates.length === 0 )
        {
            return
        }
        /* TODO ADD THAT BOOKINGDATES ARRAY IS ADDED TO LIST OF DISABLED DATES */


    },[BookingDates])
    


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
                <h1 className="roomnametext">{roomDetails.roomName + " at " + Source?.sourceName +", " + Source?.country}</h1>
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
                        <div className="smallwhitetext">
                            Room type: {roomDetails.roomType}<br />
                            <p>Amenities :</p> 
                            <ul>
                                < li>{feature.feature}</li>))}
                                 {ExtraFeatures.map((feature) => (
                               </ul>
                        </div>
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