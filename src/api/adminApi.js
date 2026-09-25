import { apiClient, USE_MOCK, mockDelay } from "./client";
import { getMockDB, saveMockDB } from "./mockData";

export const adminApi = {
  async getAdminDashboardStats() {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      const totalPharmacies = db.pharmacies.length;
      const totalMedicines = db.medicines.length;
      const totalReservations = db.reservations.length;
      const activePharmacies = db.pharmacies.filter((p) => p.status === "Active").length;
      const pendingPharmacies = db.pharmacies.filter((p) => p.status === "Pending").length;
      const platformVolume = db.reservations
        .filter((r) => r.status === "Collected")
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      const monthlyActivity = [
        { month: "Jan", reservations: 120, volume: 4200 },
        { month: "Feb", reservations: 180, volume: 6100 },
        { month: "Mar", reservations: 240, volume: 8300 },
        { month: "Apr", reservations: 310, volume: 10450 },
        { month: "May", reservations: 420, volume: 14200 },
        { month: "Jun", reservations: 560, volume: 18900 },
      ];

      return {
        stats: {
          totalPharmacies,
          totalMedicines,
          totalReservations,
          platformVolume,
          activePharmacies,
          pendingPharmacies,
          monthlyActivity,
        },
      };
    }
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  async getAllPharmacies() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return { pharmacies: db.pharmacies };
    }
    const response = await apiClient.get("/admin/pharmacies");
    return response.data;
  },

  async updatePharmacyStatus(id, status, verified = true) {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      const index = db.pharmacies.findIndex((p) => p.id === id);
      if (index !== -1) {
        db.pharmacies[index].status = status;
        db.pharmacies[index].verified = verified;
        saveMockDB("pharmacies", db.pharmacies);
        return { success: true, pharmacy: db.pharmacies[index] };
      }
      throw new Error("Pharmacy not found");
    }
    const response = await apiClient.patch(`/admin/pharmacies/${id}`, { status, verified });
    return response.data;
  },

  async getAllMedicines() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return { medicines: db.medicines };
    }
    const response = await apiClient.get("/admin/medicines");
    return response.data;
  },

  async deleteMedicine(id) {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      db.medicines = db.medicines.filter((m) => m.id !== id);
      saveMockDB("medicines", db.medicines);
      return { success: true };
    }
    const response = await apiClient.delete(`/admin/medicines/${id}`);
    return response.data;
  },

  async getAllReservations() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return { reservations: db.reservations };
    }
    const response = await apiClient.get("/admin/reservations");
    return response.data;
  },

  async getAllUsers() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return { users: db.users };
    }
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  async toggleUserStatus(id, status) {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      const index = db.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        db.users[index].status = status;
        saveMockDB("users", db.users);
        return { success: true, user: db.users[index] };
      }
      throw new Error("User not found");
    }
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  }
};

// Backward-compatible aliases (older call sites).
adminApi.getAdminDashboard = adminApi.getAdminDashboardStats;
adminApi.getAdminPharmacies = adminApi.getAllPharmacies;
adminApi.getAdminMedicines = adminApi.getAllMedicines;
adminApi.getAdminReservations = adminApi.getAllReservations;
adminApi.getAdminUsers = adminApi.getAllUsers;
