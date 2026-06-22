const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const apiUrl = "http://localhost/lab7_php_ci/ci4/public";

// ════════════════════════════════════════════════════════
// AXIOS INTERCEPTORS — Otomatis suntikkan token ke Header
// ════════════════════════════════════════════════════════

// Interceptor REQUEST: dijalankan sebelum request dikirim ke server
axios.interceptors.request.use(
  function (config) {
    // Ambil token dari localStorage
    const token = localStorage.getItem("userToken");

    // Jika ada token, tambahkan ke Header Authorization
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Interceptor RESPONSE: dijalankan saat menerima response dari server
axios.interceptors.response.use(
  function (response) {
    // Jika response normal, teruskan saja
    return response;
  },
  function (error) {
    // Jika server balas dengan 401 (token tidak valid / expired)
    if (error.response && error.response.status === 401) {
      alert(
        "Sesi Anda telah berakhir atau Token tidak sah. Silakan login kembali.",
      );
      localStorage.clear(); // hapus semua data login
      window.location.href = "/#/login"; // paksa redirect ke login
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

// ════════════════════════════════════════════════════════

// ── Definisi Routes ──────────────────────────────────────
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  {
    path: "/artikel",
    component: Artikel,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    component: About,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// ── Navigation Guards ────────────────────────────────────
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    alert("Akses Ditolak! Anda harus login terlebih dahulu.");
    next("/login");
  } else {
    next();
  }
});

// ── Root App ─────────────────────────────────────────────
const app = createApp({
  data() {
    return {
      isLoggedIn: false,
      userName: "",
    };
  },

  mounted() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.userName = localStorage.getItem("userName") || "";
  },

  methods: {
    logout() {
      if (confirm("Apakah Anda yakin ingin keluar?")) {
        localStorage.clear();
        this.isLoggedIn = false;
        this.userName = "";
        this.$router.push("/");
      }
    },
  },
});

app.use(router);
app.mount("#app");
