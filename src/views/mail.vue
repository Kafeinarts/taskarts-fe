<template>
  <div class="container mt-3" data-aos="fade-up">
    <div class="text-center">
      <h2>Mail Builder</h2>
      <p class="text-muted">Generate Surat Perintah Kerja & Invoice</p>
    </div>

    <div class="card p-3 mb-4">
      <h5>Tambah Item Pengerjaan</h5>
      <div class="row g-2">
        <div class="col-md-3">
          <input
            type="text"
            class="form-control"
            v-model="newItem.nama"
            placeholder="Nama Pengerjaan"
          />
        </div>
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            v-model="newItem.tujuan"
            placeholder="Tujuan Pembelian"
          />
        </div>
        <div class="col-md-3">
          <input
            type="number"
            class="form-control"
            v-model="newItem.biaya"
            placeholder="Biaya (Rp)"
          />
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" @click="addItem">Tambah</button>
        </div>
        <button class="btn btn-success" @click="printDocument">
        🖨️ Print Surat
      </button>
      </div>
    </div>

    <div
      id="printArea"
      class="border p-4 bg-white shadow rounded"
      style="min-height: 600px"
    >
      <h3 contenteditable="true" class="text-center fw-bold">
        Robust Tech Studio
      </h3>
      <p contenteditable="true" class="text-center">Web & IT Solution</p>
      <hr />
      <p>
        Dengan ini menyatakan bahwa proyek akan dikerjakan selama
        <strong contenteditable="true">{{
          form.durasi || "[Durasi Hari]"
        }}</strong>
        hari dengan nilai sebesar
        <strong>Rp {{ totalBiaya.toLocaleString("id-ID") }}</strong
        >.
      </p>
      <p contenteditable="true">
        Proyek ini mencakup:
        <em>{{ form.deskripsi || "[Deskripsi Pekerjaan]" }}</em>
      </p>

      <table class="table table-bordered mt-4">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nama Pengerjaan</th>
            <th>Tujuan Pembelian</th>
            <th>Biaya (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.tujuan }}</td>
            <td>{{ parseInt(item.biaya).toLocaleString("id-ID") }}</td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between mt-5">
        <div>
          <p><strong>Pihak Pembuat</strong></p>
          <br /><br />
          <p>____________________</p>
          <p contenteditable="true">Arif Alexander</p> 
        </div>
        <div>
          <p><strong>Klien</strong></p>
          <br /><br />
          <p>____________________</p>
          <p contenteditable="true">{{ form.klien || "[Nama Klien]" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MailBuilderPrint",
  data() {
    return {
      form: {
        durasi: "",
        deskripsi: "",
        klien: "",
      },
      newItem: {
        nama: "",
        tujuan: "",
        biaya: "",
      },
      items: [],
    };
  },
  computed: {
    totalBiaya() {
      return this.items.reduce(
        (sum, item) => sum + parseInt(item.biaya || 0),
        0
      );
    },
  },
  methods: {
    addItem() {
      if (this.newItem.nama && this.newItem.tujuan && this.newItem.biaya) {
        this.items.push({ ...this.newItem });
        this.newItem.nama = "";
        this.newItem.tujuan = "";
        this.newItem.biaya = "";
      }
    },
    printDocument() {
      const printContents = document.getElementById("printArea").innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      location.reload();
    },
  },
};
</script>

<style scoped>
#printArea:focus {
  outline: none;
}
</style>
