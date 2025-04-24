<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { debounce } from "lodash";
import { API_ENDPOINTS } from "@/constant/apiConstants";
export default {
  name: "SearchPage",
  components: {
    Header,
    Footer,
  },
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      minPrice: null,
      maxPrice: null,
      priceRange: null,
      searchQuery: "",
      searchResults: [],
      isLoading: false,

      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số lượng phòng hiển thị trên mỗi trang
      totalResults: 0, // Tổng số phòng tìm được
    };
  },
  created() {
    const state = window.history.state || {};
    this.searchQuery = state.searchQuery || "";
    if (this.searchQuery) {
      this.fetchSearchRoomData();
    }

    this.debounceSearch = debounce(() => {
      this.fetchSearchRoomData();
    }, 300); // 300ms delay
  },
  watch: {
    searchQuery(newQuery) {
      this.internalSearchQuery = newQuery;
      this.debounceSearch();
    },
    priceRange(newRange) {
      this.fetchSearchRoomData(); // Fetch lại khi thay đổi khoảng giá
    },
  },
  computed: {
    // Lấy danh sách các phòng tương ứng với trang hiện tại
    paginatedResults() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.searchResults.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.totalResults / this.itemsPerPage); // Số trang tổng cộng
    },
  },
  methods: {
    async fetchSearchRoomData() {
      this.isLoading = true;
      try {
        const requestData = {
          location: this.searchQuery || "",
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
        };

        if (this.priceRange === "1") {
          requestData.maxPrice = 500000;
        } else if (this.priceRange === "2") {
          requestData.minPrice = 500000;
          requestData.maxPrice = 1000000;
        } else if (this.priceRange === "3") {
          requestData.minPrice = 1000000;
          requestData.maxPrice = 3000000;
        } else if (this.priceRange === "4") {
          requestData.minPrice = 3000000;
          requestData.maxPrice = 5000000;
        } else if (this.priceRange === "5") {
          requestData.minPrice = 5000000;
          requestData.maxPrice = 10000000;
        } else if (this.priceRange === "6") {
          requestData.minPrice = 10000000;
        }

        const response = await fetch(`${API_ENDPOINTS.R_SEARCH}`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(
            `Search API error: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();
        this.searchResults = result.data || [];
        this.totalResults = result.totalResults || this.searchResults.length; // Cập nhật tổng số kết quả
      } catch (error) {
        console.error("Fetch error: ", error);
        this.searchResults = [];
      } finally {
        this.isLoading = false;
      }
    },
    formatPrice(price) {
      if (!price && price !== 0) return "0";
      return Number(price).toLocaleString("vi-VN");
    },
    goToDetail(id) {
      this.$router.push(`/detail/${id}`);
    },
    // Di chuyển đến trang kế tiếp
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    // Di chuyển về trang trước
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<template>
  <Header />
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-3">
        <div class="searchAdvance">
          <!-- <p class="m-0 fw-bold fs-4">Tìm</p> -->
          <p class="p-0 m-0 fs-6 fw-bold">Name of property/destination:</p>
          <input
            style="width: 100%"
            type="text"
            v-model="searchQuery"
            placeholder="Enter location..."
            @input="debounceSearch"
            @keypress.enter="fetchSearchRoomData"
          />

          <p class="p-0 m-0 fs-6 fw-bold">Price range:</p>
          <div class="d-flex flex-column">
            <label>
              <input type="radio" v-model="priceRange" value="0" />
              All
            </label>
            <label>
              <input type="radio" v-model="priceRange" value="1" />
              Under 500.000
            </label>
            <label>
              <input type="radio" v-model="priceRange" value="2" />
              500.000 - 1.000.000
            </label>
            <label>
              <input type="radio" v-model="priceRange" value="3" />
              1.000.000 - 3.000.000
            </label>
            <label>
              <input type="radio" v-model="priceRange" value="4" />
              3.000.000 - 5.000.000
            </label>
            <label>
              <input type="radio" v-model="priceRange" value="5" />
              5.000.000 - 10.000.000
            </label>
            <label>
              <input type="radio" v-model="priceRange" value="6" />
              Over 10.000.000
            </label>
          </div>
        </div>
      </div>
      <div class="col-md-9" v-if="!isLoading">
        <div v-if="searchResults.length">
          <h5 class="pt-3 pb-3">Found: {{ searchResults.length }} place</h5>

          <!-- list room -->
          <div
            v-for="result in paginatedResults"
            :key="result.room_id"
            class="searchList mb-2 shadow-sm"
          >
            <div class="row g-0">
              <!-- Phần hình ảnh -->
              <div class="col-md-4">
                <img
                  class="img-fluid rounded-start"
                  :src="
                    result.thumbnail || 'https://i.ibb.co/6w0fNhd/FF7D77.png'
                  "
                  alt="Room thumbnail"
                  style="
                    object-fit: cover;
                    height: 100%;
                    width: 70%;
                    max-height: 120px;
                  "
                />
              </div>

              <!-- Phần thông tin -->
              <div class="col-md-8 p-2">
                <h5 class="mb-1 room-title">{{ result.room_number }}</h5>

                <!-- Giá và nút chi tiết được đẩy lên -->
                <div
                  class="d-flex justify-content-between align-items-center mb-2"
                >
                  <p class="price mb-0">
                    VND {{ formatPrice(result.price_per_night) }} / đêm
                  </p>
                  <button
                    class="detail_btn"
                    @click="goToDetail(result.room_id)"
                  >
                    View details
                  </button>
                </div>

                <!-- Vị trí -->
                <p class="location mb-0">
                  <img
                    style="
                      height: 1em;
                      vertical-align: middle;
                      margin-right: 5px;
                    "
                    src="@/assets/icons/location.png"
                    alt="Location icon"
                  />
                  {{ result.location }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="pagination d-flex justify-content-center align-items-center gap-2"
          >
            <button
              class="detail_btn"
              @click="prevPage"
              :disabled="currentPage === 1"
            >
              Prev
            </button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="detail_btn"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </div>
        <div v-else-if="searchQuery" class="no-results">
          No results were found!
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.searchAdvance {
  padding: 15px;
  border-radius: 8px;
  background-color: #d8cbc4;
}
.searchAdvance input {
  border: 1px solid #765341;
  border-radius: 5px;
  padding: 8px;
}

.searchList {
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  /* Thu nhỏ chiều cao tổng thể của card */
  max-height: 140px;
}

.searchList:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1) !important;
}

.room-title {
  color: #333;
  font-weight: 600;
  font-size: 1.1rem; /* Thu nhỏ font tiêu đề */
}

.location {
  color: #666;
  font-size: 0.85rem; /* Thu nhỏ font vị trí */
}

.price {
  color: #d32f2f;
  font-weight: 600;
  font-size: 0.95rem; /* Thu nhỏ font giá */
}

.detail_btn {
  padding: 6px 12px; /* Thu nhỏ nút */
  border-radius: 5px;
  font-size: 0.85rem; /* Thu nhỏ font nút */
  background-color: #765341;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.detail_btn:hover {
  background-color: #5a3e2e;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
