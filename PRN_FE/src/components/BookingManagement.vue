<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";

export default {
  name: "BookingManagement",
  data() {
    return {
      list_booking: [],
    };
  },
  mounted() {
    this.fetchMyBookings(); 
  },
  methods: {
    async confirmBooking(bookingId) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      if (!confirm("Bạn có chắc chắn muốn xác nhận booking này?")) {
        return; 
      }
      try {
        const response = await fetch(
          `${API_ENDPOINTS.CONFIRM_BOOKING}${bookingId}`,
          {
            method: "POST",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`, // Giữ token nếu API yêu cầu
            },
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi xác nhận booking.");
        }

        this.$message.success("Đã xác nhận booking thành công!");
        await this.fetchMyBookings(); // Gọi lại hàm lấy danh sách booking
      } catch (error) {
        this.$message.error("Không thể xác nhận booking.");
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
          `${API_ENDPOINTS.CANCEL_BOOKING}${bookingId}`,
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
        this.$message.error("Không thể hủy booking.");
      }
    },
    async checkIn(bookingId) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const response = await fetch(`${API_ENDPOINTS.CHECK_IN}${bookingId}`, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`, // Giữ token nếu API yêu cầu
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi hủy booking.");
        }

        this.$message.success("Đã check in thành công!");
        await this.fetchMyBookings(); // Gọi lại hàm lấy danh sách booking
      } catch (error) {
        this.$message.error("Không thể check in.");
      }
    },
    async checkOut(bookingId) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const response = await fetch(`${API_ENDPOINTS.CHECK_OUT}${bookingId}`, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`, // Giữ token nếu API yêu cầu
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi hủy booking.");
        }

        this.$message.success("Đã check out thành công!");
        await this.fetchMyBookings(); // Gọi lại hàm lấy danh sách booking
      } catch (error) {
        this.$message.error("Không thể check out.");
      }
    },
    async fetchMyBookings() {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      if (!token) {
        this.$message.error("Không tìm thấy token, vui lòng đăng nhập.");
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.GET_LIST_BOOKING}`, {
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
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Fetch bookings error: ", error);
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
    formatDateTime(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24-hour format
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
    <p>There are no reservations yet</p>
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
        <div>
          <span class="fw-bold fs-6 room_user">
            <img src="@/assets/icons/user.png" alt="User icon" />
            {{ result.username }}
          </span>
        </div>
        <!-- Giá và nút chi tiết -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <p class="price mb-0">VND {{ formatPrice(result.price) }}</p>
          <!-- Trạng thái đặt phòng với background ôm sát text -->
          <!-- <span class="booking-status">{{ result.booking_status }}</span> -->
          <span
            class="booking-status"
            :class="{
              'status-pending': result.booking_status === 'Pending',
              'status-cancelled': result.booking_status === 'Cancelled',
              'status-confirmed': result.booking_status === 'Confirmed',
            }"
            >{{ result.booking_status }}</span
          >
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
            {{
              result.check_in != null
                ? formatDateTime(result.check_in)
                : "Not yet"
            }}
          </p>
          <p class="location mb-0">
            <img
              style="height: 1em; vertical-align: middle; margin-right: 5px"
              src="@/assets/icons/clock.png"
              alt="Location icon"
            />
            Check out:
            {{
              result.check_out != null
                ? formatDateTime(result.check_out)
                : "Not yet"
            }}
          </p>
        </div>
        <div class="mt-2 d-flex gap-2">
          <!-- Nút Hủy Booking -->
          <button
            v-if="result.booking_status === 'Pending'"
            class="btn btn-danger btn-sm"
            @click="cancelBooking(result.booking_id)"
          >
            Cancel Booking
          </button>
          <!-- Nút Confirm Booking -->
          <button
            v-if="result.booking_status === 'Pending'"
            class="btn btn-success btn-sm"
            @click="confirmBooking(result.booking_id)"
          >
            Confirm Booking
          </button>
          <!-- Nút Check In -->
          <button
            v-if="result.booking_status === 'Confirmed' && !result.check_in"
            class="btn btn-primary btn-sm"
            @click="checkIn(result.booking_id)"
          >
            Check In
          </button>
          <!-- Nút Check Out -->
          <button
            v-if="
              result.booking_status === 'Confirmed' &&
              result.check_in &&
              !result.check_out
            "
            class="btn btn-warning btn-sm"
            @click="checkOut(result.booking_id)"
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.room_user img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: grayscale(100%) opacity(0.6);
}
.booking-status {
  padding: 2px 8px; /* Thêm padding để trạng thái trông gọn gàng hơn */
  border-radius: 4px; /* Bo góc nhẹ */
  font-weight: bold; /* Tùy chọn: làm chữ đậm hơn */
}

/* Màu xám cho Pending */
.status-pending {
  background-color: #e0e0e0; /* Màu nền xám nhạt */
  color: #616161; /* Màu chữ xám đậm */
}

/* Màu đỏ cho Cancelled */
.status-cancelled {
  background-color: #ffebee; /* Màu nền đỏ nhạt */
  color: #d32f2f; /* Màu chữ đỏ đậm */
}

/* Màu xanh cho Confirmed */
.status-confirmed {
  background-color: #e8f5e9; /* Màu nền xanh nhạt */
  color: #2e7d32; /* Màu chữ xanh đậm */
}
</style>
