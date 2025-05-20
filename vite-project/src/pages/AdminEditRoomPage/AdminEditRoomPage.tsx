import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance';

import '../../styles/main.css';
import editPageStyle from './AdminEditRoomPage.module.css';

import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import styles from "../../components/SearchBar/SearchBar.module.css";

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
    };
}

interface SourceOption {
    sourceId: number;
    sourceName: string;
}

interface RoomUpdatePayload {
    roomName?: string;
    sourceId?: number;
    description?: string;
    visibility?: boolean;
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

    return (
        <>
        <Header />
        <main className={editPageStyle.main}></main>
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
            {/*}
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

            <div className={editPageStyle.formGroup}>
                <label htmlFor="sourceId">Source:</label>
                <select
                    id="sourceId"
                    name="sourceId"
                    value={formData.sourceId || ''}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Source</option>
                    {sourcesList.map(s => (
                        <option key={s.sourceId} value={s.sourceId}>
                            {s.sourceName} (ID: {s.sourceId})
                        </option>
                    ))}
                </select>
                {room.source && <small>Currently: {room.source.sourceName} (ID: {room.source.sourceId})</small>}
            </div>


            <div className={editPageStyle.formActions}>
                <button type="submit" className={editPageStyle.saveButton} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className={editPageStyle.cancelButton} onClick={() => navigate('/admin')} disabled={isSaving}>
                    Cancel
                </button>
            </div>
        </form>
        </main>
    <Footer />
    </>

    );
};

export default AdminEditRoomPage;