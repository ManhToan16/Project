<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";

export default {
  name: "ManagePlace",
  data() {
    return {
      form: {
        room_id: null,
        room_number: "",
        price_per_night: "",
        description: "",
        location: "",
        num_beds: "",
        num_bathrooms: "",
        thumbnail: "",
      },
      list_room: [],
    };
  },
  async created() {
    await this.fetchRoomOwner();
  },
  methods: {
    async fetchRoomOwner() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$message.error("No authorization token found. Please log in.");
        return;
      }
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_ROOM_OWNER}`, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const result = await response.json();
        this.list_room = result.data || [];
        console.log("Rooms fetched:", this.list_room); // Debug dữ liệu
      } catch (error) {
        console.error("Fetch room error: ", error);
        this.list_room = [];
        this.$message.error("Failed to fetch rooms: " + error.message);
      }
    },
    // Hàm định dạng giá tiền
    formatPrice(price) {
      if (!price) return "0";
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    // Hàm điều hướng đến trang chi tiết
    goToDetail(roomId) {
      this.$router.push(`/update/${roomId}`); // Giả sử route là /details/:id
    },
  },
};
</script>

<template>
  <div>
    <div v-if="list_room.length">
      <h5 class="pt-3 pb-3">Bạn có: {{ list_room.length }} chỗ nghỉ</h5>
    </div>
    <div v-else>
      <p>Không tìm thấy chỗ nghỉ nào.</p>
    </div>

    <!-- List room -->
    <div
      v-for="result in list_room"
      :key="result.room_id"
      class="searchList mb-2 shadow-sm"
    >
      <div class="row g-0">
        <!-- Phần hình ảnh -->
        <div class="col-md-4">
          <img
            class="img-fluid rounded-start"
            :src="result.thumbnail || 'https://i.ibb.co/6w0fNhd/FF7D77.png'"
            alt="Room thumbnail"
            style="object-fit: cover; height: 100%; width: 70%"
          />
        </div>

        <!-- Phần thông tin -->
        <div class="col-md-8 p-2">
          <h5 class="mb-1 room-title">{{ result.room_number }}</h5>

          <!-- Giá và nút chi tiết -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <p class="price mb-0">
              VND {{ formatPrice(result.price_per_night) }} / đêm
            </p>
            <button class="detail_btn" @click="goToDetail(result.room_id)">
              Cập nhật
            </button>
          </div>

          <!-- Vị trí -->
          <p class="location mb-0">
            <img
              style="height: 1em; vertical-align: middle; margin-right: 5px"
              src="@/assets/icons/location.png"
              alt="Location icon"
            />
            {{ result.location }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tùy chọn: Thêm CSS để định dạng */
.searchList {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.room-title {
  font-size: 1.2em;
  font-weight: bold;
}

.price {
  color: #ff5733;
  font-weight: bold;
}

.detail_btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.detail_btn:hover {
  background-color: #0056b3;
}
</style>
