<script>
import { useRouter } from "vue-router";
import { API_ENDPOINTS } from "@/constant/apiConstants";
export default {
  name: "PasswordUpdate",
  data() {
    return {
      form: {
        cur_pw: "",
        new_pw: "",
        cf_pw: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
  methods: {
    async updatePassword() {
      // Kiểm tra rỗng
      if (!this.form.cur_pw || !this.form.new_pw || !this.form.cf_pw) {
        this.errorMessage = "Không được để trống.";
        return;
      }
      // Kiểm tra xem mật khẩu mới và xác nhận có khớp không
      if (this.form.new_pw !== this.form.cf_pw) {
        this.errorMessage = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
        return;
      }
      // Lấy token từ localStorage (giả sử đã lưu token sau khi đăng nhập)
      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "Không tìm thấy token xác thực.";
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.AC_CHGPWD, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: this.form.cur_pw,
            new_password: this.form.new_pw,
          }),
        });

        if (!response.ok) {
          throw new Error("Yêu cầu thất bại với status: " + response.message);
        }

        const data = await response.json();

        // Xử lý phản hồi thành công
        this.successMessage = "Cập nhật mật khẩu thành công!";
        this.errorMessage = "";
        this.form.cur_pw = "";
        this.form.new_pw = "";
        this.form.cf_pw = "";

        // Xóa token trong localStorage
        localStorage.removeItem("token");

        // Điều hướng về trang /sign-in sau 1.5 giây (tùy chọn để người dùng thấy thông báo)
        setTimeout(() => {
          this.router.push("/sign-in");
        }, 1500); // Chờ 1 giây trước khi điều hướng
      } catch (error) {
        // Xử lý lỗi từ API
        this.errorMessage =
          error.message || "Có lỗi xảy ra khi cập nhật mật khẩu.";
      }
    },
  },
};
</script>

<template>
  <div class="content-area">
    <div class="container">
      <div class="pw-header">
        <h2>Cài đặt bảo mật</h2>
        <p>
          Thay đổi thiết lập bảo mật, cài đặt xác thực bổ sung giúp bảo vệ tài
          khoản của bạn.
        </p>
      </div>
    </div>

    <!-- Hiển thị lỗi hoặc thành công -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success mt-3">
      {{ successMessage }}
    </div>

    <div class="pw-details">
      <div class="row detail-row">
        <div class="col-md-8">
          <div class="detail-value">
            <input
              type="password"
              v-model="form.cur_pw"
              placeholder="Mật khẩu cũ"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div class="pw-details mt-2">
      <div class="row detail-row">
        <div class="col-md-8">
          <div class="detail-value">
            <input
              type="password"
              v-model="form.new_pw"
              placeholder="Xác nhận mật khẩu mới"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div class="pw-details mt-2">
      <div class="row detail-row">
        <div class="col-md-8">
          <div class="detail-value">
            <input
              type="password"
              v-model="form.cf_pw"
              placeholder="Xác nhận mật khẩu mới"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-8 mt-2">
      <button class="btn w-75 set_pw" @click="updatePassword">
        Đặt mật khẩu
      </button>
    </div>
  </div>
</template>

<style scoped>
.content-area {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.pw-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.pw-header p {
  font-size: 14px;
  color: #666;
}

.pw-details {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.detail-value input {
  width: 80%;
  border: #666;
}

.set_pw {
  background-color: white;
  color: #765341;
  border: #666;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.set_pw:hover {
  background-color: #765341;
  color: white;
}
</style>
