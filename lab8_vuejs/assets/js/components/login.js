const Login = {
  template: `
        <div class="login-container">
            <div class="login-box">
                <h2>Form Login Admin</h2>

                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label>Username / Email</label>
                        <input type="text"
                               v-model="username"
                               placeholder="Masukkan username atau email"
                               required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password"
                               v-model="password"
                               placeholder="Masukkan password"
                               required>
                    </div>
                    <button type="submit"
                            class="btn-login"
                            :disabled="loading">
                        {{ loading ? 'Memproses...' : 'Masuk Aplikasi' }}
                    </button>
                </form>

                <!-- Pesan error dari server -->
                <p v-if="errorMessage" class="error-msg">
                    {{ errorMessage }}
                </p>
            </div>
        </div>
    `,

  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },

  methods: {
    handleLogin() {
      this.loading = true;
      this.errorMessage = "";

      // Kirim kredensial ke endpoint API CI4
      axios
        .post(apiUrl + "/api/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.data.status === 200) {
            // Simpan status login dan token ke localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userToken", response.data.data.token);
            localStorage.setItem("userName", response.data.data.username);

            // Redirect ke halaman artikel
            // Pakai window.location.reload agar state navbar terupdate
            window.location.href = "/#/artikel";
            window.location.reload();
          }
        })
        .catch((error) => {
          if (error.response && error.response.data.messages) {
            this.errorMessage = error.response.data.messages;
          } else {
            this.errorMessage = "Terjadi kesalahan koneksi ke server.";
          }
          this.loading = false;
        });
    },
  },
};
