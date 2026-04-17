"use client"
import React, { useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';
import { AxeIcon, ImageIcon, MonitorIcon } from '@phosphor-icons/react';
import { XCircleIcon } from '@phosphor-icons/react/dist/ssr';
import TipTapEditor from './TiptapEditor';

const UpdateExperience = React.memo(({ setExperience, close, updating }) => {
    const outDivRef = useRef(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        id: null,
        role: "",
        company: "",
        duration: "",
        description: "",
        weburl: "",
        static_file: "",
        resourceType: "",
    });

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const updatedData = { ...formdata };
        try {
            const formData = new FormData();
            formData.append("id", updatedData.id);
            formData.append("role", updatedData.role);
            formData.append("company", updatedData.company);
            formData.append("duration", updatedData.duration);
            formData.append("description", updatedData.description || "");
            formData.append("weburl", updatedData.weburl || "");
            formData.append("existing_static_file", updatedData.static_file || "");

            if (file) {
                formData.append("staticfile", file);
            }

            const response = await fetch(`/api/experience`, {
                method: updating ? "PUT" : "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message);
                if (updating) {
                    setExperience(prev => prev.map(exp => exp.id === updating ? { ...result.updatedExperience } : exp));
                } else {
                    setExperience(prev => ([...prev, result.updatedExperience]));
                }
                close("");
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormdata(prev => ({ ...prev, resourceType: selectedFile.type.split("/")[0] }));
            setFile(selectedFile);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (outDivRef.current && !outDivRef.current.contains(e.target)) {
                close("");
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [close]);

    useEffect(() => {
        const fetchExperience = async (updatingId) => {
            setLoading(true);
            try {
                const resp = await fetch(`/api/experience/?id=${updatingId}`);
                const result = await resp.json();
                if (result.success && result.experience) {
                    setFormdata({
                        id: result.experience.id,
                        role: result.experience.role,
                        company: result.experience.company,
                        duration: result.experience.duration,
                        description: result.experience.description,
                        weburl: result.experience.weburl || "",
                        static_file: result.experience.static_file,
                        resourceType: result.experience.resourceType,
                    });
                }
            } catch (error) {
                console.log("Error occurred while fetching experience data: ", error.message);
            } finally {
                setLoading(false);
            }
        }
        if (updating) {
            fetchExperience(updating);
        }
    }, [updating]);

    return (
        <div className='fixed inset-0 flex items-center justify-center h-screen w-screen bg-black/50 z-50 overflow-y-auto p-4'>
            <div ref={outDivRef} className='relative w-full max-w-4xl max-h-[90vh] p-6 border border-gray-300 rounded-lg shadow-lg bg-white overflow-y-auto my-auto'>
                {loading &&
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[60] rounded-lg">
                        <Spinner />
                    </div>
                }
                <button
                    className="absolute top-4 right-4 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => {
                        setFormdata({
                            id: null,
                            role: "",
                            company: "",
                            duration: "",
                            description: "",
                            weburl: "",
                            static_file: "",
                            resourceType: ""
                        });
                        close("");
                    }}
                >
                    <AxeIcon size={20} className="text-gray-500 hover:text-red-500" />
                </button>

                <div className="space-y-6 pt-8">
                    <h2 className='text-xl font-bold text-center text-gray-900'>{updating ? "Update Experience" : "Add Experience"}</h2>

                    <div className="border-4 border-dashed border-gray-700 p-3 flex justify-center items-center min-h-[8rem] w-full rounded-md cursor-pointer relative">
                        {
                            formdata.static_file ?
                                <div className="relative max-w-full max-h-28 overflow-hidden">
                                    {
                                        formdata.resourceType === "video" ?
                                            <video src={formdata.static_file} className="max-h-28 max-w-full object-contain rounded-md" controls />
                                            :
                                            <img src={formdata.static_file} alt="Preview" className="max-h-28 max-w-full object-contain rounded-md" />
                                    }
                                    <button
                                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                        onClick={() => setFormdata(prev => ({ ...prev, static_file: "" }))}
                                    >
                                        <XCircleIcon size={20} className="text-red-500" />
                                    </button>
                                </div>
                                :
                                <>
                                    <input
                                        type="file"
                                        accept="image/*, video/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    {file ? (
                                        <div className="relative max-w-full max-h-24 overflow-hidden">
                                            {file.type.startsWith("image/") ? (
                                                <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-24 max-w-full object-contain rounded-md" />
                                            ) : (
                                                <video src={URL.createObjectURL(file)} controls className="max-h-24 max-w-full object-contain rounded-md" />
                                            )}
                                            <button
                                                className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                                onClick={() => setFile(null)}
                                            >
                                                <XCircleIcon size={20} className="text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm font-semibold text-center flex flex-col justify-center items-center space-y-1">
                                            <span className='flex items-center space-x-2'>
                                                <ImageIcon size={16} /> Upload Image /
                                                <MonitorIcon size={16} />Video
                                            </span>
                                            <span>(Optional Media)</span>
                                        </div>
                                    )}
                                </>
                        }
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Role / Title</label>
                            <input
                                type="text"
                                placeholder="E.g. Software Engineer"
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                                name="role"
                                onChange={handleFormData}
                                value={formdata.role}
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Company / Organization</label>
                            <input
                                type="text"
                                placeholder="E.g. Google"
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                                name="company"
                                onChange={handleFormData}
                                value={formdata.company}
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-gray-700 font-semibold mb-2'>Duration</label>
                        <input
                            type="text"
                            placeholder="E.g. Jan 2022 - Present"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                            name="duration"
                            onChange={handleFormData}
                            value={formdata.duration}
                        />
                    </div>

                    <div>
                        <label className='block text-gray-700 font-semibold mb-2'>Company Website URL / Web URL (Auto-fetching Favicon instead of image upload)</label>
                        <input
                            type="text"
                            placeholder="E.g. https://google.com"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                            name="weburl"
                            onChange={handleFormData}
                            value={formdata.weburl}
                        />
                    </div>

                    <div>
                        <label className='block text-gray-700 font-semibold mb-2'>Description</label>
                        <TipTapEditor
                            value={formdata.description}
                            onChange={(val) => handleFormData({ target: { name: 'description', value: val } })}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='w-full text-lg font-semibold tracking-wider px-3 py-2 rounded-md shadow-md bg-sky-500 hover:bg-sky-600 text-white disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors'
                    >
                        {loading ? 'Processing...' : (updating ? "Update Experience" : "Add Experience")}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default UpdateExperience;
