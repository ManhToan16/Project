<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import Calendar from "./Calendar.vue";
import { format } from "date-fns";

import VueEasyLightbox from "vue-easy-lightbox";
import { API_ENDPOINTS } from "@/constant/apiConstants";

export default {
  name: "Details",
  components: {
    Header,
    Footer,
    Calendar,
    VueEasyLightbox,
  },
  data() {
    return {
      room_id: null,
      visible: false,
      showPopup: false,
      showPaymentPopup: false,
      qrImage: null,
      lightboxIndex: 0,
      search: {
        destination: "",
        checkIn: "",
        checkOut: "",
        guests: 2,
      },
      hotel: {
        name: "",
        address: "",
        images: [],
        amenities: [],
        status: null,
        pricepernight: "199$",
        description: "",
        num_bathrooms: "",
        num_beds: "",
      },
      bookedRanges: [],
      selectedStartDate: null,
      selectedEndDate: null,
      selectedDays: 0,
      num_adults: 0,
      num_childs: 0,
      paymentMethods: [],
      selectedPaymentMethod: "",
      selectedPaymentMethodID: null,
      total_price: null,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1817513153887!2d105.85380007613769!3d21.0254124806231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abeb98f8b54d%3A0x90d6982234a65f25!2sSofitel%20Legend%20Metropole%20Hanoi!5e0!3m2!1sen!2s!4v1740630776600!5m2!1sen!2s",
    };
  },
  async created() {
    this.room_id = this.$route.params.id; // Lấy ID từ URL
    console.log("Room ID:", this.room_id); // Kiểm tra giá trị ID
    await this.fetchRoomFeaturesData();
    await this.fetchRoomData();
    await this.fetchRoomMedia();
    await this.fetchBookedRanges();
    await this.fetchPaymentMethods();
  },
  watch: {
    showPopup(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden"; // Tắt cuộn khi popup mở
      } else {
        document.body.style.overflow = ""; // Khôi phục cuộn khi popup đóng
      }
    },
    showPaymentPopup(newVal) {
      if (newVal || this.showPopup) {
        document.body.style.overflow = "hidden"; // Tắt cuộn khi bất kỳ popup nào mở
      } else if (!newVal && !this.showPopup) {
        document.body.style.overflow = ""; // Khôi phục khi cả hai popup đều đóng
      }
    },
    async selectedDays(newVal) {
      // Theo dõi sự thay đổi của selectedDays
      if (newVal && newVal > 0) {
        // Kiểm tra nếu newVal khác null và lớn hơn 0
        console.log("Selected days changed:", newVal);
        await this.fetchQR(); // Gọi fetchQR khi có số ngày hợp lệ
      }
    },
  },
  methods: {
    showLightbox(index) {
      this.lightboxIndex = index;
      this.visible = true;
    },
    async fetchRoomFeaturesData() {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.FEATURE_BY_ROOM_ID}${this.room_id}`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );
        if (!response.ok) {
          this.$message.error("Fetch features failed");
        }
        const result = await response.json();
        this.hotel.amenities = result.data;
      } catch (error) {
        this.$message.error("Fetch features failed");
      }
    },
    async fetchRoomData() {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_ROOM_BY_ID}${this.room_id}`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );
        if (!response.ok) {
          this.$message.error("Lấy dữ liệu thất bại");
        }
        const result = await response.json();
        console.log("Room Data:", result);
        this.hotel.name = result.data.room.room_number;
        this.hotel.address = result.data.room.location;
        this.hotel.pricepernight = result.data.room.price_per_night;
        this.hotel.description = result.data.room.description;
        this.hotel.status = result.data.room.room_status_id;
        this.hotel.num_bathrooms = result.data.room.num_bathrooms;
        this.hotel.num_beds = result.data.room.num_beds;
        // Kiểm tra và xử lý thumbnail
        this.hotel.images = []; // Khởi tạo mảng rỗng mặc định
        if (result.data.room.thumbnail) {
          // Chỉ thêm nếu thumbnail tồn tại
          this.hotel.images = [result.data.room.thumbnail];
        }
      } catch (error) {
        this.$message.error("Image err");
      }
    },
    async fetchRoomMedia() {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_MEDIA_ROOM}${this.room_id}`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );
        if (!response.ok) {
          this.$message.error("Fetch media failed");
        }
        const result = await response.json();

        // Kiểm tra nếu result.data tồn tại và là mảng
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach((item) => {
            if (item.picture) {
              // Chỉ thêm nếu picture tồn tại
              const imageUrl = `data:image/png;base64,${item.picture}`;
              this.hotel.images.push(imageUrl);
            }
          });
        }
      } catch (error) {
        this.$message.error("Media failed");
      }
    },
    async fetchBookedRanges() {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_BOOKING_SCHEDULE}${this.room_id}`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        this.bookedRanges = result.data.map((item) => ({
          start: new Date(item.start_date_booking), // Chuyển trực tiếp từ chuỗi ISO
          end: new Date(item.end_date_booking),
        }));
      } catch (error) {
        console.error("Error fetching booked ranges:", error);
        this.$message.error("Error fetching booked ranges:", error);
        // Optionally set fallback data or handle error state
        this.bookedRanges = [];
      }
    },
    async fetchPaymentMethods() {
      const token = localStorage.getItem("token"); // Thay "token" bằng khóa thực tế nếu khác

      // Kiểm tra nếu token không tồn tại
      if (!token) {
        this.$message.error("No authorization token found. Please log in.");
        this.paymentMethods = [];
        return;
      }
      try {
        const response = await fetch(`${API_ENDPOINTS.PAYMENT_METHOD}`, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment methods");
        }

        const result = await response.json();
        this.paymentMethods = result; // Lưu dữ liệu từ API
        console.log("Payment Methods:", this.paymentMethods);
      } catch (error) {
        this.$message.error("Error fetching payment methods: " + error.message);
        this.paymentMethods = []; // Đặt lại nếu lỗi
      }
    },
    async fetchPaymentMethods() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$message.error("No authorization token found. Please log in.");
        this.paymentMethods = [];
        return;
      }
      try {
        const response = await fetch(`${API_ENDPOINTS.PAYMENT_LIST_TYPE}`, {
          // Dùng URL trực tiếp nếu chưa có trong API_ENDPOINTS
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch payment methods: ${response.status}`
          );
        }

        const result = await response.json();
        console.log("Raw Payment Methods Response:", result); // Debug dữ liệu thô
        this.paymentMethods = result.data || result; // Điều chỉnh dựa trên cấu trúc API
        console.log("Payment Methods:", this.paymentMethods);
      } catch (error) {
        console.error("Error in fetchPaymentMethods:", error);
        this.$message.error("Error fetching payment methods: " + error.message);
        this.paymentMethods = [];
      }
    },
    async fetchQR() {
      const requestBody = {
        amount: this.selectedDays * this.hotel.pricepernight,
        content: "Đặt phòng " + this.hotel.name, // Giá trị content
      };
      try {
        const response = await fetch(`${API_ENDPOINTS.QR_GENERATE}`, {
          method: "POST", // Phương thức POST
          headers: {
            Accept: "*/*", // Chấp nhận mọi loại dữ liệu trả về
            "Content-Type": "application/json", // Dữ liệu gửi đi là JSON
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json(); // Chuyển phản hồi thành JSON
        this.qrImage = result.data;
        console.log("QR Generation Successful");
      } catch (error) {
        console.error("Create QR error");
      }
    },
    async createBooking() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$message.error("No authorization token found. Please log in.");
        return;
      }

      const requestBody = {
        room_id: Number(this.room_id),
        start_date_booking: this.convertDate(this.selectedStartDate),
        end_date_booking: this.convertDate(this.selectedEndDate),
        num_adults: this.num_adults,
        num_children: this.num_childs,
        price: this.total_price,
        payment_status: this.selectedPaymentMethodID,
      };
      console.log("create ", requestBody);

      try {
        const response = await fetch(`${API_ENDPOINTS.CREATE_BOOKING}`, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Booking created successfully:", result);
        this.$message.success("Booking created successfully!");
        this.showPaymentPopup = false; // Đóng popup sau khi thành công
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error creating booking:", error);
        this.$message.error("Failed to create booking: " + error.message);
      }
    },
    // Cập nhật confirmPayment để gọi createBooking
    async confirmPayment() {
      if (!this.selectedPaymentMethod) {
        this.$message.error("Please select a payment method.");
        return;
      }
      await this.createBooking(); // Gọi API khi nút được click
    },

    handleDateRangeUpdate({ start, end, days }) {
      this.selectedStartDate =
        start instanceof Date && !isNaN(start)
          ? format(start, "dd/MM/yyyy")
          : null;
      this.selectedEndDate =
        end instanceof Date && !isNaN(end) ? format(end, "dd/MM/yyyy") : null;

      // Lưu số ngày được chọn
      this.selectedDays = days;
      this.total_price = days * this.hotel.pricepernight;

      console.log("cha Start Date:", this.selectedStartDate);
      console.log("cha End Date:", this.selectedEndDate);
      console.log("Number of Days:", this.selectedDays);
      console.log("Total price:", this.total_price);
    },

    updateAdults(event) {
      const value = Number(event.target.value);
      this.num_adults = value < 0 ? 0 : value;
      console.log("Number of adult:", this.num_adults);
    },
    updateChilds(event) {
      const value = Number(event.target.value);
      this.num_childs = value < 0 ? 0 : value;
      console.log("Number of children:", this.num_childs);
    },
    openPaymentPopup() {
      if (
        !this.selectedStartDate ||
        !this.selectedEndDate ||
        this.num_adults === 0
      ) {
        this.$message.error(
          "Please select start date, end date, and at least one adult."
        );
        return;
      }
      if (this.paymentMethods.length > 0) {
        this.showPopup = false;
        this.showPaymentPopup = true;
      } else {
        this.$message.error("No payment methods available.");
      }
    },
    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method.payment_status_name; // Giữ logic hiện tại để hiển thị
      this.selectedPaymentMethodID = method.payment_id;
      console.log("Selected Payment Method ID:", this.selectedPaymentMethodID); // In ra id của phương thức thanh toán
    },
    convertDate(dateStr) {
      if (!dateStr) return null;
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Đảm bảo tháng và ngày có 2 chữ số
    },
  },
};
</script>
<template>
  <div>
    <!-- Header -->
    <Header />
    <div class="container mt-5">
      <!-- tên khách sạn -->
      <main class="details-content">
        <div class="status-price">
          <div class="status-price-left">
            <h1>
              {{ hotel.name }}
            </h1>
            <h3 class="d-flex align-items-center gap-2">
              <img
                style="height: 1em; vertical-align: middle"
                src="@/assets/icons/location.png"
                alt=""
              />
              {{ hotel.address }}
            </h3>
            <h3 class="d-flex align-items-center gap-2">
              <img
                style="height: 1em; vertical-align: middle"
                src="@/assets/icons/money.png"
                alt=""
              />
              <span class="price text-danger"
                >{{ hotel.pricepernight }} VND</span
              >
              per night
            </h3>
            <h3 class="d-flex align-items-center gap-2">
              <img
                style="height: 1em; vertical-align: middle"
                src="@/assets/icons/double-bed.png"
                alt=""
              />
              {{ hotel.num_beds }}
              ·
              <img
                style="height: 1em; vertical-align: middle"
                src="@/assets/icons/bathtub.png"
                alt=""
              />
              {{ hotel.num_bathrooms }}
            </h3>
          </div>
          <div class="status-price-right">
            <button class="book-btn" @click="showPopup = true">Book Now</button>
          </div>
        </div>
        <!-- Hình ảnh khách sạn -->
        <div class="hotel-gallery">
          <div class="main-image">
            <img
              :src="hotel.images[0]"
              alt="Main Image"
              class="large-image"
              @click="showLightbox(0)"
            />
          </div>
          <div class="grid-images">
            <img
              v-for="(image, index) in hotel.images.slice(1, 5)"
              :key="index"
              :src="image"
              alt="Gallery Image"
              class="small-image"
              @click="showLightbox(index + 1)"
            />
            <div
              class="more-images"
              v-if="hotel.images.length > 5"
              @click="showLightbox(5)"
            >
              <img
                :src="hotel.images[5]"
                alt="More Images"
                class="small-image opacity"
              />
              <div class="overlay">+{{ hotel.images.length - 6 }} ảnh</div>
            </div>
          </div>

          <!-- Vue Easy Lightbox -->
          <vue-easy-lightbox
            :visible="visible"
            :imgs="hotel.images"
            :index="lightboxIndex"
            @hide="visible = false"
            class="lightbox-custom"
          />
        </div>
      </main>
    </div>
    <div class="hotel-info">
      <!-- Tiện ích -->
      <h3>Features</h3>
      <div class="amenities">
        <div v-for="amenity in hotel.amenities" :key="amenity" class="amenity">
          {{ amenity }}
        </div>
      </div>
      <h3>Description</h3>
      <p class="description" v-html="hotel.description"></p>
    </div>

    <!-- Footer -->
    <Footer />
  </div>

  <!-- Popup -->
  <!-- <div v-if="showPopup" class="popup-overlay"> -->
  <div :class="{ 'popup-overlay': true, show: showPopup }">
    <div class="popup">
      <div class="row d-flex position-relative">
        <h2 class="col">Booking Detail</h2>
        <button class="custom-close-btn" @click="showPopup = false">✕</button>
      </div>
      <p class="text-danger">*Room booked on the date in red</p>
      <div>
        <Calendar
          :booked-ranges="bookedRanges"
          @update-range="handleDateRangeUpdate"
        />
        <div class="selected-dates d-flex justify-content-around">
          <p>
            Start date:
            <span class="text-primary fw-bold">
              {{ this.selectedStartDate ? selectedStartDate : "Chưa chọn" }}
            </span>
          </p>
          <p>
            End date:
            <span class="text-primary fw-bold">
              {{ this.selectedEndDate ? selectedEndDate : "Chưa chọn" }}
            </span>
          </p>
          <!-- <p>
            Số ngày:
            <span class="text-primary fw-bold">
              {{ this.selectedDays }}
            </span>
          </p> -->
        </div>
      </div>

      <div class="d-flex justify-content-around">
        <div>
          <p class="mb-1">Number of adult</p>
          <input
            type="number"
            v-model="num_adults"
            class="form-control"
            @input="updateAdults"
          />
        </div>
        <div>
          <p class="mb-1">Number of children</p>
          <input
            type="number"
            v-model="num_childs"
            class="form-control"
            @input="updateChilds"
          />
        </div>
      </div>
      <div class="mt-3 text-center">
        <button class="btn btn-primary" @click="openPaymentPopup">
          Continue
        </button>
      </div>
    </div>
  </div>

  <!-- Popup Thanh Toán -->
  <div :class="{ 'popup-overlay': true, show: showPaymentPopup }">
    <div class="popup">
      <div class="row d-flex position-relative">
        <h2 class="col">Payment Method</h2>
        <button class="custom-close-btn" @click="showPaymentPopup = false">
          ✕
        </button>
      </div>

      <div class="mt-3">
        <p class="text-lg font-semibold">Select your payment method:</p>
        <div class="space-y-3">
          <div
            v-for="(method, index) in paymentMethods"
            :key="index"
            class="custom-card form-check border border-blue-400 rounded-lg p-4 flex items-center cursor-pointer hover:shadow-lg transition-all relative"
            :class="{
              'bg-blue-50':
                selectedPaymentMethod === method.payment_status_name,
            }"
            @click="selectPaymentMethod(method)"
          >
            <!-- Left side: Display payment_status_name -->
            <div class="flex-grow">
              <label
                class="form-check-label text-lg font-semibold"
                :for="'paymentMethod' + index"
              >
                {{ method.payment_status_name }}
              </label>
            </div>

            <!-- Right side: Custom radio button -->
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
              <input
                class="hidden"
                type="radio"
                :id="'paymentMethod' + index"
                :value="method.payment_status_name"
                v-model="selectedPaymentMethod"
              />
              <div
                v-if="selectedPaymentMethod === method.payment_status_name"
                class="w-3 h-3 bg-blue-500 rounded-full"
              ></div>
            </div>
          </div>
        </div>
        <!-- Hiển thị QR nếu selectedPaymentMethodID == 2 -->
        <div class="mt-3 text-center" v-if="selectedPaymentMethodID == 2">
          <img
            v-if="qrImage"
            :src="qrImage"
            alt="QR Code"
            class="qr-image mx-auto"
          />
          <p v-else>Loading QR code...</p>
        </div>
      </div>

      <div class="mt-3 text-center">
        <button class="btn btn-success btn_style" @click="confirmPayment">
          Confirm Payment
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  gap: 20px;
}
.sidebar {
  width: 30%;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}
.map-container {
  margin-top: 10px;
}
.details-content {
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  z-index: 500;
}
.book-btn {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}
.amenity {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.highlights ul {
  padding-left: 20px;
}
.input-box {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.search-btn {
  width: 100%;
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
/* ảnh hotel */
.hotel-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
}
.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}
.grid-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.small-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}
.more-images {
  position: relative;
}
.opacity {
  opacity: 0.5;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 18px;
  font-weight: bold;
}
/* làm mờ ảnh trong lightbox */
.lightbox-custom {
  background: rgba(0, 0, 0, 0.7) !important; /* Tăng độ tối và mờ nền */
  backdrop-filter: blur(8px); /* Làm mờ nền phía sau */
}

/* thông tin chi tiết phòng  */
.hotel-info {
  max-width: 96%; /* Điều chỉnh kích thước theo mong muốn */
  margin: 0 auto; /* Căn giữa */
  text-align: left;
  background: white;
  padding: 20px;
  border-radius: 8px;
}
/* giá và status */
.status-price {
  display: flex;
  justify-content: space-between; /* Đẩy trạng thái/giá sang trái và nút sang phải */
  align-items: center; /* Căn giữa theo chiều dọc */
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.status-price-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left; /* Căn trái nội dung */
}

.status-price-left h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.status-price .status {
  color: #28a745; /* Màu xanh lá để hiển thị trạng thái tốt */
  font-size: 22px;
}

.status-price .price {
  font-size: 22px;
  font-weight: bold;
}

.status-price-right {
  display: flex;
  align-items: center;
}

.book-btn {
  background: #007bff; /* Màu xanh dương cho nút */
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s; /* Hiệu ứng chuyển màu khi hover */
}

.book-btn:hover {
  background: #0056b3; /* Màu đậm hơn khi hover */
}
.status-price-left .guests {
  font-size: 22px;
  font-weight: bold;
}

/* Style cho popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 50%; /* Độ rộng cố định */
  max-height: 95vh; /* Giới hạn chiều cao tối đa */
  overflow-y: auto; /* Hiển thị thanh cuộn dọc nếu nội dung vượt quá */
  overflow-x: hidden; /* Ẩn cuộn ngang nếu không cần */
}

.popup-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* Thêm hiệu ứng phóng to nhẹ khi mở popup */
.popup {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.popup-overlay.show .popup {
  transform: scale(1);
}

/* btn close */
.custom-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  border: none;
  background-color: rgba(0, 0, 0, 0.1);
  color: black;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
}

/* Card container styling */
.custom-card {
  background: linear-gradient(
    180deg,
    #d8cbc4 0%,
    #d8cbc4 100%
  ); /* Blue gradient */
  border: 2px solid #a3c9f1; /* Blue border */
  border-radius: 15px; /* Rounded corners */
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  transition: all 0.3s ease;
  position: relative; /* Ensure relative positioning for absolute children */
  display: flex; /* Use flexbox for alignment */
  align-items: center; /* Center items vertically */
  justify-content: space-between; /* Space between label and radio */
}

.custom-card:hover {
  background: linear-gradient(
    180deg,
    #a08679 0%,
    #a08679 100%
  ); /* Slightly darker gradient on hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

/* Text styling */
.form-check-label {
  font-size: 18px;
  font-weight: bold;
  color: #1a3c6d; /* Dark blue for the title */
  padding-left: 0; /* Remove default padding */
  cursor: pointer; /* Indicate clickable area */
}

/* Radio button container */
.custom-card .absolute {
  right: 20px; /* Consistent spacing from the right */
  top: 50%; /* Vertically centered */
  transform: translateY(-50%); /* Center precisely */
}

/* Custom radio button styling */
.custom-card input[type="radio"] {
  display: none; /* Hide default radio input */
}

.custom-card .w-3 {
  width: 16px; /* Slightly larger for visibility */
  height: 16px;
  background-color: #5b3e1c; /* Yellow color to match theme */
  border-radius: 50%; /* Ensure perfect circle */
  transition: all 0.3s ease; /* Smooth transition */
}

/* Remove default form-check padding/margin */
.form-check {
  padding-left: 0;
  margin-bottom: 0; /* Remove default margin */
}

/* Ensure proper alignment */
.flex-grow {
  flex-grow: 1; /* Allow label to take available space */
}

/* button */
.btn_style {
  background: white;
  color: #765341;
}

.btn_style:hover {
  background: #765341;
  color: white;
}

/* qr */
.qr-image {
  max-width: 50%; /* Đảm bảo hình ảnh không vượt quá chiều rộng của popup */
  height: auto;
  display: block;
  margin: 0 auto; /* Căn giữa hình ảnh */
}
</style>
