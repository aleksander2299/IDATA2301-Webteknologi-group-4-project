import React, {useCallback, useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance';

import '../../styles/main.css';
import editPageStyle from './AdminEditRoomPage.module.css';

import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

interface RoomData {
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    visible: boolean;
    imageUrl: string;
    source: {
        sourceId: number;
        sourceName?: string;
        city?: string;
        country?: string;
    };
}

interface RoomUpdatePayload {
    roomName?: string;
    description?: string;
    roomType?: string;
    imageUrl?: string;
}

const BASIC_ROOM_TYPES: string[] = [
    'Single',
    'Superior',
    'Standard',
    'Plus',
    'Premium',
    'Deluxe',
    'Executive Suite',
    'Classic',
    'Junior Suite',
    'Suite',
    'Business Class',
    'Moderate',
    'Artist',
    'Club Room'
].sort((a, b) => a.localeCompare(b));

function AdminEditRoomPage() {

    const {roomId} = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [room, setRoom] = useState<RoomData | null>(null); // RoomData interface updated
    const [formData, setFormData] = useState<RoomUpdatePayload>({
        roomName: '',
        description: '',
        roomType: '',
        imageUrl: '',
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!roomId) {
            setError("Room ID is missing.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

            const fetchRoomData = async () => {
                try {
                    const roomResponse = await axiosInstance.get<RoomData>(`/rooms/${roomId}`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    const fetchedRoom = roomResponse.data;
                    setRoom(fetchedRoom);
                    setFormData({
                        roomName: fetchedRoom.roomName,
                        description: fetchedRoom.description,
                        roomType: fetchedRoom.roomType,
                        imageUrl: fetchedRoom.imageUrl,
                    });

                } catch (err: any) {
                    console.error("Failed to fetch room data or list of sources:", err);
                    setError(err.response?.data?.message || "Failed to load data for editing.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRoomData();
        }, [roomId, token]);

        const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const {name, value} = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            setSuccessMessage(null);
            setError(null);
        }, []);

        const handleSubmit = async (e: React.FormEvent) => {
            //Needed to prevent page from reloading when submitting formData
            e.preventDefault();
            if (!room) {
                setError("Room ID is missing.");
                return;
            }
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const payloadToSend: RoomUpdatePayload = {
                ...room,
                roomName: formData.roomName,
                description: formData.description,
                roomType: formData.roomType,
                imageUrl: formData.imageUrl,
            };

            try {
                // Temporarily using put
                const response = await axiosInstance.put(`/rooms/${room.roomId}`, payloadToSend,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                const updatedRoomDataFromServer = response.data;
                setRoom(updatedRoomDataFromServer);
                setFormData({
                    roomName: updatedRoomDataFromServer.roomName,
                    description: updatedRoomDataFromServer.description,
                    roomType: updatedRoomDataFromServer.roomType,
                    imageUrl: updatedRoomDataFromServer.imageUrl || (updatedRoomDataFromServer as any).imageurl || '',
                });
                setSuccessMessage("Room updated successfully.");

            } catch (err: any) {
                console.error("Failed to update room:", err);
                setError(err.response?.data?.message || "Failed to update room.");
            } finally {
                setIsSaving(false);
            }
        };

        if (isLoading) {
            return <p className={editPageStyle.message}>Loading room details...</p>;
        }

        if (error && !room) {
            return <p className={`${editPageStyle.message} ${editPageStyle.error}`}>Error: {error}</p>;
        }

        if (!room) {
            return <p className={editPageStyle.message}>Room data not found.</p>;
        }

        return (
            <>
                <Header/>
                <main className={editPageStyle.main}>
                    <form onSubmit={handleSubmit} className={editPageStyle.editForm}>
                        {/* AI was used to help generate the form fields.
                Since its just the same field with different info*/}
                        <div className={editPageStyle.formGroup}>
                            <label htmlFor="roomName">Room Name:</label>
                            <input
                                type="text"
                                id="roomName"
                                name="roomName"
                                value={formData.roomName || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={editPageStyle.formGroup}>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                rows={5}
                            />
                        </div>

                        <div className={editPageStyle.formGroup}>
                            <label htmlFor="roomType">Room Type:</label>
                            <select
                                id="roomType"
                                name="roomType"
                                value={formData.roomType || ''} // Ensure value is not undefined
                                onChange={handleInputChange}
                                required
                            >
                                <option value="any">Any Type</option>
                                {BASIC_ROOM_TYPES.map((type) => (
                                    <option key={type} value={type.toLowerCase()}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* TODO: If images work uncomment this*/}
                        {/*
            <div className={editPageStyle.formGroup}>
                <label htmlFor="imageUrl">Image URL:</label>
                <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ''} // Ensure value is not undefined
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                />
            </div>
            */}


                        <div className={editPageStyle.formActions}>
                            <button type="submit" className={editPageStyle.saveButton} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className={editPageStyle.cancelButton}
                                    onClick={() => navigate('/admin')} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </main>
                <Footer/>
            </>
    );
}

export default AdminEditRoomPage;