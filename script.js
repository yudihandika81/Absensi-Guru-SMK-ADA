// Simpan data absensi ke LocalStorage
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("absensiForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = {
        nama: document.getElementById("nama").value,
        nip: document.getElementById("nip").value,
        tanggal: document.getElementById("tanggal").value,
        jam: document.getElementById("jam").value,
        status: document.getElementById("status").value,
        keterangan: document.getElementById("keterangan").value,
      };

      let absensi = JSON.parse(localStorage.getItem("absensiGuru")) || [];
      absensi.push(data);
      localStorage.setItem("absensiGuru", JSON.stringify(absensi));

      alert("Data absensi berhasil disimpan!");
      form.reset();
    });
  }

  // Jika di halaman admin, load datanya
  if (document.getElementById("dataTable")) {
    loadData();
  }
});

// ====== ADMIN LOGIN ======
const ADMIN_CODE = "smkada12"; // ganti sesuai kebutuhan

function checkCode() {
  const code = document.getElementById("adminCode").value;
  if (code === ADMIN_CODE) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadData();
  } else {
    alert("Kode salah!");
  }
}

// ====== LOAD DATA ======
function loadData() {
  const tbody = document.querySelector("#dataTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const absensi = JSON.parse(localStorage.getItem("absensiGuru")) || [];
  absensi.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.nip}</td>
      <td>${item.tanggal}</td>
      <td>${item.jam}</td>
      <td>${item.status}</td>
      <td>${item.keterangan}</td>
      <td><button onclick="hapusData(${index})">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });
}

// ====== HAPUS DATA ======
function hapusData(index) {
  let absensi = JSON.parse(localStorage.getItem("absensiGuru")) || [];
  absensi.splice(index, 1);
  localStorage.setItem("absensiGuru", JSON.stringify(absensi));
  loadData();
}

function hapusSemua() {
  if (confirm("Yakin hapus semua data?")) {
    localStorage.removeItem("absensiGuru");
    loadData();
  }
}

// ====== EXPORT TO EXCEL ======
function downloadExcel() {
  const absensi = JSON.parse(localStorage.getItem("absensiGuru")) || [];
  if (absensi.length === 0) {
    alert("Tidak ada data untuk didownload!");
    return;
  }

  let csv = "Nama,NIP/NUPTK,Tanggal,Jam,Status,Keterangan\n";
  absensi.forEach((item) => {
    csv += `${item.nama},${item.nip},${item.tanggal},${item.jam},${item.status},${item.keterangan}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "absensi_guru.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}
