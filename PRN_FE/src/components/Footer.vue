<template>
  <div class="container">
    <!-- Other content -->
    <footer class="footer">
      <p class="m-0 p-0">EasyBooking.com là một phần của EasyBooking Holdings Inc., tập đoàn đứng đầu thế giới về du lịch trực tuyến và các dịch vụ liên quan.</p>
        Bản quyền © 1996 - 2025 EasyBooking.com™. Bảo lưu mọi quyền.
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px; /* Example container width */
  margin: 0 auto;
}

.footer {
  background-color: #765341;
  padding: 20px;
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  position: relative; /* Use relative if you want it to scroll with the page */
  width: 100vw; /* Use viewport width to break out of the container */
  left: 50%;
  transform: translateX(-50%); /* Center it relative to the viewport */
  box-sizing: border-box;
}
</style>