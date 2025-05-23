import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance';

import '../../styles/main.css';
import addRoomPageStyle from './AddRoomPage.module.css';

import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

interface SourceOption {
    sourceId: number;
    sourceName: string;
}


interface RoomData {
    roomName: string;
    description: string;
    roomType: string;
    imageUrl: string;
    visibility: boolean;
}

interface CreatedRoomData {
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    visibility: boolean;
    imageUrl: string;
    source: SourceOption;
}

interface RoomFormState {
    roomName: string;
    description: string;
    roomType: string;
    imageUrl: string;
    selectedSourceId: string; // Store as string from select, convert to number for API call
    isVisible: boolean;
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

function AddRoomPage() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('');
    const [sourceDetails, setSourceDetails] = useState<SourceOption[]>([]);
    const [room, setRoom] = useState<RoomData | null>(null); // RoomData interface updated
    const [formData, setFormData] = useState<RoomFormState>({
        roomName: '',
        description: '',
        roomType: '',
        imageUrl: '',
        selectedSourceId: '',
        isVisible: true,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Authentication required. Please log in.");
            setIsLoading(false);
            navigate('/login');
            return;
        }

        setIsLoading(true);
        setError(null);
        axiosInstance.get<SourceOption[]>(`/source`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            setSourceDetails(response.data);
        })
        .catch((err) => {
            console.error("Failed to fetch sources:", err);
            setError(err.response?.data?.message || "Failed to fetch sources.");
        })
        .finally(() => setIsLoading(false))
    }, [token, navigate]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setSuccessMessage(null);
        setError(null);
    }, []);
    /*
    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

    })
    */
    const addRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form fields
        if (!formData.roomName || !formData.description || !formData.roomType) {
            setError("Please fill out all fields.");
            return;
        }
        if (!formData.selectedSourceId) {
            setError("Please select a source.");
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let imageUrl = "";

            if (selectedFile) {
                const fileFormData = new FormData();
                fileFormData.append('file', selectedFile);

                const uploadResponse = await axiosInstance.post(`/rooms/images`, fileFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const uploadedFilename = uploadResponse.data;
                imageUrl = `/images/${uploadedFilename}`;
            }

            const payloadToSend: RoomData = {
                roomName: formData.roomName,
                description: formData.description,
                roomType: formData.roomType,
                imageUrl: imageUrl,
                visibility: formData.isVisible,
            };

            await axiosInstance.post<CreatedRoomData>(
                `/rooms/withSource/${formData.selectedSourceId}`,
                payloadToSend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage("Room created successfully.");

            setSelectedFile(null);
            setFormData({
                roomName: '',
                description: '',
                roomType: BASIC_ROOM_TYPES[0],
                imageUrl: '',
                selectedSourceId: '',
                isVisible: true,
            });

        } catch (err: any) {
            console.error("Failed to create room:", err);
            setError(err.response?.data?.message || "Failed to create room.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <p className={addRoomPageStyle.message}>Loading room details...</p>;
    }

    if (error) {
        return <p className={`${addRoomPageStyle.message} ${addRoomPageStyle.error}`}>Error: {error}</p>;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            // Update formData with a generated URL for server-side use
            setFormData((prev) => ({
                ...prev,
                imageUrl: `/images/${file.name}`,
            }));
        }
    };

    return (
        <>
            <Header/>
            {/* AI was used to help generate the form fields.
                Since its just the same field with different info*/}
            <main className={addRoomPageStyle.main}>
                <form onSubmit={addRoom} className={addRoomPageStyle.roomForm}>
                    <h3 className={addRoomPageStyle.topdetailstitle}>Add room details: </h3>
                    <div className={addRoomPageStyle.formSection}>
                        <div className={addRoomPageStyle.sectionLegend}>Room Details</div>

                        <div className={addRoomPageStyle.formControl}>
                            <label htmlFor="roomName">Room Name:</label>
                            <input
                                type="text"
                                id="roomName"
                                name="roomName"
                                value={formData.roomName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={addRoomPageStyle.formControl}>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>

                        <div className={addRoomPageStyle.formControl}>
                            <label htmlFor="roomType">Room Type:</label>
                            <select
                                id="roomType"
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="any" >Any</option>
                                {BASIC_ROOM_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={addRoomPageStyle.formControl}>
                            <label htmlFor="imageUrl">Image URL:</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                disabled={!!selectedFile}
                            />
                            {formData.imageUrl && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({ ...prev, imageUrl: '' }))
                                    }
                                    className={addRoomPageStyle.clearButton}
                                >
                                    Clear image URL
                                </button>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                disabled={formData.imageUrl.trim() !== ''}
                            />
                        </div>
                        {selectedFile && (
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className={addRoomPageStyle.clearButton}
                            >
                                Clear chosen file
                            </button>
                        )}
                    </div>

                    <div className={addRoomPageStyle.formSection}>
                        <div className={addRoomPageStyle.sectionLegend}>Associations:</div>
                        <div className={addRoomPageStyle.formControl}>
                            <label htmlFor="selectedSourceId">Assign to Source (Hotel/Property):</label>
                            <select
                                id="selectedSourceId"
                                name="selectedSourceId"
                                value={formData.selectedSourceId}
                                onChange={handleInputChange}
                                required
                                disabled={sourceDetails.length === 0 || isLoading}
                            >
                                <option value="" disabled={formData.selectedSourceId !== "" || sourceDetails.length === 0}>
                                    {isLoading ? "Loading sources..." : sourceDetails.length === 0 ? "No sources available" : "-- Select a Source --"}
                                </option>
                                {sourceDetails.map((source) => (
                                    <option key={source.sourceId} value={String(source.sourceId)}>
                                        {source.sourceName} (ID: {source.sourceId})
                                    </option>
                                ))}
                            </select>
                            {sourceDetails.length === 0 && !isLoading && (
                                <p className={addRoomPageStyle.inlineWarning}>Please add a source before creating rooms.</p>
                            )}
                        </div>
                    </div>

                    <div className={addRoomPageStyle.formActions}>
                        <button
                            type="submit"
                            className={addRoomPageStyle.submitButton}
                            disabled={isSaving || isLoading || sourceDetails.length === 0 || !formData.selectedSourceId}
                        >
                            {isSaving ? 'Adding Room...' : 'Add Room'}
                        </button>
                        <button
                            type="button"
                            className={addRoomPageStyle.cancelButton}
                            onClick={() => navigate('/admin')}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
            <Footer/>
        </>
    );
}

export default AddRoomPage;