import { useState } from "react";
import { createTrip } from "../api/tripApi";

const CreateTrip = () => {
    const [formData, setFormData] = useState({
        tripName: "",
        startDate: "",
        endDate: "",
        description: "",
        coverPhoto: null,
    });

    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            coverPhoto: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const tripData = {
                tripName: formData.tripName,
                startDate: formData.startDate,
                endDate: formData.endDate,
                description: formData.description,
                coverPhoto: "",
            };

            console.log("Sending Trip Data:", tripData);

            const response = await createTrip(tripData);

            console.log("Trip Created:", response);

            alert("Trip created successfully!");

            setFormData({
                tripName: "",
                startDate: "",
                endDate: "",
                description: "",
                coverPhoto: null,
            });

            setPreview(null);
        } catch (error) {
            console.error("Create trip error:", error);

            alert(error.message || "Failed to create trip");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Create New Trip
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Start planning your next adventure.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Trip Name */}
                        <div className="mb-6">
                            <label
                                htmlFor="tripName"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Trip Name
                            </label>

                            <input
                                id="tripName"
                                type="text"
                                name="tripName"
                                value={formData.tripName}
                                onChange={handleChange}
                                placeholder="e.g. Goa Beach Trip"
                                required
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Dates */}
                        <div className="mb-6 grid gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Start Date
                                </label>

                                <input
                                    id="startDate"
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endDate"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    End Date
                                </label>

                                <input
                                    id="endDate"
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Trip Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us something about your trip..."
                                rows="5"
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Cover Photo */}
                        <div className="mb-8">
                            <label
                                htmlFor="coverPhoto"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Cover Photo
                            </label>

                            <input
                                id="coverPhoto"
                                type="file"
                                name="coverPhoto"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                            />

                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Trip preview"
                                        className="h-48 w-full rounded-xl object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                            >
                                Save & Continue →
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;