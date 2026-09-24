import { apiClient, USE_MOCK, mockDelay } from "./client";
import { getMockDB, saveMockDB } from "./mockData";

export const authApi = {
  async login(email, password, roleHint = "user") {
    if (USE_MOCK) {
      await mockDelay(300);
      const db = getMockDB();
      const user = db.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || {
        id: `user-${Date.now()}`,
        name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        email,
        role: roleHint,
        phone: "+1 (555) 000-0000",
        address: "123 Health Ave, Metro City",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0]
      };

      const token = `mock-jwt-token-${user.id}-${Date.now()}`;
      return { success: true, user, token, message: "Login successful" };
    }
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  async register(formData) {
    if (USE_MOCK) {
      await mockDelay(400);
      const db = getMockDB();
      let pharmacyId = null;

      if (formData.role === "pharmacy") {
        pharmacyId = `pharm-${Date.now()}`;
        const newPharm = {
          id: pharmacyId,
          name: formData.pharmacyName || `${formData.name}'s Medical Store`,
          email: formData.email,
          phone: formData.phone || "+1 (555) 000-0000",
          address: formData.address || "100 MediGo Way",
          city: formData.city || "Metro City",
          state: "NY",
          zip: "10001",
          rating: 5.0,
          reviewsCount: 1,
          hours: "08:00 AM - 10:00 PM",
          distance: "1.2 km away",
          status: "Active",
          verified: true,
          licenseNumber: formData.licenseNumber || "RX-PENDING-001",
          joinedDate: new Date().toISOString().split("T")[0],
          pharmacistName: formData.name,
          image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800"
        };
        db.pharmacies.push(newPharm);
        saveMockDB("pharmacies", db.pharmacies);
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role || "user",
        phone: formData.phone || "",
        address: formData.address || "",
        pharmacyId: pharmacyId,
        pharmacyName: formData.pharmacyName,
        avatar: formData.role === "pharmacy"
          ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0]
      };

      db.users.push(newUser);
      saveMockDB("users", db.users);
      const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
      return { success: true, user: newUser, token, message: "Account created successfully" };
    }
    const response = await apiClient.post("/auth/register", formData);
    return response.data;
  },

  async getCurrentUser() {
    if (USE_MOCK) {
      const stored = localStorage.getItem("medigo_user");
      return stored ? JSON.parse(stored) : null;
    }
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  async updateProfile(userId, profileData) {
    if (USE_MOCK) {
      await mockDelay(300);
      const db = getMockDB();
      const index = db.users.findIndex((u) => u.id === userId);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...profileData };
        saveMockDB("users", db.users);
        localStorage.setItem("medigo_user", JSON.stringify(db.users[index]));
        return db.users[index];
      }
      return profileData;
    }
    const response = await apiClient.put("/auth/profile", profileData);
    return response.data;
  }
};
