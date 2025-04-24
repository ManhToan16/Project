<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";
import Header from "./Header.vue";
export default {
  name: "CreatePlace",
  components: {
    Header,
  },
  data() {
    return {
      form: {
        email: "",
      },
      errorMessage: "",
      successMessage: "",
      isLoading: false,
    };
  },
  async created() {
    await this.fetchProfile();
  },

  methods: {
    async CreateHost() {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "Please sign in.";
        setTimeout(() => {
          this.$router.push("/sign-in"); // Redirect to sign-in page
        }, 2000);
        return;
      }

      // Validate email input
      if (!this.form.email) {
        this.errorMessage = "Please enter an email address.";
        this.isLoading = false;
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.AC_CREATE_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: this.form.email }),
        });

        const rs = await response.json();

        console.log(rs);

        if (rs.statusCode === 200) {
          this.$message.success("Host account created successfully!");
          setTimeout(() => {
            this.$router.push("/sign-in"); // Redirect to sign-in page
          }, 1000);
          // setTimeout(() => {
          //   this.$router.push("/profile"); // Redirect to profile or another page
          // }, 2000);
        } else {
          this.errorMessage = rs.message || "Failed to create host account.";
        }
      } catch (error) {
        this.errorMessage = "An error occurred: " + error.message;
      }
    },
    async fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "No token found. Please sign in.";
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.AC_PROFILE, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // throw new Error(`Failed to fetch profile: ${response.statusText}`);
          this.logout();
          this.stopTokenExpirationCheck();
          return;
        }

        const data = await response.json();
        if (data.statusCode === 200 && data.data) {
          // this.form.first_name = data.data.first_name || "";
          // this.form.last_name = data.data.last_name || "";
          this.form.email = data.data.email || "";
          // this.form.phone_number = data.data.phone_number || "";
          // this.form.roles = data.data.roles || [];

          // if (this.checkRole(this.form.roles, VARIABLE.HOST)) {
          //   this.isHost = true;
          // } else if (this.checkRole(this.form.roles, VARIABLE.CUSTOMER)) {
          //   this.isCustomer = true;
          // } else {
          //   console.log("Role not found!");
          // }

          this.successMessage = "Profile fetched successfully!";
          // console.log("Profile data:", data);
        } else {
          console.log("Error fetch profile!");
        }
      } catch (error) {
        this.errorMessage = error.message || "Error fetching profile.";
        console.error("Profile fetch error:", error);
        // If the token is invalid (e.g., expired), log the user out
        // if (error.message.includes("401")) {
        this.logout();
        // }
      }
    },
  },
};
</script>
<template>
  <Header />

  <div class="container d-flex align-items-center justify-content-center mt-5">
    <div class="card p-4 shadow mt-5" style="max-width: 500px; width: 100%">
      <!-- Title -->
      <h1 class="text-center mb-2">Tạo tài khoản đối tác</h1>

      <!-- Subtitle -->
      <p class="text-center text-muted mb-4">
        Tạo tài khoản để đăng ký và quản lý chỗ nghỉ của bạn.
      </p>

      <!-- Form -->
      <form @submit.prevent="CreateHost">
        <!-- Email Input -->
        <div class="mb-3">
          <label for="email" class="form-label">Địa chỉ email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="form.email"
            disabled
          />
        </div>

        <!-- thông báo -->
        <!-- <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3">
          {{ successMessage }}
        </div> -->

        <!-- Continue Button -->
        <button type="submit" class="btn btn-primary w-100 mb-3">
          Tiếp tục
        </button>

        <!-- Sign In Button -->
        <!-- <router-link to="/sign-in" class="btn btn-outline-primary w-100"
          >Đăng nhập</router-link
        > -->
      </form>

      <!-- Description -->
      <p class="text-muted text-center mt-4">
        Quý vị có thể sử dụng email cá nhân hoặc email chuyên nghiệp của mình
        hay extranet.
        <a href="#" class="text-primary">Hãy ghé Trung Tâm giúp đỡ</a> để tìm
        hiểu thêm.
      </p>

      <!-- Terms -->
      <p class="text-muted text-center small mt-3">
        Với việc đăng ký hoặc tạo tài khoản, bạn đồng ý với các
        <a href="#" class="text-primary">Điều khoản và Điều kiện Chung</a> của
        chúng tôi cùng
        <a href="#" class="text-primary">Chính Sách An toàn và Bảo mật.</a>
      </p>

      <!-- Footer -->
      <p class="text-muted text-center small mt-3">
        Bảo lưu mọi quyền. ©2025 EasyBooking.com™
      </p>
    </div>
  </div>
</template>

<style scoped>
.create_wrap p {
  padding-top: 50px;
}

/* Card styling */
.card {
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

/* Title */
h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a1a;
}

/* Subtitle */
.text-muted {
  color: #6c757d !important;
  font-size: 0.9rem;
}

/* Form input */
.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ced4da;
  padding: 0.75rem;
  font-size: 0.9rem;
}

.form-control::placeholder {
  color: #6c757d;
}

/* Buttons */
.btn-primary {
  background-color: #003580;
  border-color: #003580;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
}

.btn-primary:hover {
  background-color: #002a66;
  border-color: white;
}

.btn-outline-primary {
  border-color: #003580;
  color: #003580;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
}

.btn-outline-primary:hover {
  background-color: #f8f9fa;
  border-color: #003580;
}
</style>
