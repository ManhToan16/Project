<script>
import Header from "./Header.vue";
import PersonalInfo from "./PersonalInfo.vue";
import PasswordUpdate from "./PasswordUpdate.vue";
import MyBooking from "./MyBooking.vue";
export default {
  name: "SearchPage",
  components: {
    Header,
    PersonalInfo,
    PasswordUpdate,
    MyBooking,
  },
  data() {
    return {
      selectedMenu: "personal",
    };
  },
  methods: {
    selectMenu(menu) {
      this.selectedMenu = menu;
    },
  },
};
</script>

<template>
  <Header />
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-3">
        <div class="profile-menu">
          <div class="menu-item" @click="selectMenu('personal')">
            <img src="@/assets/icons/user.png" alt="User icon" />
            <span>Personal Information</span>
          </div>
          <div class="menu-item" @click="selectMenu('password')">
            <img src="@/assets/icons/lock.png" alt="Lock icon" />
            <span>Password settings</span>
          </div>
          <div class="menu-item" @click="selectMenu('mybooking')">
            <img src="@/assets/icons/list.png" alt="Lock icon" />
            <span>My Booking</span>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="profile-menu">
          <!-- Hiển thị component dựa trên selectedMenu -->
          <div v-if="selectedMenu === 'personal'">
            <PersonalInfo />
          </div>
          <div v-else-if="selectedMenu === 'password'">
            <PasswordUpdate />
          </div>
          <div v-else-if="selectedMenu === 'mybooking'">
            <MyBooking />
          </div>
          <div v-else>
            <p>Vui lòng chọn một mục từ menu bên trái.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-menu {
  width: 100%;
  /* max-width: 400px; */
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: grayscale(100%) opacity(0.6);
}

.menu-item span {
  font-size: 16px;
  color: #765341;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive: Điều chỉnh kích thước trên màn hình nhỏ */
@media (max-width: 768px) {
  .profile-menu {
    max-width: 300px;
    margin: 15px auto;
  }

  .menu-item {
    padding: 10px 12px;
    gap: 10px;
  }

  .menu-item img {
    width: 20px;
    height: 20px;
  }

  .menu-item span {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-menu {
    max-width: 250px;
    margin: 10px auto;
  }

  .menu-item {
    padding: 8px 10px;
    gap: 8px;
  }

  .menu-item img {
    width: 18px;
    height: 18px;
  }

  .menu-item span {
    font-size: 12px;
  }
}
</style>
