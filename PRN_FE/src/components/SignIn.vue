<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";
import { useRouter } from "vue-router";

export default {
  name: "Sign In",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async SignIn() {
      try {
        const response = await fetch(`${API_ENDPOINTS.AC_SIGN_IN}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          this.$message.error("Đăng nhập thất bại.");
          throw new Error("Đăng nhập thất bại.");
        }

        const result = await response.json();
        if (result.data) {
          localStorage.setItem("token", result.data);
          this.router.push("/home");
        }
      } catch (error) {
        console.log("Sign-in error:", error);
        // this.$message.error("Lỗi đăng nhập. Hãy thử lại.");
      }
    },
  },
};
</script>

<template>
  <div class="login-wrapper">
    <section>
      <form @submit.prevent="SignIn">
        <h1>Login</h1>
        <div class="inputbox">
          <i class="fa-regular fa-envelope"></i>
          <img src="@/assets/icons/email.png" alt="" />
          <input type="email" v-model="form.email" required />
          <label for="">Email</label>
        </div>

        <div class="inputbox">
          <i class="fa-solid fa-lock"></i>
          <img src="@/assets/icons/padlock.png" alt="" />
          <input type="password" v-model="form.password" required />
          <label for="">Password</label>
        </div>

        <div class="forget">
          <div class="remember-me">
            <label for=""><input type="checkbox" />Remember Me</label>
          </div>
          <a href="#">Forget Password</a>
        </div>

        <button type="submit">Sign in</button>

        <div class="register">
          <p>Don't have an account? <a href="/sign-up">Sign up now</a></p>
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
  background-image: url("@/assets/bg-login.jpg");
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
  margin: 30px 0;
  max-width: 310px;
  border-bottom: 2px solid #fff;
}

.inputbox label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
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

.register {
  font-size: 0.9rem;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.register p a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}

.register p a:hover {
  text-decoration: underline;
}
</style>
