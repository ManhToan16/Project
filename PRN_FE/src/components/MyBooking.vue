<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";

export default {
  name: "MyBooking",
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
      list_booking: [],
    };
  },
  mounted() {
    this.fetchMyBookings(); // Gọi API khi component được tải
  },
  methods: {
    async fetchMyBookings() {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      if (!token) {
        this.$message.error("Không tìm thấy token, vui lòng đăng nhập.");
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.MY_BOOKING}`, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách đặt phòng.");
        }

        const result = await response.json();
        console.log("API Response:", result); // Kiểm tra dữ liệu API trả về

        this.list_booking = Array.isArray(result) ? result : result.data;
      } catch (error) {
        console.error("Fetch bookings error: ", error);
      }
    },

    async cancelBooking(bookingId) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      if (!confirm("Bạn có chắc chắn muốn hủy booking này?")) {
        return; // Hủy thao tác nếu người dùng không xác nhận
      }
      try {
        const response = await fetch(
          `${API_ENDPOINTS.CANCEL_BOOKING}${bookingId}`, // Sửa endpoint theo cURL
          {
            method: "POST",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`, // Giữ token nếu API yêu cầu
            },
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi hủy booking.");
        }

        this.$message.success("Đã hủy booking thành công!");
        await this.fetchMyBookings(); // Gọi lại hàm lấy danh sách booking
      } catch (error) {
        console.error("Cancel booking error: ", error);
        this.$message.error("Không thể hủy booking.");
      }
    },
    formatPrice(price) {
      // Định dạng giá tiền, ví dụ: thêm dấu phân cách hàng nghìn
      return price
        ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "0";
    },
    getThumbnailUrl(thumbnail) {
      // Chuyển đổi Base64 thành Data URL
      if (thumbnail) {
        return `data:image/jpeg;base64,${thumbnail}`; // Giả sử định dạng là JPEG, thay đổi nếu cần
      }
      return "https://i.ibb.co/6w0fNhd/FF7D77.png"; // Ảnh mặc định nếu thumbnail rỗng
    },
    // Hàm định dạng ngày thành dd/MM/yyyy
    formatDate(dateString) {
      if (!dateString) return "N/A"; // Kiểm tra nếu không có dữ liệu

      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    },
  },
};
</script>

<template>
  <div v-if="list_booking.length">
    <!-- <h5 class="pt-3 pb-3">Bạn có: {{ list_booking.length }} chỗ nghỉ</h5> -->
  </div>
  <div v-else class="d-flex justify-content-center">
    <p>Không tìm thấy chỗ nghỉ nào.</p>
  </div>
  <!-- List room -->
  <div
    v-for="result in list_booking"
    :key="result.room_id"
    class="searchList mb-3 shadow"
  >
    <div class="row g-0">
      <!-- Phần hình ảnh -->
      <div class="col-md-4">
        <img
          class="img-fluid rounded-start"
          :src="getThumbnailUrl(result.thumbnail)"
          alt="Room thumbnail"
          style="object-fit: cover; height: 100%; width: 70%"
        />
      </div>

      <!-- Phần thông tin -->
      <div class="col-md-8 p-2">
        <h5 class="mb-1 room-title">{{ result.room_number }}</h5>
        <div>
          <span class="fw-bold fs-4">
            {{ result.room_title }}
          </span>
        </div>
        <!-- Giá và nút chi tiết -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <p class="price mb-0">VND {{ formatPrice(result.price) }}</p>
          <!-- Trạng thái đặt phòng với background ôm sát text -->
          <span class="booking-status">{{ result.booking_status }}</span>
          <!-- <button class="detail_btn" @click="goToDetail(result.room_id)">
            Cập nhật
          </button> -->
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

        <p class="location mb-0">
          <img
            style="height: 1em; vertical-align: middle; margin-right: 5px"
            src="@/assets/icons/people.png"
            alt="Location icon"
          />
          Total people:
          {{ result.num_adults + result.num_children }} (
          {{ result.num_adults }} adults & {{ result.num_children }} childrens)
        </p>

        <p class="location mb-0">
          <img
            style="height: 1em; vertical-align: middle; margin-right: 5px"
            src="@/assets/icons/calendar.png"
            alt="Location icon"
          />
          {{ formatDate(result.start_date_booking) }} to
          {{ formatDate(result.end_date_booking) }}
        </p>

        <div class="d-flex gap-5">
          <p class="location mb-0">
            <img
              style="height: 1em; vertical-align: middle; margin-right: 5px"
              src="@/assets/icons/clock.png"
              alt="Location icon"
            />
            Check in:
            {{ result.check_in != null ? result.check_in : "Not yet" }}
          </p>
          <p class="location mb-0">
            <img
              style="height: 1em; vertical-align: middle; margin-right: 5px"
              src="@/assets/icons/clock.png"
              alt="Location icon"
            />
            Check out:
            {{ result.check_out != null ? result.check_out : "Not yet" }}
          </p>
        </div>
        <!-- Nút Hủy Booking -->
        <div class="mt-2" v-if="result.booking_status != 'Cancelled'">
          <button
            class="btn btn-danger btn-sm"
            @click="cancelBooking(result.booking_id)"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.price {
  color: #ff5733;
  font-weight: bold;
}
.booking-status {
  background-color: #f0f0f0; /* Màu nền tùy chỉnh */
  padding: 2px 6px; /* Khoảng cách bên trong để trông đẹp hơn */
  border-radius: 4px; /* Bo góc nếu muốn */
  display: inline-block; /* Chỉ chiếm chiều rộng của nội dung */
}
</style>
