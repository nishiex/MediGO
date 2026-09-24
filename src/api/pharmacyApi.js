import { apiClient, USE_MOCK, mockDelay } from "./client";
import { getMockDB, saveMockDB } from "./mockData";

export const pharmacyApi = {
  async getDashboardStats(pharmacyId = "pharm-1") {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      const medicines = db.medicines.filter((m) => m.pharmacyId === pharmacyId);
      const reservations = db.reservations.filter((r) => r.pharmacyId === pharmacyId);

      const totalMedicines = medicines.length;
      const lowStockCount = medicines.filter((m) => m.stockStatus === "Low Stock" || m.stockQuantity < 10).length;
      const outOfStockCount = medicines.filter((m) => m.stockStatus === "Out of Stock" || m.stockQuantity === 0).length;
      const pendingReservations = reservations.filter((r) => r.status === "Pending").length;
      const confirmedReservations = reservations.filter((r) => r.status === "Confirmed").length;
      const collectedReservations = reservations.filter((r) => r.status === "Collected").length;
      const totalRevenue = reservations
        .filter((r) => r.status === "Collected" || r.status === "Confirmed")
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      const weeklyTrends = [
        { day: "Mon", reservations: 12, collected: 10, revenue: 240 },
        { day: "Tue", reservations: 19, collected: 15, revenue: 380 },
        { day: "Wed", reservations: 15, collected: 14, revenue: 290 },
        { day: "Thu", reservations: 22, collected: 18, revenue: 450 },
        { day: "Fri", reservations: 28, collected: 24, revenue: 610 },
        { day: "Sat", reservations: 35, collected: 30, revenue: 780 },
        { day: "Sun", reservations: 18, collected: 16, revenue: 390 }
      ];

      const stockDistribution = [
        { name: "In Stock", value: medicines.filter(m => m.stockStatus === "In Stock").length || 6, fill: "#10b981" },
        { name: "Low Stock", value: lowStockCount || 2, fill: "#f59e0b" },
        { name: "Out of Stock", value: outOfStockCount || 1, fill: "#ef4444" }
      ];

      return {
        totalMedicines,
        lowStockCount,
        outOfStockCount,
        pendingReservations,
        confirmedReservations,
        collectedReservations,
        totalRevenue,
        weeklyTrends,
        stockDistribution,
        recentReservations: reservations.slice(0, 5),
        lowStockAlerts: medicines.filter((m) => m.stockQuantity <= 10)
      };
    }
    const response = await apiClient.get("/pharmacy/dashboard");
    return response.data;
  },

  async getPharmacyMedicines(pharmacyId = "pharm-1") {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.medicines.filter((m) => m.pharmacyId === pharmacyId);
    }
    const response = await apiClient.get("/pharmacy/medicines");
    return response.data;
  },

  async addMedicine(medicineData) {
    if (USE_MOCK) {
      await mockDelay(300);
      const db = getMockDB();
      let stockStatus = "In Stock";
      const stock = Number(medicineData.stockQuantity) || 0;
      if (stock === 0) stockStatus = "Out of Stock";
      else if (stock <= 10) stockStatus = "Low Stock";

      const newMed = {
        id: `med-${Date.now()}`,
        name: medicineData.name,
        genericName: medicineData.genericName || medicineData.name,
        brandName: medicineData.brandName || "",
        category: medicineData.category || "General",
        dosageForm: medicineData.dosageForm || "Tablet",
        strength: medicineData.strength || "500 mg",
        manufacturer: medicineData.manufacturer || "Generic Pharma",
        price: Number(medicineData.price) || 10.0,
        prescriptionRequired: Boolean(medicineData.prescriptionRequired),
        image: medicineData.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
        description: medicineData.description || "Healthcare medication.",
        usage: medicineData.usage || "Take as directed by doctor.",
        sideEffects: medicineData.sideEffects || "Consult physician if adverse symptoms occur.",
        pharmacyId: medicineData.pharmacyId || "pharm-1",
        pharmacyName: medicineData.pharmacyName || "Apex City Central Medical Store",
        pharmacyAddress: medicineData.pharmacyAddress || "742 Evergreen Blvd, Suite 100",
        distance: "0.8 km",
        stockQuantity: stock,
        stockStatus: stockStatus,
        expiryDate: medicineData.expiryDate || "2027-12-31",
        rating: 5.0,
        reviewsCount: 0
      };

      db.medicines.unshift(newMed);
      saveMockDB("medicines", db.medicines);
      return newMed;
    }
    const response = await apiClient.post("/pharmacy/medicines", medicineData);
    return response.data;
  },

  async updateMedicine(id, medicineData) {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      const index = db.medicines.findIndex((m) => m.id === id);
      if (index !== -1) {
        let stockStatus = db.medicines[index].stockStatus;
        if (medicineData.stockQuantity !== undefined) {
          const stock = Number(medicineData.stockQuantity);
          if (stock === 0) stockStatus = "Out of Stock";
          else if (stock <= 10) stockStatus = "Low Stock";
          else stockStatus = "In Stock";
        }

        db.medicines[index] = { ...db.medicines[index], ...medicineData, stockStatus };
        saveMockDB("medicines", db.medicines);
        return db.medicines[index];
      }
      throw new Error("Medicine not found");
    }
    const response = await apiClient.put(`/pharmacy/medicines/${id}`, medicineData);
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
    const response = await apiClient.delete(`/pharmacy/medicines/${id}`);
    return response.data;
  },

  async getPharmacyReservations(pharmacyId = "pharm-1") {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.reservations.filter((r) => r.pharmacyId === pharmacyId || !r.pharmacyId);
    }
    const response = await apiClient.get("/pharmacy/reservations");
    return response.data;
  },

  async updateReservationStatus(id, status, notes = "") {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      const index = db.reservations.findIndex((r) => r.id === id || r.reservationCode === id);
      if (index !== -1) {
        db.reservations[index].status = status;
        if (status === "Collected") {
          db.reservations[index].collectedAt = new Date().toISOString();
        }
        saveMockDB("reservations", db.reservations);
        return db.reservations[index];
      }
      throw new Error("Reservation not found");
    }
    const response = await apiClient.patch(`/pharmacy/reservations/${id}/status`, { status, notes });
    return response.data;
  }
};
