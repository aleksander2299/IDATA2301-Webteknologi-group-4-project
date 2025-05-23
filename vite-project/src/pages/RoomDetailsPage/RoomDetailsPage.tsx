import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import '../../styles/main.css';
import roomDetailPageStyle from './RoomDetailsPage.module.css';

import ConfirmationBox from '../../components/ConfirmationBox/ConfirmationBox.tsx';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker.tsx';
import FavouriteButton from '../../components/FavouriteButton/FavouriteButton.tsx';
import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.tsx';

import { Room } from '../../types/Room.ts';

import { formatDateForURL, parseURLDate } from "../../utils/navigationUtils.ts";

import { axiosInstance } from '../../AxiosInstance.js';

 /**
  *  interface or room details. 
  */ 
interface RoomDetails{
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    imageUrl: string;
}

 /**
  *  interface of source data
  */ 
interface Source{
    sourceId: number;
    sourceName:  string;
    locationType: string;
    city:  string;
    country: string;
}

 /**
  *  interface of provider data
  */ 
interface Provider{
    providerId: number;
    providerName: string;
}


 /**
  *  interface of room provider data 
  */ 
interface RoomProvider {
    roomProviderId: number;
    roomPrice: number;
    provider: Provider
}

 /**
  *  interface of extra features. 
  */ 
interface ExtraFeatures{
    feature: string;
}

 /**
  *  interface of booking data 
  */ 
interface Booking {
    checkInDate: string;
    checkOutDate: string;
}


 /**
  *  interface of exluded date interval
  */ 
interface ExcludedDateInterval {
    start: Date;
    end: Date;
}

 /**
  *  checks if intervals of dates are overlapping, so that you cannot book on a date that is booked. 
  */ 
function intervalsOverlap(s1: Date | null, e1: Date | null, s2: Date, e2: Date): boolean {
    if (!s1 || !e1) { // If user selection is incomplete, no overlap for this specific check
        return false;
    }

    const start1Time = s1.getTime();
    const end1Time = e1.getTime();
    const start2Time = s2.getTime();
    const end2Time = e2.getTime();

    // Used Ai to help with this return to check if overlap exists
    return Math.max(start1Time, start2Time) <= Math.min(end1Time, end2Time);
}

/**
 * checks if a date is within disabled intervals, so dates that are booked. 
 */
function isDateWithinAnyDisabledInterval(date: Date | null, disabledIntervals: ExcludedDateInterval[]): boolean {
    if (!date || disabledIntervals.length === 0) {
        return false;
    }
    const dateTime = date.getTime();
    for (const interval of disabledIntervals) {
        const startIntervalTime = interval.start.getTime();
        const endIntervalTime = interval.end.getTime();
        if (dateTime >= startIntervalTime && dateTime <= endIntervalTime) {
            return true;
        }
    }
    return false;
}

 /**
  *  creates roomdetails page from data via functions. 
  */ 
function RoomDetailsPage () {

    // gets room for favorite button
    const [room, setRoom] = useState<Room >();

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
    const [roomPrice, setRoomPrice] = useState<number>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    {/* roomDetails and error can both be an object or null since they start out as null and then can get objects */}
    const [error, setError] = useState<string | null>(null);
    const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

    // Need to use rawBookingDates since its coming straight from backend
    const [rawBookingDates, setRawBookingDates] = useState<[string, string][]>([]);
    const [disabledDateIntervals, setDisabledDateIntervals] = useState<ExcludedDateInterval[]>([]);

    // Gets the role of the account logged in
    const role = localStorage.getItem("role");

    // gets room for favorite button
    useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;

    /**
    * sets the room to a room id. 
    */ 
    async function fetchRoom(roomID: number, token: string) {
        const response = await axiosInstance.get(`/rooms/${roomID}`, {
            headers: { Authorization: `Bearer ${token}` },
            });
        setRoom(response.data);
        }
        fetchRoom(id, token);
    }, [id])

    /**
    *  fetches room, source, roomprovider and dates for a room.
    */ 
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
            
        axiosInstance.get(`/rooms/${numericId}`)
        .then((response) => {
            setRoomDetails(response.data);
            {/*console.log(response.data)*/}
        }) .catch((err) => {
            console.error(err);
        });

        axiosInstance.get(`/rooms/${numericId}/source`)
        .then((response) => {
            setSource(response.data)
        }) .catch((error) => {
            if (error.response) {
                console.error("Status:", error.response.status); 
                console.error("Data:", error.response.data); 
            } else { console.error("General Error:", error.message); }
            });

        axiosInstance.get<RoomProvider[]>(`/rooms/${numericId}/roomProviders`)
            .then((response) => { 
                 console.log("Response from /roomProviders:", response.data);
                 console.log("Type of response:", typeof response.data);
                    console.log("Is array?", Array.isArray(response.data));
                setProviders(response.data);
            }) .catch((error) => { console.error("Failed to fetch room providers:", error); });


        Promise.all([
        axiosInstance.get<[string, string][]>(`/rooms/${numericId}/dates`)
        ]).then(([occupiedDatesRes]) => {
            setRawBookingDates(occupiedDatesRes.data);
        }).catch((err) => {
            setError(err.response?.data?.message || err.message || "Failed to fetch room data.");
            console.error("Error fetching room data:", err);
        }).finally(() => {
            setIsLoading(false);
        });

    }, [ id, numericId, searchParams ]);

     /**
     *  creates the structure of the page.
    */ 
    useEffect(() => {
        const newDisabledIntervals: ExcludedDateInterval[] = [];

        if (rawBookingDates && rawBookingDates.length > 0) {
            for (const range of rawBookingDates) {
                const startDateString = range[0];
                const endDateString = range[1];

                const startDate = parseURLDate(startDateString);
                const endDate = parseURLDate(endDateString);

                if (startDate && endDate) {
                    newDisabledIntervals.push({ start: startDate, end: endDate });
                } else {
                    console.warn("Invalid start date:", startDate);
                }
            }
            setDisabledDateIntervals(newDisabledIntervals);
        } else {
            setDisabledDateIntervals([]); // Clear if no booking dates
        }
    }, [rawBookingDates]);

    // Used to update DatePicker on this page based on searchParams.
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

    /**
    * sets the selected provider that you will book with to the one in the drop down menu.
    */ 
    function changeProvider(e : React.ChangeEvent<HTMLSelectElement>){
        setSelectedProvider(parseInt(e.target.value))
        console.log(parseInt(e.target.value))
    }

    /**
    *  function that books a room based on checkin and checkout date. has to be a normal user. 
    */ 
    function bookRoom(){

        const booking: Booking = {
            checkInDate: checkInDate ? checkInDate.toISOString() : "",
            checkOutDate: checkOutDate ? checkOutDate.toISOString() : "",
        };

        axiosInstance.post(`/booking/withIds/${selectedProvider}/${localStorage.getItem('username')}`,booking,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((Response) => 
            {
                alert("Booking confirmed.");
                console.log(JSON.stringify(Response.data)) 
        }
    ).catch((error) => {
        if (error.response) {
            alert("ERROR: date or provider not selected.");
            console.error("Status:", error.response.status); 
            console.error("Data:", error.response.data); 
        } else {
            console.error("General Error:", error.message);
        }
    });
            
    }

    /**
    *  function that handles booking confirmation, so it closes the confirmation books and calls book room.
    */ 
    function handleBookingConfirmed() {
        setShowConfirmation(false); // Closes the confirmation box
        bookRoom();                 // runs bookRoom function
    }


    /**
    *  function that lists out a room as a provider, so logged in as provider you can list out a room 
    *  with a price.  
    */ 
    async function listRoomAsProvider(price : number){
        const username = localStorage.getItem("username");
        let currentProvider : Provider
        const response = await axiosInstance.get(`/providers/byName/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        currentProvider = response.data
        
        if(currentProvider !== null){
            console.log(JSON.stringify(currentProvider))

            if (!room?.roomId) return alert("Room not loaded yet");
            axiosInstance.post(`/roomProvider/link/${room?.roomId}/${currentProvider.providerId}/${price}`, null,
                {
                    headers: {
                    Authorization: `Bearer ${token}`
                }
        }).then((response) => {
            alert("Room successfully linked");
            console.log(JSON.stringify(response.data) + " LINK RESPONSE");

        }
        ).catch((err) => {
            alert("Could not link/already linked room. Please check your provider page for further information.")
            console.error(err.data + " error here for linking");

        }
        )
    }
}
    /**
    *  adds the extra features for the room into the room specifications.
    */ 
    useEffect (() =>{

        if(Source === null){
            return
        }

        axiosInstance.get(`/source_extra_features/extra_features/sourceFeatures/${Source?.sourceId}`)
        .then((response) => {
        {/* console.log(JSON.stringify(response.data) + " here is source extra features");
        console.log(Source?.sourceId + "SOURCEID")
        console.log("SOURCEID SHOULD BEHERERER")
          console.log(JSON.stringify(response.data) + " stringify ") */}
           console.log("/extra_features/sourceFeatures/:", response.data);
            console.log("Type of response:", typeof response.data);
            console.log("Is array?", Array.isArray(response.data));
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


    /**
     * Uses updated parseUrlDate to make sure the dates are at local midnight so all dates are properly disabled
     */
    useEffect(() => {
        const newDisabledIntervals: ExcludedDateInterval[] = [];

        if (rawBookingDates && rawBookingDates.length > 0) {
            for (const range of rawBookingDates) {
                const startDateString = range[0];
                const endDateString = range[1];

                const startDate = parseURLDate(startDateString);
                const endDate = parseURLDate(endDateString);

                if (startDate && endDate) {
                    newDisabledIntervals.push({ start: startDate, end: endDate });
                } else {
                    console.warn("Invalid date string in rawBookingDates, not adding to disabled intervals:", range);
                }
            }
            setDisabledDateIntervals(newDisabledIntervals);
        } else {
            setDisabledDateIntervals([]); // Clear if no booking dates
        }
    }, [rawBookingDates]);

    /**
     * Checks if there is a disabled date between the interval transfered by the search and then checks if the checkindate was invalid
     * Would have done checkout as well however the ReactDatePicker can only start with a date how we have it set up.
     * Fixing the Checkintest took a lot of help from AI.
     */
    useEffect(() => {

        if (checkInDate && disabledDateIntervals.length > 0 && !isLoading) {

            let isInvalidSelection = false;

            const effectiveCheckOutDate = checkOutDate || checkInDate;

            for (const disabledRange of disabledDateIntervals) {
                if (intervalsOverlap(checkInDate, effectiveCheckOutDate, disabledRange.start, disabledRange.end)) {
                    isInvalidSelection = true;
                    break;
                }
            }

            if (isInvalidSelection) {
                if (isDateWithinAnyDisabledInterval(checkInDate, disabledDateIntervals)) {
                    console.warn("Initial dates from URL conflict with booked dates. Clearing selection.");
                    setError("The dates from your previous search are unavailable. Please choose new dates.");
                    setCheckInDate(null);
                    setCheckOutDate(null);

                    const currentParams = new URLSearchParams(searchParams.toString());
                    currentParams.delete('from');
                    currentParams.delete('to');
                    setSearchParams(currentParams, {replace: true});
                } else {
                    console.warn("Initial date range from URL is invalid, but check-in date is valid. Clearing check-out date.");
                    setError("The selected date range is unavailable, but the check-in date is okay. Please choose a new check-out date.");
                    setCheckOutDate(null);
                    const currentParams = new URLSearchParams(searchParams.toString());
                    currentParams.delete('to');
                    setSearchParams(currentParams, { replace: true });
                }
            }
        }
    }, [checkInDate, checkOutDate, disabledDateIntervals, isLoading, searchParams, setSearchParams, setError]);
    


    if (!roomDetails) {
        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>; // Show error if any
        return <div>Room details not available.</div>;
    }

    if (!roomDetails) {
            return <div>Room details not available.</div>;
    }

    /**
    * creates the structure of the page.
    */ 
    return (
        <div>
            <Header />
            <div className={roomDetailPageStyle.contentcontainer}>
                <h1 className={roomDetailPageStyle.roomnametext}>{roomDetails.roomName + " at " + Source?.sourceName +", " + Source?.country + ", " + Source?.city}</h1>
            </div>
            <section className={roomDetailPageStyle.contentcontainer}>
                <div className={roomDetailPageStyle.image}>
                    <img src={roomDetails.imageUrl} alt="RoomDetailsPlaceholderImg"/>
                    <div className={roomDetailPageStyle.favbuttonoverlay}>
                        {room && <FavouriteButton room={room}/>}
                    </div>
                </div>
                <section className={roomDetailPageStyle.bookingbox}>
                    {role == "ROLE_USER" && (
                        <section className={roomDetailPageStyle.bookingoptionswrapper}>
                            <h1 className={roomDetailPageStyle.bookingboxtext}>How long will you stay?</h1>
                            {/* Place the date picker component here */}
                            <div style={{ display: 'flex', alignItems: 'center' }}> {/* Optional wrapper for layout */}
                                <CustomDatePicker
                                    onDatesSelected={handleDatesUpdate} // Pass the handler function
                                   initialStartDate={checkInDate}      // Pass the current state
                                   initialEndDate={checkOutDate}        // Pass the current state
                                    excludeDateIntervals={disabledDateIntervals}
                                />
                            </div>
                            <select aria-label="Select Provider" value={selectedProvider ?? ""} onChange={changeProvider}>
                    
                                <option value="" disabled>
                                    Choose your provider
                                </option>
                                {
                                roomProviders.length > 0 ?
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
                
                            <button className={roomDetailPageStyle.bookingsubmit} onClick={() => setShowConfirmation(true)}>Book room</button>
                            {/* <button onClick={bookRoom}>Book room</button> */}
                        </section>
                    )}
                    
                    {role == "ROLE_PROVIDER" && (
                        <>
                            <h1 className={roomDetailPageStyle.bookingboxtext}>Do you want to list this room?</h1>
                            <section className={roomDetailPageStyle.bookingoptionswrapper}>
                                <h1 className={roomDetailPageStyle.smallwhitetext}>Set Price:</h1>
                                <input placeholder="Enter price in USD" onChange={(e) => setRoomPrice(Number(e.target.value))}></input>
                                <button className={roomDetailPageStyle.bookingsubmit} onClick={() => { if (roomPrice !== undefined) { listRoomAsProvider(roomPrice);} else {alert("Please enter a price.");}}}>List Room</button>
                            </section>
                        </>
                    )}
                    {role == "ROLE_ADMIN" && (
                        <>
                            <h1 className={roomDetailPageStyle.bookingboxtext}>Please go to the admin page to manage this room.</h1>
                            <section className={roomDetailPageStyle.bookingoptionswrapper}>
                                <Link to="/admin">
                                    <button className={roomDetailPageStyle.bookingsubmit}>Admin Page</button>
                                </Link>
                            </section>
                        </>
                    )}
                    {!role && (
                        <>
                            <h1 className={roomDetailPageStyle.bookingboxtext}>Please Log in or register to book a room.</h1>
                            <section className={roomDetailPageStyle.bookingoptionswrapper}>
                                <Link to="/login">
                                    <button className={roomDetailPageStyle.bookingsubmit}>Log In</button>
                                </Link>
                                <Link to="/register">
                                    <button className={roomDetailPageStyle.bookingsubmit}>Sign Up</button>
                                </Link>
                            </section>
                        </>
                    )}
                </section>
            </section>
            <section className={roomDetailPageStyle.contentcontainer}>
                <div className={roomDetailPageStyle.detailsbox}>
                    <div className={roomDetailPageStyle.description}>
                        <h2 className={roomDetailPageStyle.bigwhitetext}>Description</h2>
                        {/* Used AI to fix the image links. */}
                        {roomDetails.description && (
                            <p className={roomDetailPageStyle.smallwhitetext}>
                                {roomDetails.description.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {line.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                                            if (part.match(/https?:\/\/[^\s]+/)) {
                                                try {
                                                    const url = new URL(part);
                                                    const shortText = url.hostname.replace(/^www\./, '');
                                                    return (
                                                        <a
                                                        key={index}
                                                        href={part}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#007bff', textDecoration: 'underline' }}
                                                        >
                                                            {shortText}
                                                        </a>
                                                    );
                                                } catch {
                                                    return part;
                                                }
                                                } else {
                                                    return <span key={index}>{part}</span>;
                                                }
                                        })}
                                    <br />
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                    <div className={roomDetailPageStyle.sitespecification}>
                        <h2 className={roomDetailPageStyle.bigwhitetext}>Room Specifications</h2>
                        <div className={roomDetailPageStyle.smallwhitetext}>
                            Room type: {roomDetails.roomType}<br />
                            <p>Amenities :</p>
                            <ul>
                                {ExtraFeatures.map((feature) => (
                                < li>{feature.feature}</li>))}
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