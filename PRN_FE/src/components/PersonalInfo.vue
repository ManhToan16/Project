<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";
export default {
  name: "PersonalInfo",
  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        avatar: "",
      },
      errorMessage: "",
      successMessage: "",
      showPopup: false,
      selectedFile: null,
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      this.errorMessage = "";
      this.successMessage = "";

      // Lấy token từ localStorage (giả sử đã lưu token sau khi đăng nhập)
      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "Không tìm thấy token xác thực.";
        this.isLoading = false;
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
          throw new Error("Yêu cầu thất bại với status: " + response.message);
        }

        const data = await response.json();

        // Giả sử data từ API là BaseDataResponse<UserModel> với thuộc tính data chứa UserModel
        if (data.statusCode === 200 && data.data) {
          this.form.first_name = data.data.first_name || "";
          this.form.last_name = data.data.last_name || "";
          this.form.email = data.data.email || "";
          this.form.phone_number = data.data.phone_number || "";
          this.form.avatar = data.data.avatar || "";
          this.successMessage = "Lấy thông tin người dùng thành công!";

          // Xóa successMessage sau 2 giây (2000ms)
          setTimeout(() => {
            this.successMessage = "";
          }, 2000);
        } else {
          this.errorMessage =
            data.message || "Không thể lấy thông tin người dùng.";
          setTimeout(() => {
            this.errorMessage = "";
          }, 2000);
        }
      } catch (error) {
        this.errorMessage =
          error.message || "Có lỗi xảy ra khi lấy thông tin người dùng.";
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      } finally {
        this.isLoading = false;
      }
    },

    // Hàm validate form trước khi gửi
    validateField(fieldName, value) {
      if (!value || value.trim() === "") {
        this.errorMessage = `${fieldName} không được để trống.`;
        return false;
      }
      this.errorMessage = "";
      return true;
    },

    // check format email
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // check format phone_number
    isValidPhoneNumber(phone) {
      const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
      return phoneRegex.test(phone);
    },

    // Hàm gọi API để cập nhật thông tin
    async updateProfile(field) {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      // Lấy token từ localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "Không tìm thấy token xác thực.";
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
        this.isLoading = false;
        return;
      }

      // Chỉ gửi trường được chỉnh sửa
      const updateData = {};
      switch (field) {
        case "first_name":
          if (!this.validateField("Tên", this.form.first_name)) {
            this.isLoading = false;
            return;
          }
          updateData.first_name = this.form.first_name;
          break;
        case "last_name":
          if (!this.validateField("Họ", this.form.last_name)) {
            this.isLoading = false;
            return;
          }
          updateData.last_name = this.form.last_name;
          break;
        case "email":
          if (!this.validateField("Email", this.form.email)) {
            this.isLoading = false;
            return;
          }
          if (!this.isValidEmail(this.form.email)) {
            this.errorMessage = "Email không hợp lệ.";
            this.isLoading = false;
            return;
          }
          updateData.email = this.form.email;
          break;
        case "phone_number":
          if (!this.validateField("Số điện thoại", this.form.phone_number)) {
            this.isLoading = false;
            return;
          }
          if (!this.isValidPhoneNumber(this.form.phone_number)) {
            this.errorMessage = "Số điện thoại không hợp lệ.";
            this.isLoading = false;
            return;
          }
          updateData.phone_number = this.form.phone_number;
          break;
        default:
          this.errorMessage = "Trường không hợp lệ.";
          this.isLoading = false;
          return;
      }
      try {
        const response = await fetch(API_ENDPOINTS.AC_UPDATE_PROF, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error("Yêu cầu thất bại với status: " + response.status);
        }

        const data = await response.json();

        if (data.statusCode === 200) {
          this.successMessage = "Cập nhật thông tin thành công!";
          // Xóa successMessage sau 2 giây
          setTimeout(() => {
            this.successMessage = "";
          }, 2000);
        } else {
          this.errorMessage = data.message || "Không thể cập nhật thông tin.";
          setTimeout(() => {
            this.errorMessage = "";
          }, 2000);
        }
      } catch (error) {
        this.errorMessage =
          error.message || "Có lỗi xảy ra khi cập nhật thông tin.";
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      } finally {
        this.isLoading = false;
      }
    },
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.selectedFile = null; // Reset ảnh mới khi đóng popup
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        // Tùy chọn: Hiển thị preview ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
          // this.form.avatar = e.target.result; // Hiển thị preview
        };
        reader.readAsDataURL(file);
      }
    },

    async saveAvatar() {
      if (!this.selectedFile) {
        alert("Please select a file first!");
        return;
      }
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("ImageFile", this.selectedFile);
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(API_ENDPOINTS.AC_UPLOAD_AVATAR, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Upload successful:", data);
        if (data && data.url) {
          this.form.avatar = data.url; // Cập nhật avatar mới
        }
        this.closePopup();
        this.fetchUserProfile();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload avatar. Please try again.");
      }
    },
  },
};
</script>

<template>
  <div class="content-area">
    <div class="container">
      <div class="row mb-3">
        <div class="col-md-10">
          <div class="profile-header">
            <h2>Thông tin cá nhân</h2>
            <p>
              Cập nhật thông tin của bạn để tiếp tục sử dụng dịch vụ một cách
              tốt nhất.
            </p>
          </div>
        </div>
        <div class="col-md-2 d-flex align-items-center justify-content-center">
          <div class="profile-avatar">
            <div class="avatar-circle" @click="openPopup">
              <img :src="form.avatar" alt="Avatar" v-if="form.avatar" />
              <!-- Hiển thị ảnh mặc định nếu không có avatar -->
              <img
                src="@/assets/icons/user.png"
                alt="Default Avatar"
                style="width: 50%; height: 50%"
                v-else
              />
              <!-- Thêm biểu tượng camera -->
              <div class="camera-overlay">
                <img
                  src="@/assets/icons/camera.png"
                  alt="Change avatar"
                  class="camera-icon"
                  style="width: 50%; height: 50%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hiển thị lỗi hoặc thành công -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success mt-3">
      {{ successMessage }}
    </div>

    <div class="profile-details">
      <div class="row detail-row">
        <div class="col-md-2">
          <div class="detail-label">Tên</div>
        </div>
        <div class="col-md-8">
          <div class="detail-value">
            <input type="text" v-model="form.first_name" required />
          </div>
        </div>
        <div class="col-md-2">
          <button class="edit-btn" @click="updateProfile('first_name')">
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div class="row detail-row">
        <div class="col-md-2">
          <div class="detail-label">Họ</div>
        </div>
        <div class="col-md-8">
          <div class="detail-value">
            <input
              type="text"
              v-model="form.last_name"
              placeholder="Thêm họ của bạn"
              required
            />
          </div>
        </div>
        <div class="col-md-2">
          <button class="edit-btn" @click="updateProfile('last_name')">
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div class="row detail-row">
        <div class="col-md-2">
          <div class="detail-label">Địa chỉ email</div>
        </div>
        <div class="col-md-8">
          <div class="detail-value">
            <input type="text" v-model="form.email" required />
          </div>
          <p class="note">
            Đây là địa chỉ email bạn dùng để đăng nhập. Chúng tôi sẽ gửi các
            thông báo đến địa chỉ này.
          </p>
        </div>
        <div class="col-md-2">
          <button class="edit-btn" @click="updateProfile('email')">
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div class="row detail-row">
        <div class="col-md-2">
          <div class="detail-label">Số điện thoại</div>
        </div>
        <div class="col-md-8">
          <div class="detail-value">
            <input
              type="text"
              v-model="form.phone_number"
              placeholder="Thêm số điện thoại của bạn"
              required
            />
          </div>
          <p class="note">
            Chúng tôi sẽ dùng số điện thoại này để liên lạc với bạn qua số này
            nếu cần.
          </p>
        </div>
        <div class="col-md-2">
          <button class="edit-btn" @click="updateProfile('phone_number')">
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Thêm popup -->
  <transition name="fade">
    <div class="popup" v-if="showPopup" @click.self="closePopup">
      <div class="popup-content">
        <h3>Change Avatar</h3>
        <div class="container">
          <div class="row d-flex align-items-center">
            <div class="col-md-4">
              <div class="profile-avatar">
                <div
                  class="avatar-circle"
                  style="cursor: unset"
                  @click="openPopup"
                >
                  <img :src="form.avatar" alt="Avatar" v-if="form.avatar" />
                  <!-- Hiển thị ảnh mặc định nếu không có avatar -->
                  <img
                    src="@/assets/icons/user.png"
                    alt="Default Avatar"
                    style="width: 50%; height: 50%"
                    v-else
                  />
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <input
                type="file"
                style="cursor: pointer"
                @change="handleFileUpload"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <div class="popup-actions m-2">
          <button class="popup_btn" @click="closePopup">Cancel</button>
          <button class="popup_btn" @click="saveAvatar">Save</button>
        </div>
      </div>
    </div>
  </transition>
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

.profile-header {
  margin-bottom: 20px;
}

.profile-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.profile-header p {
  font-size: 14px;
  color: #666;
}

.profile-avatar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #bca89f;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.profile-details {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  flex: 1;
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.detail-value {
  flex: 2;
  color: #666;
  font-size: 16px;
}

.detail-value input {
  border: none;
  width: 70%;
  border-radius: 5px;
}

.edit-btn {
  background-color: white;
  color: #6a4a3a;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.edit-btn:hover {
  background-color: #6a4a3a;
  color: white;
  transform: scale(1.05);
}

.passport-row .edit-btn {
  background-color: #28a745; /* Màu xanh lá cho "Thêm hộ chiếu" */
}

.passport-row .edit-btn:hover {
  background-color: #1e7e34;
}

.note {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .content-area {
    padding: 15px;
  }

  .profile-header h2 {
    font-size: 20px;
  }

  .profile-header p {
    font-size: 12px;
  }

  .avatar-circle {
    width: 40px;
    height: 40px;
  }

  .avatar-text {
    font-size: 20px;
  }

  .detail-label,
  .detail-value {
    font-size: 14px;
  }

  .edit-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 10px;
  }

  .profile-header h2 {
    font-size: 18px;
  }

  .profile-header p {
    font-size: 10px;
  }

  .avatar-circle {
    width: 30px;
    height: 30px;
  }

  .avatar-text {
    font-size: 16px;
  }

  .detail-row {
    padding: 10px 0;
  }

  .detail-label,
  .detail-value {
    font-size: 12px;
  }

  .edit-btn {
    padding: 4px 10px;
    font-size: 10px;
  }

  .note {
    font-size: 10px;
  }
}

/* camera */
.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.avatar-circle:hover .camera-overlay {
  opacity: 1;
}
.camera-icon {
  width: 30px;
  height: 30px;
}

/* Style cho popup */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.popup-content h3 {
  margin-bottom: 15px;
}

.popup-content input[type="file"] {
  margin: 10px 0;
  display: block;
  width: 100%;
}

.popup-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.popup-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-actions button:first-child {
  background: #ccc;
}

.popup-actions button:last-child {
  background: #6a4a3a;
  color: white;
}

.popup-actions button:first-child:hover {
  background: gray;
}

.popup-actions button:last-child:hover {
  background: #ccc;
  color: black;
}
</style>
