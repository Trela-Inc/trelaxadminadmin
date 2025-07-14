# 🔗 Masters & Projects Integration Guide

## 📋 Overview

The Projects module now uses Master Field IDs instead of free text for cities, locations, and amenities. This ensures data consistency and provides centralized management of dropdown options.

## 🎯 **Integration Flow**

### **Step 1: Setup Master Data**
Before creating projects, you need to set up master data for cities, locations, and amenities.

### **Step 2: Get Master Field IDs**
When creating projects, fetch the available options and use their IDs.

### **Step 3: Create Projects**
Use the master field IDs in your project creation requests.

### **Step 4: Fetch Projects**
The API automatically populates master field data in responses.

---

## 🔧 **Complete Workflow Example**

### **1. Login and Get JWT Token**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@trelax.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### **2. Get Available Cities**
```bash
curl -X GET http://localhost:3000/api/v1/masters/cities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fieldType": "city",
      "name": "Mumbai",
      "sortOrder": 1,
      "isDefault": true
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "fieldType": "city", 
      "name": "Pune",
      "sortOrder": 2,
      "isDefault": false
    }
  ]
}
```

### **3. Get Locations for Selected City**
```bash
curl -X GET http://localhost:3000/api/v1/masters/locations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "fieldType": "location",
      "name": "Bandra West",
      "sortOrder": 1,
      "parentId": "507f1f77bcf86cd799439011"
    },
    {
      "_id": "507f1f77bcf86cd799439022",
      "fieldType": "location",
      "name": "Andheri East", 
      "sortOrder": 2,
      "parentId": "507f1f77bcf86cd799439011"
    }
  ]
}
```

### **4. Get Available Amenities**
```bash
curl -X GET http://localhost:3000/api/v1/masters/amenities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439031",
      "fieldType": "amenity",
      "name": "Swimming Pool",
      "description": "Olympic size swimming pool",
      "sortOrder": 1,
      "isDefault": true
    },
    {
      "_id": "507f1f77bcf86cd799439032",
      "fieldType": "amenity",
      "name": "Gymnasium",
      "description": "Fully equipped modern gymnasium", 
      "sortOrder": 2,
      "isDefault": true
    }
  ]
}
```

### **5. Create Project Using Master Field IDs**
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Luxury Heights Residency",
    "projectDescription": "Premium residential project with modern amenities",
    "builder": {
      "name": "ABC Constructions"
    },
    "projectStatus": "under_construction",
    "location": {
      "address": "123 Main Street, Bandra West",
      "cityId": "507f1f77bcf86cd799439011",
      "locationId": "507f1f77bcf86cd799439021",
      "state": "Maharashtra",
      "country": "India",
      "pincode": "400050"
    },
    "propertyType": "residential",
    "unitConfigurations": [
      {
        "type": "apartment",
        "name": "2 BHK",
        "bedrooms": 2,
        "bathrooms": 2,
        "carpetArea": 1000,
        "priceMin": 5000000,
        "priceMax": 8000000
      }
    ],
    "amenities": {
      "amenityIds": [
        "507f1f77bcf86cd799439031",
        "507f1f77bcf86cd799439032"
      ]
    }
  }'
```

### **6. Get Project with Populated Master Data**
```bash
curl -X GET http://localhost:3000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (with populated master data):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439041",
    "projectName": "Luxury Heights Residency",
    "location": {
      "address": "123 Main Street, Bandra West",
      "cityId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Mumbai",
        "fieldType": "city"
      },
      "locationId": {
        "_id": "507f1f77bcf86cd799439021",
        "name": "Bandra West", 
        "fieldType": "location"
      },
      "state": "Maharashtra",
      "country": "India"
    },
    "amenities": {
      "amenityIds": [
        {
          "_id": "507f1f77bcf86cd799439031",
          "name": "Swimming Pool",
          "fieldType": "amenity",
          "description": "Olympic size swimming pool"
        },
        {
          "_id": "507f1f77bcf86cd799439032", 
          "name": "Gymnasium",
          "fieldType": "amenity",
          "description": "Fully equipped modern gymnasium"
        }
      ]
    }
  }
}
```

---

## 🎨 **Frontend Integration Example**

### **React Component Example:**
```javascript
import React, { useState, useEffect } from 'react';

const ProjectForm = () => {
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Load master data on component mount
  useEffect(() => {
    loadCities();
    loadAmenities();
  }, []);

  // Load locations when city changes
  useEffect(() => {
    if (selectedCity) {
      loadLocations(selectedCity);
    }
  }, [selectedCity]);

  const loadCities = async () => {
    const response = await fetch('/api/v1/masters/cities', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setCities(data.data);
  };

  const loadLocations = async (cityId) => {
    const response = await fetch(`/api/v1/masters/locations/${cityId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setLocations(data.data);
  };

  const loadAmenities = async () => {
    const response = await fetch('/api/v1/masters/amenities', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setAmenities(data.data);
  };

  const handleSubmit = async (formData) => {
    const projectData = {
      ...formData,
      location: {
        ...formData.location,
        cityId: selectedCity,
        locationId: selectedLocation
      },
      amenities: {
        amenityIds: selectedAmenities
      }
    };

    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* City Dropdown */}
      <select 
        value={selectedCity} 
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city._id} value={city._id}>
            {city.name}
          </option>
        ))}
      </select>

      {/* Location Dropdown */}
      <select 
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        disabled={!selectedCity}
      >
        <option value="">Select Location</option>
        {locations.map(location => (
          <option key={location._id} value={location._id}>
            {location.name}
          </option>
        ))}
      </select>

      {/* Amenities Multi-select */}
      <div>
        <h4>Select Amenities:</h4>
        {amenities.map(amenity => (
          <label key={amenity._id}>
            <input
              type="checkbox"
              value={amenity._id}
              checked={selectedAmenities.includes(amenity._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAmenities([...selectedAmenities, amenity._id]);
                } else {
                  setSelectedAmenities(selectedAmenities.filter(id => id !== amenity._id));
                }
              }}
            />
            {amenity.name}
          </label>
        ))}
      </div>

      <button type="submit">Create Project</button>
    </form>
  );
};
```

---

## ✅ **Benefits of Master Data Integration**

### **1. Data Consistency**
- No duplicate city names with different spellings
- Standardized amenity names across all projects
- Consistent location hierarchy

### **2. Centralized Management**
- Add new cities/locations/amenities from one place
- Update names and descriptions centrally
- Deactivate outdated options

### **3. Better User Experience**
- Dropdown options load faster
- Consistent UI across forms
- Easy search and filtering

### **4. Data Integrity**
- Foreign key relationships ensure valid references
- Automatic validation of master field IDs
- Prevents orphaned data

### **5. Reporting & Analytics**
- Accurate project counts by city/location
- Amenity popularity analysis
- Location-based market insights

---

## 🔧 **Admin Workflow**

### **1. Setup Master Data (One-time)**
1. Create cities using `/api/v1/masters` with `fieldType: "city"`
2. Create locations using `/api/v1/masters` with `fieldType: "location"` and `parentId`
3. Create amenities using `/api/v1/masters` with `fieldType: "amenity"`

### **2. Project Creation Workflow**
1. Frontend loads dropdown options from masters APIs
2. User selects city → locations load for that city
3. User selects location and amenities
4. Form submits with master field IDs
5. Backend validates IDs and creates project
6. Response includes populated master data

### **3. Project Display**
1. Frontend fetches projects from `/api/v1/projects`
2. Response includes populated city, location, and amenity names
3. No additional API calls needed for display

This integration ensures your real estate platform has consistent, manageable, and scalable master data! 🎯
