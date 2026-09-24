import { apiClient, USE_MOCK, mockDelay } from "./client";
import { getMockDB } from "./mockData";

export const medicineApi = {
  async getMedicines(params = {}) {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      let list = [...db.medicines];

      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        list = list.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.genericName.toLowerCase().includes(q) ||
            (m.brandName && m.brandName.toLowerCase().includes(q)) ||
            m.category.toLowerCase().includes(q)
        );
      }

      if (params.category && params.category !== "All") {
        list = list.filter((m) => m.category === params.category);
      }

      if (params.pharmacyId && params.pharmacyId !== "All") {
        list = list.filter((m) => m.pharmacyId === params.pharmacyId);
      }

      if (params.stockStatus && params.stockStatus !== "All") {
        list = list.filter((m) => m.stockStatus === params.stockStatus);
      }

      if (params.sortBy) {
        switch (params.sortBy) {
          case "price-asc":
            list.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            list.sort((a, b) => b.price - a.price);
            break;
          case "name-asc":
            list.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "rating-desc":
            list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          default:
            break;
        }
      }

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 9;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedItems = list.slice(startIndex, startIndex + limit);

      return {
        data: paginatedItems,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }

    const response = await apiClient.get("/medicines", { params });
    return response.data;
  },

  async getMedicineById(id) {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      const medicine = db.medicines.find((m) => m.id === id);
      if (!medicine) throw new Error("Medicine not found");

      const otherPharmaciesStock = db.medicines
        .filter(
          (m) =>
            m.genericName.toLowerCase() === medicine.genericName.toLowerCase() &&
            m.id !== medicine.id
        )
        .map((m) => ({
          medicineId: m.id,
          pharmacyId: m.pharmacyId,
          pharmacyName: m.pharmacyName,
          pharmacyAddress: m.pharmacyAddress,
          distance: m.distance,
          price: m.price,
          stockStatus: m.stockStatus,
          stockQuantity: m.stockQuantity,
          rating: m.rating || 4.8
        }));

      const related = db.medicines
        .filter((m) => m.category === medicine.category && m.id !== medicine.id)
        .slice(0, 4);

      return {
        ...medicine,
        otherPharmaciesStock,
        relatedMedicines: related,
      };
    }

    const response = await apiClient.get(`/medicines/${id}`);
    return response.data;
  },

  async getCategories() {
    if (USE_MOCK) {
      const db = getMockDB();
      return db.categories;
    }
    const response = await apiClient.get("/medicines/categories");
    return response.data;
  },
};
