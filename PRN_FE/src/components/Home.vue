<script>
import Header from "./Header.vue";
import SearchBar from "./SearchBar.vue";
import Footer from "./Footer.vue";
import DestinationCard from "./DestinationCard.vue";
import { useRoute, useRouter } from "vue-router";
import { API_ENDPOINTS } from "@/constant/apiConstants";

export default {
  name: "HomePage",
  components: {
    Header,
    SearchBar,
    Footer,
    DestinationCard,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      rooms: [],
      activeTab: "domestic", // Thêm trạng thái activeTab cho các tab
      destinations: [
        {
          id: 1,
          name: "Vũng Tàu",
          image: "https://i.ibb.co/ZpqsHyFd/VungTau.jpg",
          flag: "🇻🇳",
        },
        {
          id: 2,
          name: "Thành phố Hồ Chí Minh",
          image: "https://i.ibb.co/cRwd14q/Ho-Chi-Minh-City.jpg",
          flag: "🇻🇳",
        },
        {
          id: 3,
          name: "Nha Trang",
          image: "https://i.ibb.co/JRrj0WzB/NhaTrang.jpg",
          flag: "🇻🇳",
        },
        {
          id: 4,
          name: "Hà Nội",
          image: "https://i.ibb.co/1fVwyBT4/Hanoi.jpg",
          flag: "🇻🇳",
        },
        {
          id: 5,
          name: "Mũi Né",
          image: "https://i.ibb.co/BHrphx9k/MuiNe.jpg",
          flag: "🇻🇳",
        },
        {
          id: 6,
          name: "Đà Nẵng",
          image: "https://i.ibb.co/dwy7XtQX/DaNang.png",
          flag: "🇻🇳",
        },
      ],
      currentSlide: 0, // Thêm biến để theo dõi slide hiện tại
      slides: [
        // Dữ liệu cho slider
        {
          image: "https://images.pexels.com/photos/941195/pexels-photo-941195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          title: "Khuyến mãi đặc biệt",
          description: "Vé máy bay + khách sạn giảm 20%",
          link: "#",
        },
        {
          image: "https://images.pexels.com/photos/12322692/pexels-photo-12322692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          title: "Ưu đãi mùa hè",
          description: "Đặt phòng Phú Quốc chỉ từ 500k",
          link: "#",
        },
        {
          image: "https://images.pexels.com/photos/12538227/pexels-photo-12538227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          title: "Combo tiết kiệm",
          description: "Giảm giá 30% cho kỳ nghỉ tại Đà Nẵng",
          link: "#",
        },
      ],
    };
  },
  created() {
    this.fetchRoomData();
    this.autoSlide(); // Bắt đầu tự động chuyển slide
  },
  methods: {
    async fetchRoomData() {
      try {
        const response = await fetch(API_ENDPOINTS.R_ALL, {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        this.rooms = result.data;
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    },
    async handleSearch(query) {
      this.router.push({ path: "/search", state: { searchQuery: query } });
    },
    navigateToSearch(query) {
      this.router.push({ path: "/search", state: { searchQuery: query } });
    },
    nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  },
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  },
  autoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Chuyển slide mỗi 5 giây
  }
  },
};
</script>
<template>
  <!-- header -->
  <Header />
  <div class="main-content">
    <div class="hero">
      <!-- title -->
      <h1>Find your next vacation spot</h1>
      <h2>Find hotel deals, home stays and more...</h2>
      <div class="w-50">
        <!-- search bar -->
        <SearchBar @search="handleSearch" />
      </div>
      <!-- list room -->
      <div class="container pt-4">
        <div class="destinations">
          <p class="m-0 p-0 fs-3 fw-bold">Điểm đến đang thịnh hành</p>
          <p class="p-0">
            Du khách tìm kiếm về Việt Nam cũng đặt chỗ ở những nơi này
          </p>
          <div class="destination-grid">
            <destination-card
              v-for="destination in destinations"
              :key="destination.id"
              :name="destination.name"
              :image="destination.image"
              :flag="destination.flag"
              @click="navigateToSearch(destination.name)"
            />
          </div>
        </div>

        <!-- Slider quảng cáo -->
<div class="promo-slider">
  <div class="slider-container">
    <div 
      v-for="(slide, index) in slides" 
      :key="index" 
      class="slide" 
      :class="{ active: currentSlide === index }"
    >
      <img :src="slide.image" :alt="slide.title" class="slide-image" />
      <div class="slide-content">
        <h3>{{ slide.title }}</h3>
        <p>{{ slide.description }}</p>
        <a :href="slide.link" class="slide-link">Xem chi tiết</a>
      </div>
    </div>
    
    <!-- Nút điều hướng -->
    <button class="slider-prev" @click="prevSlide">❮</button>
    <button class="slider-next" @click="nextSlide">❯</button>
    
    <!-- Dots -->
    <div class="slider-dots">
      <span 
        v-for="(slide, index) in slides" 
        :key="index" 
        class="dot" 
        :class="{ active: currentSlide === index }" 
        @click="currentSlide = index"
      ></span>
    </div>
  </div>
</div>

        <!-- Phần mới: Phố biến với du khách từ Việt Nam -->
        <section class="popular-section">
          <h2 class="content-title">Phố biến với du khách từ Việt Nam</h2>

          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: activeTab === 'domestic' }"
              @click="activeTab = 'domestic'"
            >
              Thành phố thường nước
            </button>
            <button
              class="tab"
              :class="{ active: activeTab === 'international' }"
              @click="activeTab = 'international'"
            >
              Thành phố nước ngoài
            </button>
            <button
              class="tab"
              :class="{ active: activeTab === 'region' }"
              @click="activeTab = 'region'"
            >
              Khu vực
            </button>
            <button
              class="tab"
              :class="{ active: activeTab === 'country' }"
              @click="activeTab = 'country'"
            >
              Quốc gia
            </button>
            <button
              class="tab"
              :class="{ active: activeTab === 'accommodation' }"
              @click="activeTab = 'accommodation'"
            >
              Chỗ nghỉ
            </button>
          </div>

          <!-- Danh sách -->
          <div class="city-list">
            <!-- Thành phố thường nước -->
            <div v-if="activeTab === 'domestic'" class="city-row">
              <a href="#">Khách sạn Vũng Tàu</a>
              <a href="#">Khách sạn Nha Trang</a>
              <a href="#">Khách sạn Quy Nhơn</a>
              <a href="#">Khách sạn Ninh Bình</a>
              <a href="#">Khách sạn Côn Đảo</a>
              <a href="#">Khách sạn Đà Nẵng</a>
              <a href="#">Khách sạn Huế</a>
              <a href="#">Khách sạn Phần Thiết</a>
              <a href="#">Khách sạn Cần Thơ</a>
              <a href="#">Khách sạn Cửa Lò</a>
              <a href="#">Khách sạn Đà Lạt</a>
              <a href="#">Khách sạn Hội An</a>
              <a href="#">Khách sạn Sa Pa</a>
              <a href="#">Khách sạn Phú Quốc</a>
              <a href="#">Khách sạn Tuy Hòa</a>
              <a href="#">Khách sạn TP. Hồ Chí Minh</a>
              <a href="#">Khách sạn Hà Long</a>
              <a href="#">Khách sạn Đảo Cát Bà</a>
              <a href="#">Khách sạn Thành phố Hải Phòng</a>
              <a href="#">Khách sạn Bước Ma Thuột</a>
              <a href="#">Khách sạn Hà Nội</a>
              <a href="#">Khách sạn Mũi Né</a>
              <a href="#">Khách sạn Sầm Sơn</a>
              <a href="#">Khách sạn Tam Đảo</a>
              <a href="#">Khách sạn Hòa Tram</a>
            </div>

            <!-- Thành phố nước ngoài -->
            <div v-if="activeTab === 'international'" class="city-row">
              <a href="#">Khách sạn Quảng Châu - TRUNG QUỐC</a>
              <a href="#">Khách sạn Tokyo - NHẬT BẢN</a>
              <a href="#">Khách sạn Siem Reap - CAMPUCHIA</a>
              <a href="#">Khách sạn Bắc Kinh - TRUNG QUỐC</a>
              <a href="#">Khách sạn Bangkok - THÁI LAN</a>
              <a href="#">Khách sạn Phnom Penh - CAMPUCHIA</a>
              <a href="#">Khách sạn Hong Kong - HỒNG KÔNG</a>
              <a href="#">Khách sạn Kyoto - NHẬT BẢN</a>
              <a href="#">Khách sạn Paris - PHÁP</a>
              <a href="#">Khách sạn Đại Bắc - ĐÀI LOAN</a>
              <a href="#">Khách sạn Sydney - ÚC</a>
              <a href="#">Khách sạn London - VƯƠNG QUỐC ANH</a>
              <a href="#">Khách sạn Singapore - SINGAPORE</a>
              <a href="#">Khách sạn Thượng Hải - TRUNG QUỐC</a>
              <a href="#">Khách sạn Osaka - NHẬT BẢN</a>
              <a href="#">Khách sạn Valletta - MALTA</a>
              <a href="#">Khách sạn Kuala Lumpur - MALAYSIA</a>
              <a href="#">Khách sạn Seoul - HÀN QUỐC</a>
              <a href="#">Khách sạn Viêng Chăn - LÀO</a>
              <a href="#">Khách sạn Chiang Mai - THÁI LAN</a>
            </div>

            <!-- Khu vực -->
            <div v-if="activeTab === 'region'" class="city-row">
              <a href="#">Hà Nội</a>
              <a href="#">Khu vực TP. Hồ Chí Minh</a>
              <a href="#">Phú Yên</a>
              <a href="#">Vịnh Hạ Long</a>
              <a href="#">Bà Rịa - Vũng Tàu</a>
              <a href="#">Thành phố Đà Nẵng</a>
              <a href="#">Quảng Bình</a>
              <a href="#">Ninh Bình</a>
              <a href="#">Bali</a>
              <a href="#">Ninh Thuận</a>
              <a href="#">Quảng Ninh</a>
              <a href="#">Thừa Thiên - Huế</a>
              <a href="#">Đảo Phú Quốc</a>
              <a href="#">Đồng bằng Sông Cửu Long</a>
              <a href="#">Chiang Mai Province</a>
              <a href="#">Gold Coast</a>
              <a href="#">Hòa Bình</a>
              <a href="#">Hải Phòng</a>
              <a href="#">Bình Dương</a>
              <a href="#">Vientiane</a>
              <a href="#">Khách Sạn Gia Đình</a>
              <a href="#">Căn hộ</a>
              <a href="#">Các Khách Sạn 5 Sao</a>
              <a href="#">Các Khách Sạn 4 Sao</a>
              <a href="#">Căn hộ dịch vụ</a>
            </div>

            <!-- Quốc gia -->
            <div v-if="activeTab === 'country'" class="city-row">
              <a href="#">Việt Nam</a>
              <a href="#">Trung Quốc</a>
              <a href="#">Thái Lan</a>
              <a href="#">Nhật Bản</a>
              <a href="#">Pháp</a>
              <a href="#">Campuchia</a>
              <a href="#">Đài Loan</a>
              <a href="#">Malaysia</a>
              <a href="#">Úc</a>
              <a href="#">Singapore</a>
              <a href="#">Mỹ</a>
              <a href="#">Indonesia</a>
              <a href="#">Hàn Quốc</a>
              <a href="#">Lào</a>
              <a href="#">Đức</a>
              <a href="#">Vương Quốc Anh</a>
              <a href="#">Ý</a>
              <a href="#">Hồng Kông</a>
              <a href="#">Canada</a>
              <a href="#">Thụy Sỹ</a>
            </div>

            <!-- Chỗ nghỉ -->
            <div v-if="activeTab === 'accommodation'" class="city-row">
              <a href="#">Homestay</a>
              <a href="#">Khách sạn giá rẻ</a>
              <a href="#">Các biệt thự</a>
              <a href="#">Các resort</a>
              <a href="#">Các hostel</a>
              <a href="#">Khách sạn biển</a>
              <a href="#">Căn hộ</a>
              <a href="#">Các Khách Sạn 5 Sao</a>
              <a href="#">Các Khách Sạn 4 Sao</a>
              <a href="#">Căn hộ dịch vụ</a>
              <a href="#">Các Khách Sạn 3 Sao</a>
              <a href="#">Các Khách Sạn có Hồ Bơi</a>
              <a href="#">Các khách sạn thiên nhiên với thú nuôi</a>
              <a href="#">Khách sạn không nguồn nước</a>
              <a href="#">Các Khách Sạn có chỗ đậu xe</a>
              <a href="#">Khách Sạn Gia Đình</a>
              <a href="#">Căn hộ dịch vụ</a>
              <a href="#">Khách sạn tình nhân</a>
              <a href="#">Khách sạn khoang ngủ</a>
              <a href="#">Khách sạn trong lòng</a>
              <a href="#">Nhà nghỉ B&B</a>
              <a href="#">Nhà nghỉ</a>
              <a href="#">Đồng bằng Sông Cửu Long</a>
              <a href="#">Bình Dương</a>
              <a href="#">Các Khách Sạn sang trọng</a>
            </div>
          </div>

          <!-- Nút Hiển thị thêm -->
          <div class="show-more">
            <button class="show-more-btn">+ Hiển thị thêm</button>
          </div>

          <!-- Thông tin bổ sung -->
          <div class="additional-info">
            <p>
              Các quốc gia - Khu vực - Thành phố - Quận - Sân bay - Khách sạn -
              Địa điểm được quan tâm - Các Nhà Nghỉ Duống - Căn hộ - Các Resort
              - Các biệt thự - Các hostel - Nhà nghỉ B&B - Các nhà khách - Nhứng
              chỗ nghỉ độc đáo - Tất cả các điểm đến - Tất cả các điểm đến có
              chuyển bay - Tất cả địa điểm cho thuê xe - Tất cả điểm đến cho kỹ
              nghỉ - Hướng dẫn - Khám phá - Đánh giá của Khách - Khám phá lưu
              trú theo tháng
            </p>
          </div>

          <!-- Các cột thông tin -->
          <div class="info-columns">
            <div class="info-column">
              <h4 class="info-title">Hỗ trợ</h4>
              <a href="#">Các câu hỏi thường gặp về virus corona (COVID-19)</a>
              <a href="#">Quản lý các chuyến đi của bạn</a>
              <a href="#">Liên hệ Dịch vụ Khách hàng</a>
              <a href="#">Trung tâm thông tin bảo mật</a>
              <a href="#">Nghiệp</a>
              <a href="#">Traveller Review Awards</a>
              <a href="#">Cho thuê xe hội</a>
              <a href="#">Tìm chuyến bay</a>
              <a href="#">Đặt nhà hàng</a>
              <a href="#">Booking.com dành cho Đại Lý Du Lịch</a>
            </div>
            <div class="info-column">
              <h4 class="info-title">Khám phá thêm</h4>
              <a href="#">Chương trình khách hàng thân thiết Genius</a>
              <a href="#">Ưu đãi theo mùa và dịp lễ</a>
              <a href="#">Bài viết về du lịch</a>
              <a href="#">Booking.com dành cho Doanh Nghiệp</a>
            </div>
            <div class="info-column">
              <h4 class="info-title">Điều khoản và cài đặt</h4>
              <a href="#">Bảo mật & Cookie</a>
              <a href="#">Điều khoản và điều kiện</a>
              <a href="#">Tranh chấp đối tác</a>
              <a href="#">Chính sách chống Nô lệ Hiện đại</a>
              <a href="#">Chính sách về Quyền con người</a>
            </div>
            <div class="info-column">
              <h4 class="info-title">Dành cho đối tác</h4>
              <a href="#">Đăng nhập vào trang Extranet</a>
              <a href="#">Trợ giúp đối tác</a>
              <a href="#">Đăng chỗ nghỉ của Quý vị</a>
              <a href="#">Trở thành đối tác phân phối</a>
            </div>
            <div class="info-column">
              <h4 class="info-title">Về chúng tôi</h4>
              <a href="#">Về Booking.com</a>
              <a href="#">Chương tói hoạt động như thế nào</a>
              <a href="#">Du lịch bền vững</a>
              <a href="#">Truyền thông</a>
              <a href="#">Cơ hội việc làm</a>
              <a href="#">Quan hệ cổ đông</a>
              <a href="#">Liên hệ công ty</a>
            </div>
          </div>
        </section>
      </div>

      <!-- footer -->
      <Footer />
    </div>
  </div>
</template>



<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.hero {
  background-size: cover;
  background-position: center;
  height: auto; /* Điều chỉnh để phù hợp với nội dung */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 50px;
  align-items: center;
  color: white;
  flex-grow: 1;
}

/* destinations */
.destinations {
  padding: 20px;
}

.destination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
  justify-items: center;
}

@media (max-width: 768px) {
  .destination-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

/* Popular Section */
.popular-section {
  margin-top: 40px;
  padding: 20px;
}

.content-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000; /* Đổi màu chữ để phù hợp với nền */
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab.active {
  background-color: #003580;
  color: white;
  border-color: #003580;
}

.tab:hover {
  background-color: #e0e0e0;
}

/* City List */
.city-list {
  margin-bottom: 20px;
}

.city-row {
  display: block; /* Hiển thị theo hàng ngang, mỗi mục trên một dòng */
}

.city-row a {
  display: inline-block; /* Hiển thị các liên kết trên cùng một dòng, nhưng xuống dòng nếu không đủ chỗ */
  color: #003580;
  text-decoration: none;
  font-size: 14px;
  margin-right: 20px; /* Khoảng cách giữa các liên kết */
  margin-bottom: 10px; /* Khoảng cách giữa các dòng */
}

.city-row a:hover {
  text-decoration: underline;
}

/* Show More Button */
.show-more {
  text-align: center;
  margin-bottom: 20px;
}

.show-more-btn {
  background: none;
  border: none;
  color: #003580;
  font-size: 14px;
  cursor: pointer;
}

.show-more-btn:hover {
  text-decoration: underline;
}

/* Additional Info */
.additional-info {
  margin-bottom: 30px;
}

.additional-info p {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.info-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info-column {
  flex: 1;
  min-width: 200px;
}

.info-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.info-column a {
  display: block;
  color: #003580;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
}

.info-column a:hover {
  text-decoration: underline;
}

/* P/* Promo Slider */
.promo-slider {
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  position: relative;
  padding: 0 20px;
}

.slider-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 600px; /* Tăng chiều cao từ 300px lên 400px để ảnh lớn hơn */
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  display: flex;
  align-items: center;
}

.slide.active {
  opacity: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Giữ tỷ lệ ảnh và lấp đầy container */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  padding: 30px; /* Tăng padding để nội dung rộng rãi hơn */
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin: 0 30px; /* Tăng margin để căn chỉnh tốt hơn */
}

.slide-content h3 {
  margin: 0 0 15px; /* Tăng khoảng cách dưới */
  font-size: 28px; /* Tăng cỡ chữ tiêu đề */
}

.slide-content p {
  margin: 0 0 20px; /* Tăng khoảng cách dưới */
  font-size: 18px; /* Tăng cỡ chữ mô tả */
}

.slide-link {
  color: #fff;
  background-color: #003580;
  padding: 10px 20px; /* Tăng padding để nút lớn hơn */
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px; /* Tăng cỡ chữ cho link */
}

.slide-link:hover {
  background-color: #00224f;
}

/* Nút điều hướng */
.slider-prev,
.slider-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 15px; /* Tăng kích thước nút */
  cursor: pointer;
  font-size: 20px; /* Tăng cỡ chữ */
  z-index: 3;
}

.slider-prev {
  left: 40px; /* Dịch ra xa mép trái hơn */
}

.slider-next {
  right: 40px; /* Dịch ra xa mép phải hơn */
}

.slider-prev:hover,
.slider-next:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Dots */
.slider-dots {
  position: absolute;
  bottom: 20px; /* Dịch dots xuống dưới một chút */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px; /* Tăng khoảng cách giữa các dots */
  z-index: 3;
}

.dot {
  width: 12px; /* Tăng kích thước dot */
  height: 12px;
  background: #bbb;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.dot.active {
  background: #003580;
}

.dot:hover {
  background: #666;
}
</style>