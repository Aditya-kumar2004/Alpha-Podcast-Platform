import { useState, useEffect } from "react";
import { Upload as UploadIcon, Music, Video, Image as ImageIcon, X, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, Eye, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { categories as defaultCategories } from "@/data/podcasts";
import { API_URL } from "@/lib/api";

const Upload = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [language, setLanguage] = useState("English");
    const [visibility, setVisibility] = useState("public");

    useEffect(() => {
        if (editId && user?.token) {
            setFetching(true);
            fetch(`${API_URL}/podcasts/${editId}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setTitle(data.title);
                        setDescription(data.description);
                        setCategory(data.category);
                        if (data.language) setLanguage(data.language);
                        // Visibility is not yet in backend schema explicitly but nice to have in state
                    }
                })
                .catch(err => console.error("Failed to load podcast", err))
                .finally(() => setFetching(false));
        }
    }, [editId, user]);

    // File State
    const [audioFile, setAudioFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    // Check State
    const [checking, setChecking] = useState(false);
    const [checkStatus, setCheckStatus] = useState("pending"); // pending, checking, safe, issues

    const steps = [
        { id: 1, label: "Details" },
        { id: 2, label: "Media" },
        { id: 3, label: "Checks" },
        { id: 4, label: "Visibility" },
    ];

    // Auto-advance checks
    useEffect(() => {
        if (step === 3 && checkStatus === "pending") {
            setChecking(true);
            setCheckStatus("checking");
            // Simulate copyright check
            setTimeout(() => {
                setChecking(false);
                setCheckStatus("safe");
            }, 3000);
        }
    }, [step, checkStatus]);

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(false);

        const token = user?.token || localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to upload.");
            setLoading(false);
            return;
        }

        try {
            if (editId) {
                // EDIT MODE
                const res = await fetch(`${API_URL}/podcasts/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description, category, language })
                });

                if (res.ok) {
                    setSuccess(true);
                    setTimeout(() => navigate('/profile'), 1500);
                } else {
                    const data = await res.json();
                    alert(data.message || "Update failed");
                }
            } else {
                // CREATE MODE
                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("category", category);
                formData.append("language", language);
                formData.append("visibility", visibility);
                if (audioFile) formData.append("audio", audioFile);
                if (videoFile) formData.append("video", videoFile);
                if (thumbnail) formData.append("image", thumbnail);

                const response = await fetch(`${API_URL}/podcasts`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    setSuccess(true);
                    setTimeout(() => navigate('/profile'), 2000);
                } else {
                    let errorMessage = "Upload failed";
                    try {
                        const data = await response.json();
                        errorMessage = data.message || errorMessage;
                    } catch (e) {
                        const text = await response.text();
                        console.error("Non-JSON Response:", text);
                        errorMessage = `Server Error: ${text.slice(0, 100)}`; // Show preview of error
                    }
                    alert(errorMessage);
                }
            }
        } catch (error) {
            console.error("Error submitting:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper Components
    const FileUploadBox = ({ type, icon: Icon, file, setFile, accept, label }) => (
        <label className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-white/5'}`}>
            <input type="file" className="hidden" accept={accept} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${file ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                {file ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <p className="font-medium text-center">{file ? file.name : label}</p>
            {!file && <p className="text-xs text-muted-foreground mt-2">Click to browse</p>}
        </label>
    );

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col overflow-hidden">
            {/* Success Overlay */}
            {success && (
                <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md mx-4 transform animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold font-display mb-2 text-white">Upload Successful!</h2>
                        <p className="text-muted-foreground text-lg">
                            Your {videoFile ? "video" : "audio"} has been uploaded successfully.
                        </p>
                        <p className="text-sm text-muted-foreground mt-6 animate-pulse">
                            Redirecting to your profile...
                        </p>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#121212]">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2 text-muted-foreground hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-lg font-bold">{editId ? "Edit Podcast" : "Upload Podcast"}</h2>
                    <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-white/5 rounded">{editId ? "EDITING" : "DRAFT"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} title="Close">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Stepper */}
                <div className="w-[300px] border-r border-white/10 p-6 hidden lg:block bg-[#121212]/50">
                    <div className="space-y-1">
                        {steps.map((s) => (
                            <div key={s.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${step === s.id ? 'bg-primary/20 text-primary' : step > s.id ? 'text-green-500' : 'text-muted-foreground'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s.id ? 'bg-primary text-white' : step > s.id ? 'bg-green-500 text-white' : 'bg-white/10'}`}>
                                    {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
                                </div>
                                <span className="font-medium">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
                    <div className="max-w-4xl mx-auto p-8 pb-32">

                        {/* STEP 1: DETAILS */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                                <h3 className="text-2xl font-bold">Details</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Title (required)</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20"
                                            placeholder="Add a title that describes your podcast"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="5"
                                            className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 resize-none"
                                            placeholder="Tell viewers about your podcast"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Category</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg p-3 pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 peer"
                                                placeholder="Select or type a category..."
                                                autoComplete="off"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>

                                            {/* Custom Dropdown */}
                                            <div className="absolute z-50 w-full mt-1 bg-[#1f1f1f] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto hidden peer-focus:block hover:block">
                                                {defaultCategories
                                                    .filter(c => c.toLowerCase().includes(category.toLowerCase()))
                                                    .map((c) => (
                                                        <div
                                                            key={c}
                                                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-gray-300 hover:text-white"
                                                            onClick={() => setCategory(c)} // Note: verify onMouseDown vs onClick for blur issues
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // Prevent blur before click fires
                                                                setCategory(c);
                                                            }}
                                                        >
                                                            {c}
                                                        </div>
                                                    ))}
                                                {defaultCategories.filter(c => c.toLowerCase().includes(category.toLowerCase())).length === 0 && (
                                                    <div className="px-4 py-2 text-sm text-muted-foreground italic">
                                                        Press Enter to add "{category}"
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-white/80">Language</label>
                                                <div className="relative">
                                                    <select
                                                        value={language}
                                                        onChange={(e) => setLanguage(e.target.value)}
                                                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg p-3 appearance-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 text-white cursor-pointer"
                                                    >
                                                        <option value="English">English</option>
                                                        <option value="Hindi">Hindi</option>
                                                        <option value="Hinglish">Hinglish</option>
                                                        <option value="Marathi">Marathi</option>
                                                        <option value="Bengali">Bengali</option>
                                                        <option value="Tamil">Tamil</option>
                                                        <option value="Telugu">Telugu</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button onClick={handleNext} disabled={!title}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: MEDIA */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                                <h3 className="text-2xl font-bold">Media</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FileUploadBox type="audio" icon={Music} file={audioFile} setFile={setAudioFile} accept=".mp3,.wav,.m4a,.aac,.flac,.ogg,.wma,.mp4,.mkv,.avi,.mov" label="Upload Audio File" />
                                    <FileUploadBox type="video" icon={Video} file={videoFile} setFile={setVideoFile} accept=".mp4,.mkv,.avi,.mov,.webm" label="Upload Video (Optional)" />
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <h4 className="font-medium">Thumbnail</h4>
                                    <p className="text-sm text-muted-foreground">Select or upload a picture that shows what's in your podcast.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <FileUploadBox type="image" icon={ImageIcon} file={thumbnail} setFile={setThumbnail} accept="image/*" label="Upload Thumbnail" />
                                        </div>
                                        {/* Placeholders for auto-generated thumbnails (mock) */}
                                        <div className="bg-[#1f1f1f] rounded-xl border border-white/5 flex items-center justify-center aspect-video text-xs text-muted-foreground">Auto-generated 1</div>
                                        <div className="bg-[#1f1f1f] rounded-xl border border-white/5 flex items-center justify-center aspect-video text-xs text-muted-foreground">Auto-generated 2</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CHECKS */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                                <h3 className="text-2xl font-bold">Checks</h3>
                                <p className="text-muted-foreground">We'll check your podcast for issues that may restrict its visibility.</p>

                                <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5" />
                                            Copyright
                                        </h4>
                                        {checkStatus === "checking" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                                        {checkStatus === "safe" && <CheckCircle className="w-5 h-5 text-green-500" />}
                                        {checkStatus === "issues" && <AlertCircle className="w-5 h-5 text-red-500" />}
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        {checkStatus === "checking" && "Checking your content for copyright issues..."}
                                        {checkStatus === "safe" && "No copyright issues found."}
                                        {checkStatus === "issues" && "Copyright issues found."}
                                    </div>

                                    {checkStatus === "safe" && (
                                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-sm text-green-100">Your content is safe to upload.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-sm text-yellow-200/80">
                                    <p>Remember: These results are estimates. Checks may change if you edit your content later.</p>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: VISIBILITY */}
                        {step === 4 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                                <h3 className="text-2xl font-bold">Visibility</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="border border-white/10 rounded-xl p-4 bg-[#1f1f1f] space-y-4">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input type="radio" name="visibility" value="public" checked={visibility === "public"} onChange={() => setVisibility("public")} className="mt-1" />
                                                <div>
                                                    <div className="font-bold text-white">Public</div>
                                                    <div className="text-sm text-muted-foreground">Everyone can watch your podcast</div>
                                                </div>
                                            </label>
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input type="radio" name="visibility" value="private" checked={visibility === "private"} onChange={() => setVisibility("private")} className="mt-1" />
                                                <div>
                                                    <div className="font-bold text-white">Private</div>
                                                    <div className="text-sm text-muted-foreground">Only you and people you choose can watch</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-[#1f1f1f] rounded-xl p-6 border border-white/10 h-fit">
                                        <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden relative">
                                            {thumbnail ? (
                                                <img src={URL.createObjectURL(thumbnail)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-white/5">No Thumbnail</div>
                                            )}
                                        </div>
                                        <h4 className="font-bold line-clamp-2 md:text-lg mb-1">{title || "Your Podcast Title"}</h4>
                                        <div className="text-xs text-muted-foreground uppercase">{category} • {user?.username}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Action Buttons */}
            <div className="h-20 bg-[#121212] border-t border-white/10 flex items-center justify-between px-8">
                <Button variant="ghost" onClick={handleBack}>
                    {step === 1 ? "Cancel" : "Back"}
                </Button>

                <div className="flex items-center gap-3">
                    {step > 1 && step < 4 ? (
                        <Button onClick={handleNext} disabled={step === 1 && !title}>
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading || success} variant="hero" className="w-32">
                            {loading || success ? <Loader2 className="w-4 h-4 animate-spin" /> : (editId ? "Update" : "Publish")}
                        </Button>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Upload;
