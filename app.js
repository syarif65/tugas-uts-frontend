
const $ = (selector) => document.querySelector(selector);

// DATA CONTOH
const contohLahan = [
    {
        id: 1,
        nama: "Lahan Melati",
        lokasi: "Banyuwangi",
        luas: 2.5,
        kondisi: "Baik"
    },
    {
        id: 2,
        nama: "Lahan Kenanga",
        lokasi: "Jember",
        luas: 1.8,
        kondisi: "Baik"
    },
    {
        id: 3,
        nama: "Lahan Mawar",
        lokasi: "Bondowoso",
        luas: 3.2,
        kondisi: "Perlu Perawatan"
    }
];

const contohTanaman = [
    {
        id: 1,
        nama: "Padi",
        lahanId: 1,
        tanggal: "2026-09-10",
        status: "Dalam Perawatan"
    },
    {
        id: 2,
        nama: "Jagung",
        lahanId: 2,
        tanggal: "2026-07-01",
        status: "Siap Panen"
    },
    {
        id: 3,
        nama: "Cabai",
        lahanId: 3,
        tanggal: "2026-09-20",
        status: "Dalam Perawatan"
    }
];

// PENYIMPANAN DATA
let lahan =
    JSON.parse(localStorage.getItem("agrimanage_lahan")) ||
    contohLahan;

let tanaman =
    JSON.parse(localStorage.getItem("agrimanage_tanaman")) ||
    contohTanaman;

let jenisForm = "";

function simpanData() {
    localStorage.setItem(
        "agrimanage_lahan",
        JSON.stringify(lahan)
    );

    localStorage.setItem(
        "agrimanage_tanaman",
        JSON.stringify(tanaman)
    );
}

// FORMAT TANGGAL
function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    return new Date(tanggal + "T00:00:00")
        .toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}

// STATUS
function statusClass(status) {
    if (status === "Siap Panen" || status === "Baik") {
        return "status";
    }

    if (status === "Perlu Perawatan") {
        return "status warning";
    }

    return "status neutral";
}

// NAMA LAHAN
function namaLahan(id) {
    return lahan.find(
        item => item.id === Number(id)
    )?.nama || "Lahan dihapus";
}

// DASHBOARD
function renderDashboard() {

    $("#stat-lahan").textContent = lahan.length;

    $("#stat-tanaman").textContent = tanaman.length;

    const totalLuas = lahan.reduce(
        (total, item) => total + Number(item.luas),
        0
    );

    $("#stat-luas").innerHTML =
        `${totalLuas.toLocaleString("id-ID")} <small>Ha</small>`;

    $("#stat-panen").textContent =
        tanaman.filter(
            item => item.status === "Siap Panen"
        ).length;

    $("#dashboard-lahan").innerHTML =
        lahan.slice(0, 4).map(item => `
            <tr>
                <td><strong>${item.nama}</strong></td>
                <td>${item.lokasi}</td>
                <td>${item.luas} Ha</td>
                <td>
                    <span class="${statusClass(item.kondisi)}">
                        ${item.kondisi}
                    </span>
                </td>
            </tr>
        `).join("") ||
        `<tr><td colspan="4">Belum ada data lahan.</td></tr>`;

    $("#dashboard-tanaman").innerHTML =
        tanaman.slice(0, 5).map(item => `
            <div class="activity">
                <div class="crop-icon">🌿</div>

                <div>
                    <strong>${item.nama}</strong>
                    <small>
                        ${namaLahan(item.lahanId)}
                        · ${formatTanggal(item.tanggal)}
                    </small>
                </div>

                <span class="${statusClass(item.status)}">
                    ${item.status}
                </span>
            </div>
        `).join("") ||
        `<p>Belum ada data tanaman.</p>`;
}

// TABEL LAHAN
function renderLahan(keyword = "") {

    const filtered = lahan.filter(item =>
        `${item.nama} ${item.lokasi}`
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    $("#lahan-table").innerHTML =
        filtered.map(item => `
            <tr>
                <td><strong>${item.nama}</strong></td>
                <td>${item.lokasi}</td>
                <td>${item.luas}</td>

                <td>
                    <span class="${statusClass(item.kondisi)}">
                        ${item.kondisi}
                    </span>
                </td>

                <td>
                    <button class="text-button"
                        onclick="editLahan(${item.id})">
                        Edit
                    </button>

                    <button class="text-button"
                        onclick="hapusLahan(${item.id})">
                        Hapus
                    </button>
                </td>
            </tr>
        `).join("") ||
        `<tr><td colspan="5">Data lahan tidak ditemukan.</td></tr>`;
}

// TABEL TANAMAN
function renderTanaman(keyword = "") {

    const filtered = tanaman.filter(item =>
        `${item.nama} ${namaLahan(item.lahanId)}`
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    $("#tanaman-table").innerHTML =
        filtered.map(item => `
            <tr>
                <td><strong>${item.nama}</strong></td>
                <td>${namaLahan(item.lahanId)}</td>
                <td>${formatTanggal(item.tanggal)}</td>

                <td>
                    <span class="${statusClass(item.status)}">
                        ${item.status}
                    </span>
                </td>

                <td>
                    <button class="text-button"
                        onclick="editTanaman(${item.id})">
                        Edit
                    </button>

                    <button class="text-button"
                        onclick="hapusTanaman(${item.id})">
                        Hapus
                    </button>
                </td>
            </tr>
        `).join("") ||
        `<tr><td colspan="5">Data tanaman tidak ditemukan.</td></tr>`;
}

// TABEL PANEN
function renderPanen() {

    const siapPanen = tanaman.filter(
        item => item.status === "Siap Panen"
    );

    $("#panen-table").innerHTML =
        siapPanen.map(item => `
            <tr>
                <td><strong>${item.nama}</strong></td>
                <td>${namaLahan(item.lahanId)}</td>
                <td>${formatTanggal(item.tanggal)}</td>
                <td><span class="status">Siap Panen</span></td>
            </tr>
        `).join("") ||
        `<tr><td colspan="4">Belum ada tanaman yang siap panen.</td></tr>`;
}

// RENDER SEMUA DATA
function renderSemua() {
    renderDashboard();
    renderLahan($("#search-lahan").value);
    renderTanaman($("#search-tanaman").value);
    renderPanen();
}

// NAVIGASI HALAMAN
function pindahHalaman(page) {

    document.querySelectorAll(".page").forEach(el => {
        el.classList.add("hidden");
    });

    $(`#${page}-page`).classList.remove("hidden");

    document.querySelectorAll(".nav-link").forEach(el => {
        el.classList.toggle(
            "active",
            el.dataset.page === page
        );
    });

    const judul = {
        dashboard: "Dashboard",
        lahan: "Data Lahan",
        tanaman: "Data Tanaman",
        panen: "Data Panen"
    };

    $("#page-title").textContent = judul[page];
}

document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", () => {
        pindahHalaman(button.dataset.page);
    });
});

document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", () => {
        pindahHalaman(button.dataset.goto);
    });
});

// PENCARIAN
$("#search-lahan").addEventListener("input", event => {
    renderLahan(event.target.value);
});

$("#search-tanaman").addEventListener("input", event => {
    renderTanaman(event.target.value);
});

// FORM TAMBAH DAN EDIT
function bukaForm(jenis, data = null) {

    jenisForm = jenis;

    $("#dialog-title").textContent =
        `${data ? "Edit" : "Tambah"} Data ${
            jenis === "lahan" ? "Lahan" : "Tanaman"
        }`;

    const fields = jenis === "lahan"

        ? `
            <div class="field">
                <label>Nama Lahan</label>
                <input name="nama" required
                    value="${data?.nama || ""}"
                    placeholder="Contoh: Lahan Melati">
            </div>

            <div class="field">
                <label>Lokasi</label>
                <input name="lokasi" required
                    value="${data?.lokasi || ""}"
                    placeholder="Contoh: Banyuwangi">
            </div>

            <div class="field">
                <label>Luas (Hektare)</label>
                <input name="luas" type="number"
                    min="0.01" step="0.01" required
                    value="${data?.luas || ""}">
            </div>

            <div class="field">
                <label>Kondisi</label>
                <select name="kondisi">
                    <option ${data?.kondisi === "Baik" ? "selected" : ""}>
                        Baik
                    </option>
                    <option ${data?.kondisi === "Perlu Perawatan" ? "selected" : ""}>
                        Perlu Perawatan
                    </option>
                </select>
            </div>
        `

        : `
            <div class="field">
                <label>Nama Tanaman</label>
                <input name="nama" required
                    value="${data?.nama || ""}"
                    placeholder="Contoh: Padi">
            </div>

            <div class="field">
                <label>Lahan</label>
                <select name="lahanId" required>
                    ${lahan.map(item => `
                        <option value="${item.id}"
                            ${Number(data?.lahanId) === item.id ? "selected" : ""}>
                            ${item.nama}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="field">
                <label>Tanggal Tanam</label>
                <input name="tanggal" type="date" required
                    value="${data?.tanggal || ""}">
            </div>

            <div class="field">
                <label>Status</label>
                <select name="status">
                    <option>Dalam Perawatan</option>
                    <option ${data?.status === "Siap Panen" ? "selected" : ""}>
                        Siap Panen
                    </option>
                    <option ${data?.status === "Sudah Dipanen" ? "selected" : ""}>
                        Sudah Dipanen
                    </option>
                </select>
            </div>
        `;

    $("#form-fields").innerHTML = fields;

    $("#data-form").dataset.editId = data?.id || "";

    $("#data-dialog").showModal();
}

// TOMBOL TAMBAH
$("#add-lahan").addEventListener("click", () => {
    bukaForm("lahan");
});

$("#add-tanaman").addEventListener("click", () => {

    if (!lahan.length) {
        alert("Tambahkan data lahan terlebih dahulu.");
        return;
    }

    bukaForm("tanaman");
});

// TUTUP FORM
$("#close-dialog").addEventListener("click", () => {
    $("#data-dialog").close();
});

$("#cancel-dialog").addEventListener("click", () => {
    $("#data-dialog").close();
});

// SIMPAN FORM
$("#data-form").addEventListener("submit", event => {

    event.preventDefault();

    const formData = Object.fromEntries(
        new FormData(event.target).entries()
    );

    const editId = Number(event.target.dataset.editId);

    if (jenisForm === "lahan") {

        const data = {
            ...formData,
            luas: Number(formData.luas)
        };

        if (editId) {
            lahan = lahan.map(item =>
                item.id === editId
                    ? { ...item, ...data }
                    : item
            );
        } else {
            lahan.push({
                id: Date.now(),
                ...data
            });
        }

    } else {

        const data = {
            ...formData,
            lahanId: Number(formData.lahanId)
        };

        if (editId) {
            tanaman = tanaman.map(item =>
                item.id === editId
                    ? { ...item, ...data }
                    : item
            );
        } else {
            tanaman.push({
                id: Date.now(),
                ...data
            });
        }
    }

    simpanData();
    renderSemua();

    $("#data-dialog").close();
    event.target.reset();
});

// EDIT DATA
function editLahan(id) {
    bukaForm(
        "lahan",
        lahan.find(item => item.id === id)
    );
}

function editTanaman(id) {
    bukaForm(
        "tanaman",
        tanaman.find(item => item.id === id)
    );
}

// HAPUS DATA
function hapusLahan(id) {

    if (!confirm(
        "Yakin ingin menghapus lahan ini? Data tanaman terkait juga akan terhapus."
    )) return;

    lahan = lahan.filter(item => item.id !== id);

    tanaman = tanaman.filter(
        item => item.lahanId !== id
    );

    simpanData();
    renderSemua();
}

function hapusTanaman(id) {

    if (!confirm(
        "Yakin ingin menghapus data tanaman ini?"
    )) return;

    tanaman = tanaman.filter(
        item => item.id !== id
    );

    simpanData();
    renderSemua();
}

// TANGGAL HARI INI
$("#today").textContent =
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// JALANKAN APLIKASI
renderSemua();
