import React, { useState } from 'react'
import { databases, storage } from '../appwrite'
import { ID } from 'appwrite'

const Upload_find = ({ user }) => {
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
    course: ""
  });
    
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    if (!image) {
      setImageError(true);
      return;
    }
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
        { ...formData, imageUrl, phone: +formData.phone }
      );
      console.log("Document Created:", res);
      alert("Data stored successfully!");
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
        course: ""
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
              <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-2">Report Lost Item</h2>
              <p className="text-sm sm:text-base text-red-500">Help us find your lost belongings

</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { name: "name", label: "Your Name ", type: "text" },
                  { name: "email", label: "Email Address ", type: "email" },
                  { name: "phone", label: "Phone Number (must be 10 digit)", type: "tel" },
                  { name: "title", label: "Item Title ", type: "text" },
                  { name: "color", label: "Item Color ", type: "text" },
                  { name: "location", label: "Found Location ", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.label}
                      <span className="text-red-500">*</span>
                    </label>
                    {(field.name === "name" || field.name === "email") ? (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        disabled = "true"
                        className="w-full px-4 py-2 bg-gray-800/50 border cursor-not-allowed border-gray-600 rounded-lg 
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                          focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                          focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    )}
                  </div>
                ))}

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
                      focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                    <option value="PhD 2021">PhD 2021</option>
                    <option value="PhD 2022">PhD 2022</option>
                    <option value="PhD 2023">PhD 2023</option>
                    <option value="PhD 2024">PhD 2024</option>
                    <option value="Faculty">Faculty</option>
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
                      focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Please provide detailed description of your found item..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Item Image (Optional)
                 
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 
                    border-2 border-gray-600 border-dashed rounded-lg cursor-pointer 
                    hover:border-red-500 transition-all duration-200">
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
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg text-white font-medium 
                    ${loading 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'} 
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
          <div className="mt-8 bg-red-900/50 backdrop-blur-sm text-red-200 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Item reported successfully! We'll notify you if found.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload_find;