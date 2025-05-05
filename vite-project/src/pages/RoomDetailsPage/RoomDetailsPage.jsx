import '../../styles/main.css';
import './RoomDetailsPage.css';


import Footer from '../../components/layout/Footer.jsx';

import roomImg from '../../Images/room image placeholder.jpg';

function RoomDetailsPage () {
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