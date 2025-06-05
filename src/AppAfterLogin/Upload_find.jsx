import React, { useState } from 'react'
import { databases, storage } from '../appwrite'
import { ID } from 'appwrite'
import { Link } from 'react-router-dom'; // Import Link

const Upload_find = ({ user, setPage }) => {
  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    phone: "",
    title: "",
    description: "",
    location: "",
    color: "",
    imageUrl: null,
    tags: "",
    course: "",
    phonePrivate: false
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    let imageUrl = null;

    try {
      if (image) {
        const imageUpload = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          image
        );
        imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${imageUpload.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
        console.log(imageUrl);
      }

      const res = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_FOUND_COLLECTION_ID,
        ID.unique(),
        { ...formData, imageUrl, phone: +formData.phone, phonePrivate:isPrivate }
      );
      console.log("Document Created:", res);
      alert("Item Reported Successfully!");
      setSuccess(true);
      setFormData({
        email: user.email,
        name: user.name,
        phone: "",
        title: "",
        description: "",
        location: "",
        color: "",
        imageUrl: null,
        tags: "",
        course: "",
        phonePrivate:false
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.log(err);
      alert("Error uploading item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-6 sm:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">Report Found Item</h2>
              <p className="text-sm sm:text-base text-green-500">Help others find their lost items</p>
            </div>

            <style jsx>{`
              .slideIn {
                animation: slideIn 1s ease-out;
              }

              @keyframes slideIn {
                0% {
                  transform: translateX(-100%);
                  opacity: 0;
                }
                100% {
                  transform: translateX(0);
                  opacity: 1;
                }
              }

              .marquee {
                overflow: hidden;
                white-space: nowrap;
                box-sizing: border-box;
                animation: marquee 15s linear infinite;
              }

              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
            `}</style>

            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 marquee" role="alert">
              <p className="font-bold inline-block">Disclaimer: If you upload fake information or break any rules, strict action will be taken.</p>
            </div>
            
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
              <p className="text-sm">
                Please make sure to read our 
                <Link 
                  to="/dashboard/about" // Use Link to navigate to the About Us page
                  className="font-semibold text-blue-600 hover:text-blue-800 ml-1 underline focus:outline-none"
                >
                  About Us & Rules
                </Link> 
                before submitting a report.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    disabled
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                      text-gray-400 cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                      text-gray-400 cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number (must be 10 digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="\d{10}"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="flex items-center">
                <input
                  type="checkbox"
                  id="private"
                  name="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="private" className="text-sm font-medium text-gray-300">
                  Mark  phone Number private
                </label>
              </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Item Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Item Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Found Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Course Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Batch 
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select your batch</option>
                    <option value="BTech 2021">BTech 2021</option>
                    <option value="BTech 2022">BTech 2022</option>
                    <option value="BTech 2023">BTech 2023</option>
                    <option value="BTech 2024">BTech 2024</option>
                    <option value="MTech 2023">MTech 2023</option>
                    <option value="MTech 2024">MTech 2024</option>
                    <option value="MBA 2023">MBA 2023</option>
                    <option value="MBA 2024">MBA 2024</option>
                    <option value="MSc 2023">MSc 2023</option>
                    <option value="MSc 2024">MSc 2024</option>
                    <option value="BSc BEd 2023">BSc BEd 2023</option>
                    <option value="BSc BEd 2024">BSc BEd 2024</option>
                    <option value="PhD 2018">PhD 2018</option>  
                    <option value="PhD 2019">PhD 2019</option>
                    <option value="PhD 2020">PhD 2020</option>
                    <option value="PhD 2021">PhD 2021</option>
                    <option value="PhD 2022">PhD 2022</option>
                    <option value="PhD 2023">PhD 2023</option>
                    <option value="PhD 2024">PhD 2024</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Tags Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Item Category 
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select item category</option>
                    <option value="ID Card">ID Card</option>
                    <option value="Bag">Bag</option>
                    <option value="Mobile">Mobile Phone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Keys">Keys</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Books">Books</option>
                    <option value="Documents">Documents</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Water Bottle">Water Bottle</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description 
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Please provide detailed description of your found item..."
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Item Image (Optional for Clue )
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 
                    border-2 border-gray-600 border-dashed rounded-lg cursor-pointer 
                    hover:border-green-500 transition-all duration-200">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-400">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      
                    />
                  </label>
                </div>
                {imageError && (
                  <p className="text-red-500 text-sm mt-2">Please upload an image before submitting.</p>
                )}
              </div>

             

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading }
                  className={`px-8 py-3 rounded-lg text-white font-medium 
                    ${loading  
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'} 
                    transition-colors duration-200 flex items-center`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-8 bg-green-900/50 backdrop-blur-sm text-green-200 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Item reported successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload_find