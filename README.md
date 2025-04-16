# NITJ Lost & Found Portal

<div align="center">
  <img src="/public/logo_250.png" alt="NITJ Logo" width="120"/>
  <h3>A Digital Solution for Lost & Found Items at NIT Jalandhar</h3>
</div>

## 🌟 Overview

The NITJ Lost & Found Portal is a web application designed to streamline the process of reporting and finding lost items within the NIT Jalandhar campus. It provides a user-friendly interface for students and staff to report lost items and post found items, making the recovery process more efficient.

## 🚀 Features

### For Users
- **Secure Authentication**: Login system integrated with NITJ credentials
- **Report Lost Items**: Easy form submission for lost items with details
- **Report Found Items**: Quick posting of found items
- **Image Upload**: Support for item images to aid identification
- **Real-time Updates**: Instant visibility of new posts
- **Mobile Responsive**: Works seamlessly on all devices

### Item Management
- **Categorized Listings**: Separate sections for lost and found items
- **Search & Filter**: Easy to find specific items
- **Contact Information**: Direct communication between finder and owner
- **Status Tracking**: Track if items are claimed or still available

## 🛠️ Technical Stack

### Frontend
- React.js + Vite for fast development
- Tailwind CSS for modern UI
- React Router for navigation

### Backend Services (Appwrite)
- Authentication
- Database
- File Storage
- Real-time updates

## 💻 Local Development

1. **Clone the repository**
bash
git clone https://github.com/yourusername/nitj-lost-found.git
cd nitj-lost-found
2. **Install dependencies:**
bash
npm install
3. Create a `.env` file in the root directory:
env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_LOST_COLLECTION_ID=your_lost_collection_id
VITE_APPWRITE_FOUND_COLLECTION_ID=your_found_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id

4. Start the development server:
bash
npm run dev


## 🔧 Configuration

### Appwrite Setup
1. Create an Appwrite project
2. Set up collections for:
   - Lost Items
   - Found Items
3. Configure storage bucket for images
4. Set up authentication rules

## 📱 Usage

### Reporting a Lost Item
1. Log in to your account
2. Click on "Report Lost"
3. Fill in the item details:
   - Title
   - Description
   - Last seen location
   - Contact information
   - Upload image (if available)

### Reporting a Found Item
1. Log in to your account
2. Click on "Report Found"
3. Fill in the item details:
   - Title
   - Description
   - Found location
   - Contact information
   - Upload image

## 👥 Contributing

We welcome contributions to improve the NITJ Lost & Found Portal. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NIT Jalandhar for supporting this initiative
- Appwrite team for the backend services
- All contributors who have helped improve this platform

## 📞 Contact

For any queries regarding the portal, please contact:
- Email: nitj@nitj.ac.in
- Phone: +91-181-2690301, 2690453

## 🏛️ Institution

**Dr B R Ambedkar National Institute of Technology Jalandhar**  
G.T Road, Amritsar Bypass, Jalandhar,  
Punjab, India-144027ß

---

<div align="center">
  Made with ❤️ for NITJ Community
</div>

