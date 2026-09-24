import { apiClient, USE_MOCK, mockDelay } from "./client";
import { getMockDB, saveMockDB } from "./mockData";

export const adminApi = {
  async getAdminDashboard() {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      const totalUsers = db.users.length;
      const totalPharmacies = db.pharmacies.length;
      const totalMedicines = db.medicines.length;
      const totalReservations = db.reservations.length;
      const activeReservations = db.reservations.filter((r) => r.status === "Pending" || r.status === "Confirmed").length;
      const completedReservations = db.reservations.filter((r) => r.status === "Collected").length;

      const reservationGrowth = [
        { month: "Jan", reservations: 120 },
        { month: "Feb", reservations: 180 },
        { month: "Mar", reservations: 240 },
        { month: "Apr", reservations: 310 },
        { month: "May", reservations: 420 },
        { month: "Jun", reservations: 560 },
      ];

      const cityDistribution = [
        { city: "Metro City Central", count: 48, percentage: 45 },
        { city: "Oakridge District", count: 28, percentage: 26 },
        { city: "West Plaza Zone", count: 18, percentage: 17 },
        { city: "Lincoln South", count: 13, percentage: 12 },
      ];

      return {
        totalUsers,
        totalPharmacies,
        totalMedicines,
        totalReservations,
        activeReservations,
        completedReservations,
        reservationGrowth,
        cityDistribution,
        recentReservations: db.reservations.slice(0, 6),
        recentPharmacies: db.pharmacies.slice(0, 5),
      };
    }
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  async getAdminPharmacies() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.pharmacies;
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
        return db.pharmacies[index];
      }
      throw new Error("Pharmacy not found");
    }
    const response = await apiClient.patch(`/admin/pharmacies/${id}`, { status, verified });
    return response.data;
  },

  async getAdminMedicines() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.medicines;
    }
    const response = await apiClient.get("/admin/medicines");
    return response.data;
  },

  async getAdminReservations() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.reservations;
    }
    const response = await apiClient.get("/admin/reservations");
    return response.data;
  },

  async getAdminUsers() {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.users;
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
        return db.users[index];
      }
      throw new Error("User not found");
    }
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  }
};
