import '../styles/main.css';
import '../styles/roomdetailstyle.css';

import Footer from './Footer.jsx';

import roomImg from '../Images/room image placeholder.jpg';

function RoomDetails () {
    return (
        <div>
            <header>
                <div class="home"><b>Stay Finder</b></div>
            </header>
            <div class="content-container">
                <h1 class="roomnametext">Thon Hotel Ålesund, City Centre. Ålesund, Norway.</h1>
            </div>
            <section class="content-container">
                <div class="image">
                    <img src={roomImg} alt="RoomDetailsPlaceholderImg"/>
                </div>
                <section class="bookingbox">
                    <div class="bookingboxtext">How long will you stay?</div>
                    <button class="button1">Start Date</button>
                    <button class="button2">End Date</button>
                    <button class="button3">BOOK NOW!</button>
                </section>
            </section>
            <section class="content-container">
                <div class="detailsbox">
                    <div class="description">
                        <h2 class="bigwhitetext">Description</h2>
                        <p class="smallwhitetext">
                            Lovely hotel suite in the heart of Ålesund! You and your partner get one of the best views the city has to offer overlooking the bay,
                            a king-sized bed with maximum comfortability and wonderful room service!
                    
                        </p>
                    </div>
                    <div class="site-specification">
                        <h2 class="bigwhitetext">Room Specifications</h2>
                        <p class="smallwhitetext">
                            - Room type: Suite<br />
                            - Bed type: Double<br />
                            - Room capacity: 2<br />
                            - Check-in: 3:00 PM<br />
                            - Check-out: 11:00 AM<br />
                            - Internet: Included<br />
                            - Parking: Available<br />
                            - Gym: Available<br />
                            - Pet Friendly: Yes<br />
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );

}

export default RoomDetails;


