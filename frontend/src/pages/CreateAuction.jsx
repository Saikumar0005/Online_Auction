import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateAuction = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startingPrice: '',
        endTime: ''
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('startingPrice', formData.startingPrice);
            data.append('startTime', new Date().toISOString());
            data.append('endTime', new Date(formData.endTime).toISOString());
            if (image) {
                data.append('image', image);
            }

            await api.post('/auctions', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (error) {
            console.error("Create failed", error);
            alert("Failed to create auction");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create New Auction</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Item Title</label>
                    <input name="title" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Item Image</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full border p-2 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Description</label>
                    <textarea name="description" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Starting Price (₹)</label>
                    <input type="number" name="startingPrice" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">End Time</label>
                    <input type="datetime-local" name="endTime" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Pubish Auction</button>
            </form>
        </div>
    );
};

export default CreateAuction;
