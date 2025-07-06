// src/context/UserProfileContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {getUserProfile} from "../services/userService";
const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (profile) {
        return;
      }
  
      try {
        const res = await getUserProfile();
        setProfile(res.data);
      } catch (error) {
        console.error("User not found. Creating new profile...");
        try {
          const defaultProfile = {
            firstName: "User",
            lastName: "",
            email: "abc@xyz.com",
            phoneNumber: "",
            dateOfBirth: "",
            address: "",
          };
          const created = await createUserProfile(defaultProfile);
          setProfile(created.data);
        } catch (createErr) {
          console.error("Failed to create profile:", createErr);
        }
      }
    };
  
    fetchProfile();
  }, []);
  return (
    <UserProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => useContext(UserProfileContext);
