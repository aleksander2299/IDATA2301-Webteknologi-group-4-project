import React, { useState } from 'react';
import axios from 'axios';

const ImageTestPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [filename, setFilename] = useState<string>(''); // For deletion
    const [status, setStatus] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile || !roomId) {
            setStatus('Please select a file and enter a room ID.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        axios.post(`/api/rooms/${roomId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                setFilename(response.data); // Use returned filename for deletion
                setStatus(`Upload successful. Filename: ${response.data}`);
            })
            .catch(error => {
                console.error(error);
                setStatus('Upload failed.');
            });
    };

    const handleDelete = () => {
        if (!roomId) {
            setStatus('Enter filename to delete or upload one first.');
            return;
        }

        axios.delete(`/api/rooms/images/room/${roomId}`)
            .then(() => {
                setStatus(`Image "${filename}" deleted successfully.`);
                setFilename('');
            })
            .catch(error => {
                console.error(error);
                setStatus('Deletion failed.');
            });
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Image Upload / Delete Test</h2>

            <div>
                <label>Room ID: </label>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
            </div>

            <div style={{ margin: '1rem 0' }}>
                <input type="file" onChange={handleFileChange} />
            </div>

            <button onClick={handleUpload}>Upload Image</button>

            <div style={{ margin: '1rem 0' }}>
                <label>Filename to Delete: </label>
                <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                />
            </div>

            <button onClick={handleDelete}>Delete Image</button>

            <div style={{ marginTop: '1rem', color: 'darkgreen' }}>
                <strong>Status:</strong> {status}
            </div>
        </div>
    );
};

export default ImageTestPage;
