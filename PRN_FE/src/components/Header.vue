<script>
import { API_ENDPOINTS, VARIABLE } from "@/constant/apiConstants";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";

export default {
  name: "Header",
  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        roles: [],
      },
      isHost: false,
      isCustomer: false,
      isAuthenticated: false,
      errorMessage: "",
      successMessage: "",
      tokenCheckInterval: null,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
    this.checkAuth();
    if (this.isAuthenticated) {
      this.fetchProfile();
    }
    this.startTokenExpirationCheck();
  },
  beforeUnmount() {
    this.stopTokenExpirationCheck();
  },
  methods: {
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
          this.form.first_name = data.data.first_name || "";
          this.form.last_name = data.data.last_name || "";
          this.form.email = data.data.email || "";
          this.form.phone_number = data.data.phone_number || "";
          this.form.roles = data.data.roles || [];

          if (this.checkRole(this.form.roles, VARIABLE.HOST)) {
            this.isHost = true;
          } else if (this.checkRole(this.form.roles, VARIABLE.CUSTOMER)) {
            this.isCustomer = true;
          } else {
            console.log("Role not found!");
          }

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
    checkAuth() {
      const token = localStorage.getItem("token");
      // this.isAuthenticated = !!token;
      if (!token) {
        this.isAuthenticated = false;
        return;
      }
      // Check if the token is expired
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp < currentTime) {
          console.log("Token is expired on checkAuth. Logging out...");
          this.errorMessage = "Your session has expired. Please sign in again.";
          this.logout();
          return;
        }
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Invalid token:", error);
        this.errorMessage = "Invalid token. Please sign in again.";
        this.logout();
      }
    },
    startTokenExpirationCheck() {
      // Check token expiration every 30 seconds
      this.tokenCheckInterval = setInterval(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          if (this.isAuthenticated) {
            console.log("Token removed externally. Logging out...");
            this.errorMessage = "Your session has ended. Please sign in again.";
            this.logout();
          }
          this.stopTokenExpirationCheck();
          this.isAuthenticated = false;
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < currentTime) {
            console.log("Token expired during periodic check. Logging out...");
            this.errorMessage =
              "Your session has expired. Please sign in again.";
            this.logout();
            this.stopTokenExpirationCheck();
          }
        } catch (error) {
          console.error("Invalid token during periodic check:", error);
          this.errorMessage = "Invalid token. Please sign in again.";
          this.logout();
          this.stopTokenExpirationCheck();
        }
      }, 30000); // Check every 30 seconds
    },
    stopTokenExpirationCheck() {
      if (this.tokenCheckInterval) {
        clearInterval(this.tokenCheckInterval);
        this.tokenCheckInterval = null;
      }
    },

    logout() {
      localStorage.removeItem("token");
      this.isAuthenticated = false;
      this.form = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      };
      // setTimeout(() => {
      this.$router.push("/home");
      // }, 1000);
    },
    checkRole(roles, role_name) {
      return roles.includes(role_name);
    },
  },
};
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-brown">
      <div class="container-fluid">
        <!-- Brand/Logo -->
        <router-link class="navbar-brand" to="/home">EasyBooking</router-link>

        <!-- Navbar Toggler for Mobile -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/home"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/about"
                >About</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/contact"
                >Contact</router-link
              >
            </li>
          </ul>

          <!-- Right Side: Authenticated vs Unauthenticated -->
          <ul class="navbar-nav ms-auto gap-2">
            <!-- Show Sign In/Sign Up if not authenticated -->
            <template v-if="!isAuthenticated">
              <li class="nav-item">
                <router-link
                  class="nav-link btn btn-light text-brown me-2 w-100"
                  to="/sign-in"
                >
                  Sign In
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link btn btn-light text-brown w-100"
                  to="/sign-up"
                >
                  Sign Up
                </router-link>
              </li>
            </template>

            <!-- Show Create button and Dropdown if authenticated -->
            <template v-if="isAuthenticated">
              <li class="nav-item" v-if="isCustomer">
                <router-link
                  class="nav-link btn btn-light text-brown w-100"
                  to="/create-host"
                >
                  Create partner account
                </router-link>
              </li>

              <li class="nav-item" v-if="isHost">
                <router-link
                  class="nav-link btn btn-light text-brown w-100"
                  to="/create-post"
                >
                  List your property
                </router-link>
              </li>

              <!-- Show Dropdown if authenticated -->
              <li class="nav-item dropdown" v-if="isAuthenticated">
                <a
                  class="nav-link dropdown-toggle text-white"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hello
                  {{
                    form.first_name && form.last_name
                      ? form.first_name + " " + form.last_name
                      : "User"
                  }}
                </a>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <router-link class="dropdown-item" to="/profile">
                      Profile
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      class="dropdown-item"
                      to="/sign-in"
                      @click="logout"
                    >
                      Logout
                    </router-link>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  background-color: #765341;
  color: white;
  padding: 10px 0;
  z-index: 1000;
}

/* Custom background color for the navbar */
.bg-brown {
  background-color: #765341;
}

/* Text color for buttons */
.text-brown {
  color: #765341;
}

.navbar {
  padding: 5px 150px;
}

/* Navbar link styles */
.navbar-nav .nav-link {
  color: #6a4a3a;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}

.navbar-nav .nav-link:hover {
  color: white;
  background-color: #6a4a3a;
  border-radius: 5px;
}

/* Style for Sign In/Sign Up buttons */
.btn-light {
  background-color: white;
  border: none;
  font-weight: 500;
}

.btn-light:hover {
  background-color: #e9ecef;
}

/* Dropdown menu styles */
.dropdown-menu {
  min-width: 100%;
  padding: 0;
  margin: 0;
  border: 1px solid #dee2e6;
}

.dropdown-item {
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 0; /* Remove margin */
  box-sizing: border-box;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar-nav .nav-link {
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
  }

  .dropdown-menu {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .navbar-nav .nav-link {
    font-size: 0.8rem;
    padding: 0.5rem 0.5rem;
  }
}
</style>
