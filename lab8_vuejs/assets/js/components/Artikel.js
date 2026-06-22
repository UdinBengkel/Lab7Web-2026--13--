const Artikel = {
  template: `
        <div>
            <h2>Manajemen Data Artikel</h2>

            <button id="btn-tambah" @click="tambah">Tambah Data</button>

            <!-- Modal Form Tambah / Edit -->
            <div class="modal" v-if="showForm">
                <div class="modal-content">
                    <span class="close" @click="showForm = false">&times;</span>
                    <form id="form-data" @submit.prevent="saveData">
                        <h3>{{ formTitle }}</h3>
                        <div>
                            <input type="text"
                                   v-model="formData.judul"
                                   placeholder="Judul Artikel"
                                   required>
                        </div>
                        <div>
                            <textarea v-model="formData.isi"
                                      rows="6"
                                      placeholder="Isi Artikel"></textarea>
                        </div>
                        <div>
                            <select v-model="formData.status">
                                <option v-for="opt in statusOptions"
                                        :value="opt.value"
                                        :key="opt.value">
                                    {{ opt.text }}
                                </option>
                            </select>
                        </div>
                        <input type="hidden" v-model="formData.id">
                        <button type="submit" id="btnSimpan">Simpan</button>
                        <button type="button" @click="showForm = false">Batal</button>
                    </form>
                </div>
            </div>

            <!-- Tabel Data -->
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Judul</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="artikel.length === 0">
                        <td colspan="4" style="text-align:center; color:#999;">
                            Tidak ada data.
                        </td>
                    </tr>
                    <tr v-for="(row, index) in artikel" :key="row.id">
                        <td class="center-text">{{ row.id }}</td>
                        <td>{{ row.judul }}</td>
                        <td>{{ statusText(row.status) }}</td>
                        <td class="center-text">
                            <a href="#" @click.prevent="edit(row)">Edit</a>
                            <a href="#" @click.prevent="hapus(index, row.id)">Hapus</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

  data() {
    return {
      artikel: [],
      formData: { id: null, judul: "", isi: "", status: 0 },
      showForm: false,
      formTitle: "Tambah Data",
      statusOptions: [
        { text: "Draft", value: 0 },
        { text: "Publish", value: 1 },
      ],
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      axios
        .get(apiUrl + "/post")
        .then((response) => {
          this.artikel = response.data.artikel;
        })
        .catch((error) => console.log(error));
    },

    tambah() {
      this.showForm = true;
      this.formTitle = "Tambah Data";
      this.formData = { id: null, judul: "", isi: "", status: 0 };
    },

    edit(data) {
      this.showForm = true;
      this.formTitle = "Ubah Data";
      this.formData = {
        id: data.id,
        judul: data.judul,
        isi: data.isi,
        status: data.status,
      };
    },

    hapus(index, id) {
      if (confirm("Yakin menghapus data?")) {
        axios
          .delete(apiUrl + "/post/" + id)
          .then(() => {
            this.artikel.splice(index, 1);
          })
          .catch((error) => console.log(error));
      }
    },

    saveData() {
      if (this.formData.id) {
        axios
          .put(apiUrl + "/post/" + this.formData.id, this.formData)
          .then(() => {
            this.loadData();
          })
          .catch((error) => console.log(error));
      } else {
        axios
          .post(apiUrl + "/post", this.formData)
          .then(() => {
            this.loadData();
          })
          .catch((error) => console.log(error));
      }
      this.formData = { id: null, judul: "", isi: "", status: 0 };
      this.showForm = false;
    },

    statusText(status) {
      if (!status) return "Draft";
      return status == 1 ? "Publish" : "Draft";
    },
  },
};
