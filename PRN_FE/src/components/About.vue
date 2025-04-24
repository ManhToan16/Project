   <script>
  import Header from './Header.vue';
  import Footer from './Footer.vue';
  
  export default {
    name: 'AboutVue',
    components: {
      Header,
      Footer,
    },
    data() {
      return {
        activeTab: 'domestic', // Tab mặc định là "Thành phố thường nước"
      };
    },
  };
  </script>

<template>
    <div class="page-wrapper">
      <!-- Header -->
      <Header />

      <div class="image-section">
      <img src="@/assets/slider.png" alt="Slider Image" />
    </div>

     <!-- Main Content -->
      <div class="main-content">
        <div class="container">
          <div class="row">
            <!-- Main Content -->
            <main class="content">
              <!-- Phần hiện tại -->
              <h2 class="content-title">Về Easy Booking.com™</h2>
  
              <h4 class="section-title">Pháp lý</h4>
              <p class="section-text">
                Được thành lập vào năm 1996 ở Amsterdam, Easy Booking.com đã phát triển từ một nhóm khởi nghiệp nhỏ ở Hà Lan để trở thành một trong những công ty hàng đầu thế giới trong lĩnh vực du lịch trực tuyến. Là một phần của Booking Holdings Inc. (NASDAQ: BKNG), sứ mệnh của Booking.com là giúp mọi người trải nghiệm thế giới dễ dàng hơn.
              </p>
  
              <h4 class="section-title">Digital Services Act</h4>
              <p class="section-text">
                Đạo luật Thị trường Kỹ thuật số của EU có hiệu lực từ ngày 17/2/2024 và áp dụng cho tất cả các nền tảng trực tuyến, bao gồm Booking.com.
              </p>
  
              <h4 class="section-title">Mọi trải nghiệm thế giới để bạn hơn</h4>
              <p class="section-text">
                Bằng cách đầu tư vào công nghệ giúp loại bỏ những phiền toái khi du lịch, Booking.com kết nối hàng triệu du khách với các trải nghiệm đáng nhớ, nhiều lựa chọn vận chuyển và các chỗ nghỉ tuyệt vời – từ nhà nghỉ cho đến khách sạn và nhiều hơn nữa. Là một trong những thị trường du lịch lớn nhất thế giới cho cả những thương hiệu đã thành danh và các doanh nghiệp ở mọi quy mô, Booking.com giúp các chỗ nghỉ trên khắp thế giới kết nối với du khách toàn cầu và phát triển doanh nghiệp của họ.
              </p>
  
              <h4 class="section-title">Điều khoản và điều kiện</h4>
              <p class="section-text">
                Chúng tôi hoạt động hưởng ứng khách hàng và luôn sẵn sàng hỗ trợ bạn. Là một trong những thị trường du lịch lớn nhất thế giới cho cả những thương hiệu đã thành danh và các doanh nghiệp ở mọi quy mô, Booking.com giúp các chỗ nghỉ trên khắp thế giới kết nối với du khách toàn cầu và phát triển doanh nghiệp của họ.
              </p>
  
              <h4 class="section-title">Ở cho đến khách sạn và nhiều hơn nữa</h4>
              <p class="section-text">
                Booking.com hỗ trợ 43 ngôn ngữ và cung cấp hơn 28 triệu chỗ nghỉ được báo cáo, trong đó có hơn 6.6 triệu là nhà, căn hộ và các chỗ nghỉ độc đáo khác. Dù bạn đi đến bất kỳ đâu hay muốn trải nghiệm điều gì, Booking.com sẽ giúp mọi thứ trở nên dễ dàng hơn và hỗ trợ bạn với dịch vụ chăm sóc khách hàng 24/7.
              </p>
  
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
                    Các quốc gia - Khu vực - Thành phố - Quận - Sân bay - Khách sạn - Địa điểm được quan tâm - Các Nhà Nghỉ Duống - Căn hộ - Các Resort - Các biệt thự - Các hostel - Nhà nghỉ B&B - Các nhà khách - Nhứng chỗ nghỉ độc đáo - Tất cả các điểm đến - Tất cả các điểm đến có chuyển bay - Tất cả địa điểm cho thuê xe - Tất cả điểm đến cho kỹ nghỉ - Hướng dẫn - Khám phá - Đánh giá của Khách - Khám phá lưu trú theo tháng
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
            </main>
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <Footer />
    </div>
  </template>

  
  <style scoped>
  /* Reset and Base Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
  }
  
  /* Page Wrapper */
  .page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    padding: 40px 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
  }
  
  /* Main Content Area */
  .content {
    width: 100%;
    padding: 0 15px;
  }
  
  .content-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  .section-text {
    font-size: 14px;
    color: #333;
    margin-bottom: 20px;
    line-height: 1.8;
  }
  
  /* Popular Section */
  .popular-section {
    margin-top: 40px;
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
  
  /* Info Columns */
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
/*hinh anh slider */
  .image-section {
  margin-top: 100px; 
}
.image-section img {
  width: 100%;
  height: auto;
  display: block;
}
.image-section {
  margin-bottom: 0; 
  padding: 0; 
}
  </style>