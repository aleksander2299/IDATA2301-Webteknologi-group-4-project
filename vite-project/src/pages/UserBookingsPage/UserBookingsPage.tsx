import '../../styles/main.css';
import userBookingsPageStyle from './UserBookingsPage.module.css';

import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import {useEffect, useState} from "react";
import {axiosInstance} from "../../AxiosInstance.tsx";

function UserBookingsPage () {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await axiosInstance.get(`/booking/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRooms(response.data);
            } catch (err) {
                console.log(err);
                console.log("username here: " + username);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [username]);

    return (
        <div>
            <Header />
            <main>

            </main>
            <Footer />
        </div>
        );
    }
export default UserBookingsPage;