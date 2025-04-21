<!-- <script>
import { API_ENDPOINTS } from "@/constant/apiConstants";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const data = {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
      },
      passwordsMatch: false,
    };

    const methods = {
      checkPasswords() {
        data.passwordsMatch = data.form.password === data.form.confirm_password;
      },

      async SignUp() {
        try {
          const response = await fetch(API_ENDPOINTS.AC_SIGN_UP, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data.form),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", response.status, errorText);

            try {
              const errorJson = JSON.parse(errorText);
              alert(
                errorJson.message ||
                  "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
              );
            } catch (parseError) {
              alert("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
            }
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errorText}`
            );
          }

          const result = await response.json();
          console.log("Đăng ký thành công:", result);

          // Chuyển hướng đến trang sign-in
          router.push("/sign-in");
        } catch (error) {
          console.error("Lỗi khi đăng ký:", error);
          alert("Lỗi đăng ký. Vui lòng thử lại sau.");
        }
      },
    };

    return {
      form: data.form,
      passwordsMatch: data.passwordsMatch,
      checkPasswords: methods.checkPasswords,
      SignUp: methods.SignUp,
    };
  },
};
</script> -->

<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";
import { useRouter } from "vue-router";
export default {
  name: "Sign Up",
  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
      },
      passwordsMatch: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async SignUp() {
      // Kiểm tra mật khẩu trước khi gửi request
      this.checkPasswords();
      if (!this.passwordsMatch) {
        this.$message.error("Mật khẩu không khớp!");
        return;
      }
      try {
        const response = await fetch(`${API_ENDPOINTS.AC_SIGN_UP}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
          
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Chi tiết lỗi:", errorText);
          this.$message.error("Đăng ký thất bại.");
          throw new Error("Đăng ký thất bại.");
        }
        const result = await response.json();
        console.log("Đăng ký thành công:", result);

        this.$message.success("Đăng ký thành công");
        // Chuyển hướng đến trang sign-in
        setTimeout(() => {
          this.router.push("/sign-in");
        }, 2000);
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
      }
    },
    checkPasswords() {
      this.passwordsMatch = this.form.password === this.form.confirm_password; // Sửa lỗi form.password thành this.form.password
    },
  },
};
</script>

<template>
  <div class="login-wrapper">
    <section>
      <form @submit.prevent="SignUp">
        <h1>Register</h1>

        <div class="inputbox">
          <i class="fa-regular fa-envelope"></i>
          <img src="@/assets/icons/id-card.png" alt="" />
          <input type="text" v-model="form.first_name" required />
          <label for="">First Name</label>
        </div>
        <div class="inputbox">
          <i class="fa-regular fa-envelope"></i>
          <img src="@/assets/icons/id-card.png" alt="" />
          <input type="text" v-model="form.last_name" required />
          <label for="">Last Name</label>
        </div>

        <div class="inputbox">
          <i class="fa-regular fa-envelope"></i>
          <img src="@/assets/icons/email.png" alt="" />
          <input type="email" v-model="form.email" required />
          <label for="">Email</label>
        </div>

        <div class="inputbox">
          <i class="fa-regular fa-envelope"></i>
          <img src="@/assets/icons/email.png" alt="" />
          <input type="tel" v-model="form.phone_number" required />
          <label for="">Phone</label>
        </div>

        <div class="inputbox">
          <i class="fa-solid fa-lock"></i>
          <img src="@/assets/icons/padlock.png" alt="" />
          <input type="password" v-model="form.password" required />
          <label for="">Password</label>
        </div>

        <div class="inputbox">
          <i class="fa-solid fa-lock"></i>
          <img v-if="!passwordsMatch" src="@/assets/icons/padlock.png" alt="" />
          <img v-else src="@/assets/icons/check.png" alt="" />
          <input type="password" v-model="form.confirm_password" required />
          <label for="">Confirm Password</label>
        </div>

        <!-- <div class="forget">
          <div class="remember-me">
            <label for=""><input type="checkbox" />Remember Me</label>
          </div>
          <a href="#">Forget Password</a>
        </div> -->

        <button type="submit">Sign Up</button>

        <div class="login">
          <p>Already have an account? <a href="/sign-in">Sign in</a></p>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "poppins", "sans-serif";
}

.login-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/bg-login.jpg"); /* Thêm ảnh nền vào div */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

section {
  position: relative;
  max-width: 400px;
  width: 100%;
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(55px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
  box-sizing: border-box;
}

h1 {
  font-size: 2rem;
  color: #fff;
  text-align: center;
}

.inputbox {
  position: relative;
  margin: 10px 0;
  max-width: 310px;
  border-bottom: 2px solid #fff;
}

.inputbox label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-5%);
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.5s ease-in-out;
}

input:focus ~ label,
input:valid ~ label {
  top: -5px;
}

.inputbox input {
  width: 100%;
  height: 60px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0 35px 0 5px;
  color: #fff;
}

.inputbox img {
  position: absolute;
  right: 8px;
  width: 10%;
  color: #fff;
  font-size: 1.2rem;
  top: 20px;
}

.remember-me label {
  display: flex;
}

.forget {
  margin: 35px 0;
  font-size: 0.85rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forget a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.forget a:hover {
  text-decoration: underline;
}

button {
  width: 100%;
  height: 40px;
  border-radius: 40px;
  background-color: rgb(255, 255, 255, 1);
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.4s ease;
}

button:hover {
  background-color: rgb(255, 255, 255, 0.5);
}

.login {
  font-size: 0.9rem;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.login p a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}

.login p a:hover {
  text-decoration: underline;
}
</style>
