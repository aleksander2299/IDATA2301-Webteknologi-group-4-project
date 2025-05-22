import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

interface ExtraFeature {
    feature: string;
}

interface ProviderData {
    providerId: number;
    providerName: string;
}

interface RoomProviderData {
    roomProviderId: number;
    provider: ProviderData;
    roomPrice: number;
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
    const [extraFeatures, setExtraFeatures] = useState<ExtraFeature[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [roomProviders, setRoomProviders] = useState<RoomProviderData[]>([]);
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
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setIsLoading(false);
            setIsLoading(false);
            navigate('/login');
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
            setIsLoading(true);
            const fetchRoomProviders = async () => {
                try {
                    const response = await axiosInstance.get<RoomProviderData[]>(`/rooms/${roomId}/roomProviders`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setRoomProviders(response.data);
                } catch (err: any) {
                    console.error("Failed to fetch room providers:", err);
                    setError(err.response?.data?.message || "Failed to load data for editing.");
                } finally {
                    setIsLoading(false);
                }
            }

            axiosInstance.get<ExtraFeature[]>(`/extra_features`, {
                    headers: { Authorization: `Bearer ${token}` }
                    })
                    .then((response) => {
                        setExtraFeatures(response.data);
                    })
                    .catch((err) => {
                        console.error("Failed to fetch features:", err);
                        
                    })

            fetchRoomProviders();
        }, [roomId, token, navigate]);

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

    const handleDeleteRoomProvider = async (roomProviderIdToDelete: number) => {
        setError(null);
        setSuccessMessage(null);

        console.log("Current room ID:", roomId, "Current provider ID:", roomProviderIdToDelete);
        try {
            const response = await axiosInstance.delete(`/roomProvider/unlink/${roomId}/${roomProviderIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data + " r90e+r0se9ir+seri+se")
            setRoomProviders(prevProviders =>
                prevProviders.filter(rp => rp.provider.providerId !== roomProviderIdToDelete)
            );
            setSuccessMessage(`Provider link (ID: ${roomProviderIdToDelete}) removed successfully.`);

        } catch (err: any) {
            console.error("Failed to delete room provider:", err.response?.data || err.message);
            setError(err.response?.data?.message || `Failed to remove provider link ${roomProviderIdToDelete}.`);
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
                    <section className={editPageStyle.editbox}>
                        <h3 className={editPageStyle.topdetailstitle}>Edit room details: </h3>
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
                                <option value="any">Select Type</option>
                                {BASIC_ROOM_TYPES.map((type) => (
                                    <option key={type} value={type.toLowerCase()}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h4> Select Features: </h4>
                        <div className={editPageStyle.featureList}>
                                                        {extraFeatures.map((feature) => (
                                                        <label key={feature.feature}>
                                                        <input
                                                            type="checkbox"
                                                            value={feature.feature}
                                                            checked={selectedFeatures.includes(feature.feature)}
                                                            onChange={() => {
                                                    if (selectedFeatures.includes(feature.feature)) {
                                                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature.feature));
                                                    } else {
                                                            setSelectedFeatures([...selectedFeatures, feature.feature]);
                                                    }
                                                    }}
                                                    />
                                                    {feature.feature}
                                                    </label>
                                                    ))}
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
                            <button type="submit" className={editPageStyle.editbutton} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className={editPageStyle.editbutton}
                                    onClick={() => navigate('/admin')} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </form>
                    {/* --- Section for Managing Room Providers --- */}
                    <section className={editPageStyle.providersSection}>
                        <h3>Manage providers for this room:</h3>
                        {/* Display provider-specific errors or success messages here */}
                        {Error && <p className={`${editPageStyle.message} ${editPageStyle.error}`}>{Error}</p>}
                        {successMessage && Error === null && <p className={`${editPageStyle.message} ${editPageStyle.success}`}>{successMessage}</p>} {/* Show general success if no provider error */}


                        {isLoading ? (
                            <p className={editPageStyle.message}>Loading providers...</p>
                        ) : roomProviders.length > 0 ? (
                            <ul className={editPageStyle.providerList}>
                                {roomProviders.map(rp => (
                                    <li key={rp.roomProviderId} className={editPageStyle.providerItem}>
                                    <span>
                                        {rp.provider.providerName} - ${rp.roomPrice.toFixed(2)}
                                        (ID: {rp.roomProviderId})
                                    </span>
                                        <button
                                            onClick={() => handleDeleteRoomProvider(rp.provider.providerId)}
                                            className={editPageStyle.editbutton}
                                        >
                                            Unlink
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={editPageStyle.message}>No providers currently assigned to this room.</p>
                        )}
                        </section>
                    </section>
                    
                    </main>
                <Footer/>
            </>
    );
}

export default AdminEditRoomPage;