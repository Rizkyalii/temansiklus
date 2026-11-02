/**
 * TEMANSIKLUS - VUE 3 APPLICATION
 * Tema: Kuning Hangat / Emas / Amber (Warm Yellow & Sunny Gold Midwifery Theme)
 * Framework: Vue 3 + Tailwind CSS
 */

const { createApp } = Vue;

createApp({
  data() {
    // 14 days ago as default initial period date
    const initialHpht = this.formatDateIso(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
    const todayIso = this.formatDateIso(new Date());

    return {
      // Mobile Nav Drawer
      mobileMenuOpen: false,

      // Buku Tamu Identitas Pengunjung (Tracking Pengunjung untuk Pemilik Website)
      visitor: {
        nama: '',
        usia: '15',
        sekolah: '',
        kota: '',
        wa: '',
        waktu: ''
      },
      isVisitorIdentified: false,
      showVisitorModal: false,
      visitorSubmitting: false,
      allVisitors: [],
      showAdminVisitorModal: false,
      searchVisitorQuery: '',

      // Feature 1: Edukasi Tabs
      activeTab: 'dismenorea',

      // Feature 2: Kalender & Tracker Menstruasi
      cycleForm: {
        lastPeriodDate: initialHpht,
        periodDuration: 5,
        cycleLength: 28,
      },
      savedCycleData: {
        lastPeriodDate: initialHpht,
        periodDuration: 5,
        cycleLength: 28,
      },
      calCurrentDate: new Date(),
      dailyLogs: {},
      selectedLogDate: todayIso,
      selectedLog: {
        flow: '',
        cramp: '',
        moods: [],
        notes: ''
      },

      // Feature 3: Skrining Triage Kebidanan
      triage: {
        cycle: '',
        duration: '',
        pads: '',
        pain: '',
        redFlags: ''
      },
      triageResult: null,

      // Feature 4: Kuis Interaktif Kebidanan & Google Form
      quizQuestions: [
        {
          q: "1. Berapa rentang panjang siklus menstruasi yang dianggap normal menurut standar medis kebidanan?",
          opts: [
            "10 - 15 hari",
            "21 - 35 hari",
            "40 - 60 hari",
            "Harus tepat 30 hari setiap bulan"
          ],
          correct: 1,
          exp: "Siklus menstruasi normal fisiologis berkisar antara 21 hingga 35 hari, dihitung dari hari pertama haid bulan ini sampai hari pertama haid berikutnya."
        },
        {
          q: "2. Mengapa saat buang air atau mandi, arah membersihkan organ kewanitaan harus dari DEPAN ke BELAKANG?",
          opts: [
            "Agar busa sabun tidak masuk ke mata",
            "Mencegah perpindahan bakteri usus (E. coli) dari anus ke vagina dan saluran kemih",
            "Supaya darah haid lebih cepat berhenti keluar",
            "Agar aroma organ kewanitaan tetap wangi"
          ],
          correct: 1,
          exp: "Arah cebok dari depan ke belakang mencegah bakteri usus (seperti E. coli) masuk ke liang vagina atau uretra, sehingga mencegah Infeksi Saluran Kemih (ISK) dan keputihan abnormal."
        },
        {
          q: "3. Menurut program Kemenkes RI, minuman apa yang TIDAK BOLEH dikonsumsi bersamaan saat minum Tablet Tambah Darah (TTD)?",
          opts: [
            "Air putih hangat",
            "Jus jeruk kaya vitamin C",
            "Teh, kopi, atau susu",
            "Air kelapa murni"
          ],
          correct: 2,
          exp: "Teh dan kopi mengandung senyawa tanin, sedangkan susu kaya akan kalsium, yang keduanya dapat mengikat zat besi sehingga menghambat penyerapan TTD di saluran pencernaan."
        },
        {
          q: "4. Langkah non-farmakologi (tanpa obat) pertama yang sangat dianjurkan untuk meredakan nyeri kram menstruasi (dismenorea) adalah...",
          opts: [
            "Minum air es yang banyak",
            "Kompres hangat di perut bagian bawah dan latihan pernapasan relaksasi",
            "Melompat-lompat tinggi di tempat",
            "Tidur tengkurap sambil menahan napas"
          ],
          correct: 1,
          exp: "Kompres hangat melancarkan aliran sirkulasi darah dan merelaksasi kontraksi otot polos dinding rahim (miometrium), meredakan kram yang dipicu pelepasan prostaglandin."
        },
        {
          q: "5. Manakah kondisi di bawah ini yang merupakan 'Tanda Bahaya' menstruasi dan wajib segera dikonsultasikan ke bidan atau dokter?",
          opts: [
            "Muncul sedikit jerawat di dahi menjelang haid",
            "Perdarahan sangat deras hingga harus mengganti pembalut penuh setiap 1 jam selama beberapa jam berturut-turut",
            "Merasa sedikit lebih sensitif atau sedih 2 hari sebelum haid",
            "Lama menstruasi berlangsung selama 5 hari"
          ],
          correct: 1,
          exp: "Pembalut yang penuh dan tembus setiap 1 jam menandakan menorrhagia (perdarahan haid berlebih) yang berisiko menyebabkan syok hipovolemik dan anemia akut. Kondisi ini harus segera dievaluasi tenaga medis."
        }
      ],
      quizIndex: 0,
      quizScore: 0,
      quizSelectedOption: null,
      quizAnswerSubmitted: false,
      quizFinished: false,

      // Google Form Integration
      gformUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeU6iQcKqO8q2L34lXb_8qA-default/viewform?embedded=true",
      customGformInput: "",
      showGformModal: false,

      // Toast Notification
      toast: {
        show: false,
        message: ''
      }
    };
  },

  computed: {
    // Prediction Calculations
    nextPeriodDate() {
      const hpht = this.parseDate(this.savedCycleData.lastPeriodDate);
      const nextDate = new Date(hpht);
      nextDate.setDate(nextDate.getDate() + parseInt(this.savedCycleData.cycleLength, 10));
      return nextDate;
    },

    nextPeriodFormatted() {
      return this.formatDateIndonesian(this.nextPeriodDate);
    },

    countdownDays() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = this.nextPeriodDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) return `${diffDays} Hari Lagi`;
      if (diffDays === 0) return `Hari Ini!`;
      return `Terlambat ${Math.abs(diffDays)} Hari`;
    },

    fertileWindowText() {
      const ovulationDate = new Date(this.nextPeriodDate);
      ovulationDate.setDate(ovulationDate.getDate() - 14);

      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 4);
      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      return `${this.formatDateShort(fertileStart)} - ${this.formatDateShort(fertileEnd)}`;
    },

    currentPhaseText() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const hpht = this.parseDate(this.savedCycleData.lastPeriodDate);
      const diffDays = Math.floor((today - hpht) / (1000 * 60 * 60 * 24));
      const cycleLength = parseInt(this.savedCycleData.cycleLength, 10);
      const periodDuration = parseInt(this.savedCycleData.periodDuration, 10);

      const cycleDay = (diffDays % cycleLength) + 1;
      let phase = 'Fase Folikuler (Persiapan)';

      if (cycleDay >= 1 && cycleDay <= periodDuration) {
        phase = 'Fase Menstruasi (Pendarahan)';
      } else if (cycleDay >= (cycleLength - 18) && cycleDay <= (cycleLength - 12)) {
        phase = 'Fase Ovulasi (Masa Subur)';
      } else if (cycleDay > (cycleLength - 12)) {
        phase = 'Fase Luteal (Menjelang Haid)';
      }

      return `Hari ke-${cycleDay > 0 ? cycleDay : 1} (${phase})`;
    },

    calMonthYearTitle() {
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${monthNames[this.calCurrentDate.getMonth()]} ${this.calCurrentDate.getFullYear()}`;
    },

    calendarGrid() {
      const year = this.calCurrentDate.getFullYear();
      const month = this.calCurrentDate.getMonth();
      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      const todayStr = this.formatDateIso(new Date());
      const hpht = this.parseDate(this.savedCycleData.lastPeriodDate);
      const cycleLength = parseInt(this.savedCycleData.cycleLength, 10);
      const periodDuration = parseInt(this.savedCycleData.periodDuration, 10);

      const cells = [];

      // Empty days before 1st of month
      for (let i = 0; i < firstDayIndex; i++) {
        cells.push({ isEmpty: true, id: `empty-${i}` });
      }

      // Actual days
      for (let day = 1; day <= totalDays; day++) {
        const cellDate = new Date(year, month, day);
        const dateStr = this.formatDateIso(cellDate);
        const isToday = (dateStr === todayStr);

        const status = this.getCycleDayStatus(cellDate, hpht, cycleLength, periodDuration);
        const hasLog = Boolean(this.dailyLogs[dateStr]);

        cells.push({
          isEmpty: false,
          day,
          dateStr,
          isToday,
          status,
          hasLog,
          id: `day-${dateStr}`
        });
      }

      return cells;
    },

    selectedLogDateFormatted() {
      return this.formatDateIndonesian(this.parseDate(this.selectedLogDate));
    },

    currentQuizQuestion() {
      return this.quizQuestions[this.quizIndex];
    },

    quizProgressBarWidth() {
      return `${((this.quizIndex + 1) / this.quizQuestions.length) * 100}%`;
    },

    quizFeedback() {
      if (this.quizScore >= 80) {
        return {
          title: "Luar Biasa! Pemahaman Sangat Baik",
          desc: "Kamu memiliki pengetahuan kesehatan reproduksi kebidanan yang tinggi untuk merawat diri selama masa menstruasi!",
          colorClass: "text-emerald-700 bg-emerald-50 border-emerald-300"
        };
      } else if (this.quizScore >= 60) {
        return {
          title: "Bagus! Pemahaman Cukup Baik",
          desc: "Pemahamanmu sudah cukup baik, yuk baca kembali materi di tab Edukasi untuk memperdalam pencegahan keluhan kram dan anemia.",
          colorClass: "text-amber-800 bg-amber-50 border-amber-300"
        };
      } else {
        return {
          title: "Perlu Ditingkatkan",
          desc: "Tidak apa-apa, kamu sedang dalam proses belajar! Luangkan waktu sejenak untuk membaca materi edukasi dan mitos vs fakta di atas.",
          colorClass: "text-amber-900 bg-yellow-100 border-yellow-300"
        };
      }
    },

    filteredVisitors() {
      if (!this.searchVisitorQuery || !this.searchVisitorQuery.trim()) {
        return this.allVisitors;
      }
      const q = this.searchVisitorQuery.toLowerCase().trim();
      return this.allVisitors.filter(v => 
        (v.nama && v.nama.toLowerCase().includes(q)) ||
        (v.sekolah && v.sekolah.toLowerCase().includes(q)) ||
        (v.kota && v.kota.toLowerCase().includes(q))
      );
    },

    uniqueSchoolsCount() {
      const schools = new Set(this.allVisitors.map(v => (v.sekolah || '').trim().toLowerCase()).filter(Boolean));
      return schools.size > 0 ? schools.size : 1;
    }
  },

  mounted() {
    this.checkVisitorIdentity();
    this.loadFromStorage();
    this.loadLogForSelectedDate();
  },

  methods: {
    // Buku Tamu Identitas Pengunjung Methods
    checkVisitorIdentity() {
      // 5 Pengunjung Awal Komunitas (Representasi berbagai sekolah & daerah)
      const defaultCommunity = [
        { id: 101, nama: 'Nabila Putri Maharani', usia: 15, sekolah: 'SMPN 1 Padang', kota: 'Padang', wa: '081267891234', waktu: 'Hari ini, 09:15' },
        { id: 102, nama: 'Aisyah Rahmadani', usia: 16, sekolah: 'SMAN 2 Surabaya', kota: 'Surabaya', wa: '081398765432', waktu: 'Hari ini, 11:30' },
        { id: 103, nama: 'Dewi Lestari Safitri', usia: 14, sekolah: 'SMPN 3 Bandung', kota: 'Bandung', wa: '085712345678', waktu: 'Hari ini, 13:45' },
        { id: 104, nama: 'Siti Nurhaliza', usia: 17, sekolah: 'SMKN 1 Jakarta', kota: 'Jakarta', wa: '081987654321', waktu: 'Kemarin, 16:20' },
        { id: 105, nama: 'Zahra Amelia Santoso', usia: 15, sekolah: 'SMAN 1 Yogyakarta', kota: 'Yogyakarta', wa: '082134567890', waktu: 'Kemarin, 19:10' }
      ];

      try {
        const savedVisitor = localStorage.getItem('temansiklus_visitor');
        if (savedVisitor) {
          this.visitor = JSON.parse(savedVisitor);
          this.isVisitorIdentified = true;
          this.showVisitorModal = false;
        } else {
          this.isVisitorIdentified = false;
          this.showVisitorModal = true;
        }

        const savedAll = localStorage.getItem('temansiklus_all_visitors');
        if (savedAll) {
          const parsed = JSON.parse(savedAll);
          this.allVisitors = Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCommunity;
        } else {
          this.allVisitors = defaultCommunity;
          localStorage.setItem('temansiklus_all_visitors', JSON.stringify(defaultCommunity));
        }
      } catch (e) {
        this.allVisitors = defaultCommunity;
        this.showVisitorModal = true;
      }
    },

    submitVisitorIdentity() {
      if (!this.visitor.nama || !this.visitor.nama.trim()) {
        alert('Mohon masukkan nama lengkap Anda.');
        return;
      }
      if (!this.visitor.usia) {
        alert('Mohon pilih usia Anda.');
        return;
      }
      if (!this.visitor.sekolah || !this.visitor.sekolah.trim()) {
        alert('Mohon masukkan asal sekolah atau instansi Anda.');
        return;
      }
      if (!this.visitor.wa || !this.visitor.wa.trim()) {
        alert('Mohon masukkan nomor WhatsApp Anda.');
        return;
      }

      this.visitorSubmitting = true;
      const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
      this.visitor.waktu = nowStr;

      // 1. Simpan identitas pengunjung saat ini di LocalStorage
      localStorage.setItem('temansiklus_visitor', JSON.stringify(this.visitor));
      this.isVisitorIdentified = true;

      // 2. Tambahkan ke Rekap Daftar Pengunjung di browser
      const record = { ...this.visitor, id: Date.now() };
      this.allVisitors.unshift(record);
      localStorage.setItem('temansiklus_all_visitors', JSON.stringify(this.allVisitors));

      // 3. Kirim ke Netlify Forms secara asinkron (agar pemilik website menerima di dashboard & email)
      const formData = new URLSearchParams();
      formData.append('form-name', 'buku-tamu-pengunjung');
      formData.append('nama', this.visitor.nama);
      formData.append('usia', this.visitor.usia);
      formData.append('sekolah', this.visitor.sekolah);
      formData.append('wa', this.visitor.wa);
      formData.append('kota', this.visitor.kota || '-');
      formData.append('waktu_kunjungan', nowStr);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })
      .then(() => {
        console.log('Data pengunjung berhasil dikirim ke Netlify Forms');
      })
      .catch((err) => {
        console.log('Catatan lokal tersimpan (offline/local mode):', err);
      })
      .finally(() => {
        this.visitorSubmitting = false;
        this.showVisitorModal = false;
        this.showNotification(`Halo ${this.visitor.nama}, selamat datang di Temansiklus! 🌸`);
      });
    },

    openEditVisitorModal() {
      this.showVisitorModal = true;
    },

    openAdminVisitors() {
      const pass = prompt('Masukkan Kode Akses Pemilik Website / Admin (Default: admin):');
      if (pass === 'admin' || pass === 'bidan' || pass === 'temansiklus') {
        this.showAdminVisitorModal = true;
      } else if (pass !== null) {
        alert('Kode akses salah. Gunakan kode: admin');
      }
    },

    closeAdminVisitors() {
      this.showAdminVisitorModal = false;
    },

    formatWaChatUrl(phone) {
      if (!phone) return '#';
      let clean = phone.replace(/[^0-9]/g, '');
      if (clean.startsWith('0')) {
        clean = '62' + clean.slice(1);
      } else if (clean.startsWith('8')) {
        clean = '62' + clean;
      }
      const nama = this.visitor.nama ? encodeURIComponent(this.visitor.nama) : 'Siswi';
      return `https://wa.me/${clean}?text=${encodeURIComponent('Halo ' + nama + ', saya bidan/pengelola Temansiklus. Terima kasih telah mengunjungi website edukasi kesehatan menstruasi kami!')}`;
    },

    exportVisitorsCSV() {
      if (!this.allVisitors || this.allVisitors.length === 0) {
        alert('Belum ada data pengunjung yang tercatat.');
        return;
      }
      let csv = 'Nama Lengkap,Usia,Asal Sekolah / Instansi,Nomor WhatsApp,Kota / Kabupaten,Waktu Kunjungan\n';
      this.allVisitors.forEach(v => {
        const cleanName = (v.nama || '').replace(/"/g, '""');
        const cleanSchool = (v.sekolah || '').replace(/"/g, '""');
        const cleanWa = (v.wa || '-').replace(/"/g, '""');
        const cleanCity = (v.kota || '-').replace(/"/g, '""');
        csv += `"${cleanName}","${v.usia}","${cleanSchool}","'${cleanWa}","${cleanCity}","${v.waktu}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rekap_pengunjung_temansiklus_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },

    maskWa(phone) {
      if (!phone) return '-';
      const clean = phone.replace(/[^0-9]/g, '');
      if (clean.length < 8) return phone;
      const front = clean.slice(0, 4);
      const back = clean.slice(-3);
      return `${front}-****-${back}`;
    },

    getAvatarColor(name) {
      const colors = [
        'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950',
        'bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950',
        'bg-gradient-to-tr from-amber-500 to-amber-600 text-white',
        'bg-gradient-to-tr from-emerald-400 to-teal-500 text-white',
        'bg-gradient-to-tr from-teal-500 to-emerald-600 text-white',
        'bg-gradient-to-tr from-amber-600 to-yellow-600 text-white'
      ];
      let hash = 0;
      for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },

    getInitials(name) {
      if (!name) return 'ST';
      const parts = name.trim().split(' ').filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    },

    // Storage Handlers
    loadFromStorage() {
      try {
        const savedCycle = localStorage.getItem('siklus_sehat_cycle_yellow');
        if (savedCycle) {
          const parsed = JSON.parse(savedCycle);
          this.cycleForm = { ...parsed };
          this.savedCycleData = { ...parsed };
        }
        const savedLogs = localStorage.getItem('siklus_sehat_logs_yellow');
        if (savedLogs) {
          this.dailyLogs = JSON.parse(savedLogs);
        }
        const savedGform = localStorage.getItem('siklus_sehat_gform_yellow');
        if (savedGform) {
          this.gformUrl = savedGform;
        }
      } catch (e) {
        console.error('Storage error:', e);
      }
    },

    saveCycleToStorage() {
      try {
        localStorage.setItem('siklus_sehat_cycle_yellow', JSON.stringify(this.savedCycleData));
      } catch (e) {
        console.error(e);
      }
    },

    saveLogsToStorage() {
      try {
        localStorage.setItem('siklus_sehat_logs_yellow', JSON.stringify(this.dailyLogs));
      } catch (e) {
        console.error(e);
      }
    },

    // Cycle Form Actions
    handleCycleSubmit() {
      this.savedCycleData = {
        lastPeriodDate: this.cycleForm.lastPeriodDate,
        periodDuration: parseInt(this.cycleForm.periodDuration, 10),
        cycleLength: parseInt(this.cycleForm.cycleLength, 10),
      };
      this.saveCycleToStorage();
      this.showNotification('Data siklus tersimpan & kalender kuning diperbarui!');
    },

    resetCycleSettings() {
      if (confirm('Kembalikan pengaturan siklus ke setelan standar?')) {
        const defaultHpht = this.formatDateIso(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
        this.cycleForm = {
          lastPeriodDate: defaultHpht,
          periodDuration: 5,
          cycleLength: 28,
        };
        this.savedCycleData = { ...this.cycleForm };
        this.saveCycleToStorage();
        this.showNotification('Pengaturan siklus telah dikembalikan ke awal.');
      }
    },

    // Calendar Navigation
    prevMonth() {
      const d = new Date(this.calCurrentDate);
      d.setMonth(d.getMonth() - 1);
      this.calCurrentDate = d;
    },

    nextMonth() {
      const d = new Date(this.calCurrentDate);
      d.setMonth(d.getMonth() + 1);
      this.calCurrentDate = d;
    },

    getCycleDayStatus(targetDate, hpht, cycleLength, periodDuration) {
      targetDate.setHours(0, 0, 0, 0);
      const hphtCopy = new Date(hpht);
      hphtCopy.setHours(0, 0, 0, 0);

      const diffTime = targetDate - hphtCopy;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return null;

      const cycleIndex = Math.floor(diffDays / cycleLength);
      const dayInCycle = (diffDays % cycleLength) + 1;

      if (dayInCycle >= 1 && dayInCycle <= periodDuration) {
        return cycleIndex === 0 ? 'cal-day-period' : 'cal-day-predicted';
      }

      const ovulationDay = cycleLength - 14;
      if (dayInCycle === ovulationDay) {
        return 'cal-day-ovulation';
      }

      if (dayInCycle >= (ovulationDay - 4) && dayInCycle <= (ovulationDay + 1)) {
        return 'cal-day-fertile';
      }

      return null;
    },

    // Daily Symptom Logger
    selectCalendarDay(dateStr) {
      this.selectedLogDate = dateStr;
      this.loadLogForSelectedDate();
    },

    loadLogForSelectedDate() {
      const log = this.dailyLogs[this.selectedLogDate];
      if (log) {
        this.selectedLog = {
          flow: log.flow || '',
          cramp: log.cramp || '',
          moods: log.moods ? [...log.moods] : [],
          notes: log.notes || ''
        };
      } else {
        this.selectedLog = {
          flow: '',
          cramp: '',
          moods: [],
          notes: ''
        };
      }
    },

    toggleMood(moodVal) {
      const idx = this.selectedLog.moods.indexOf(moodVal);
      if (idx > -1) {
        this.selectedLog.moods.splice(idx, 1);
      } else {
        this.selectedLog.moods.push(moodVal);
      }
    },

    saveDailyLog() {
      this.dailyLogs[this.selectedLogDate] = {
        flow: this.selectedLog.flow,
        cramp: this.selectedLog.cramp,
        moods: [...this.selectedLog.moods],
        notes: this.selectedLog.notes.trim()
      };
      this.saveLogsToStorage();
      this.showNotification(`Catatan ${this.selectedLogDateFormatted} berhasil disimpan!`);
    },

    deleteDailyLog() {
      if (this.dailyLogs[this.selectedLogDate]) {
        delete this.dailyLogs[this.selectedLogDate];
        this.saveLogsToStorage();
        this.loadLogForSelectedDate();
        this.showNotification('Catatan harian untuk tanggal ini dihapus.');
      }
    },

    // Triage / Screening
    handleTriageSubmit() {
      const { cycle, duration, pads, pain, redFlags } = this.triage;

      if (!cycle || !duration || !pads || !pain || !redFlags) {
        alert('Mohon jawab seluruh 5 pertanyaan skrining.');
        return;
      }

      if (pain === 'severe' || pads === 'very_heavy' || redFlags === 'yes' || cycle === 'amenorrhea') {
        this.triageResult = {
          status: 'danger',
          badge: '🔴 Kategori Merah: Perlu Konsultasi ke Bidan atau Dokter Sp.OG',
          bgClass: 'bg-red-50 border-red-300 text-red-950',
          titleColor: 'text-red-700',
          message: 'Berdasarkan gejala yang kamu laporkan, terdapat indikasi keluhan menstruasi yang melampaui batas fisiologis umum (misal nyeri kram hebat yang melumpuhkan aktivitas, perdarahan sangat banyak, gumpalan besar, atau tidak haid >3 bulan). Kondisi ini butuh evaluasi medis langsung.',
          checklist: [
            'Jadwalkan kunjungan ke Bidan Praktik Mandiri, Puskesmas, atau Dokter Obgyn terdekat.',
            'Gunakan tombol Cetak Laporan di kalender website ini sebagai catatan riwayat.',
            'Jangan mengonsumsi obat keras anti-nyeri tanpa resep dan pantauan tenaga kesehatan.',
            'Bila mengalami pusing berputar hebat, lemas lunglai, atau pingsan, segera minta bantuan keluarga ke faskes/UGD.'
          ]
        };
      } else if (cycle === 'irregular' || duration === 'long' || duration === 'short' || pain === 'moderate') {
        this.triageResult = {
          status: 'warning',
          badge: '🟡 Kategori Kuning: Perlu Observasi & Modifikasi Gaya Hidup',
          bgClass: 'bg-amber-50 border-amber-300 text-amber-950',
          titleColor: 'text-amber-800',
          message: 'Siklusmu menunjukkan sedikit variasi dari standar rata-rata. Pada remaja putri (terutama 1-3 tahun awal setelah menarche), poros hormon HPO belum matang sepenuhnya sehingga variasi ini sangat sering terjadi secara wajar. Kamu disarankan memantau 2-3 siklus ke depan.',
          checklist: [
            'Terapkan kompres hangat di perut bagian bawah saat kram terasa mengganggu.',
            'Rutin minum 1 Tablet Tambah Darah (TTD) seminggu sekali bersama air putih/jus jeruk.',
            'Catat tanggal mulai dan berakhirnya haid secara teliti di kalender Temansiklus.',
            'Bila ketidakteraturan berlanjut lebih dari 3 siklus berturut-turut, konsultasikan ke bidan.'
          ]
        };
      } else {
        this.triageResult = {
          status: 'normal',
          badge: '🟢 Kategori Hijau: Siklus Menstruasi Normal & Fisiologis',
          bgClass: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          titleColor: 'text-emerald-700',
          message: 'Selamat! Pola siklus menstruasimu berada dalam rentang kesehatan reproduksi yang ideal menurut standar kebidanan (jarak 21-35 hari, durasi 3-8 hari, dan keluhan dalam batas wajar).',
          checklist: [
            'Pertahankan kebersihan organ kewanitaan (cebok dari depan ke belakang).',
            'Ganti pembalut secara teratur setiap 3 - 4 jam sekali.',
            'Konsumsi makanan bergizi kaya zat besi (bayam, telur, daging) & cukupi cairan tubuh.',
            'Tetap rajin mencatat tanggal haid di Temansiklus.'
          ]
        };
      }
    },

    // Quiz Actions
    selectQuizOption(optIdx) {
      if (this.quizAnswerSubmitted) return;
      this.quizSelectedOption = optIdx;
      this.quizAnswerSubmitted = true;

      if (optIdx === this.currentQuizQuestion.correct) {
        this.quizScore += 20;
      }
    },

    nextQuizQuestion() {
      if (this.quizIndex + 1 < this.quizQuestions.length) {
        this.quizIndex++;
        this.quizSelectedOption = null;
        this.quizAnswerSubmitted = false;
      } else {
        this.quizFinished = true;
      }
    },

    restartQuiz() {
      this.quizIndex = 0;
      this.quizScore = 0;
      this.quizSelectedOption = null;
      this.quizAnswerSubmitted = false;
      this.quizFinished = false;
    },

    // Google Form Modal
    openGformModal() {
      this.customGformInput = this.gformUrl;
      this.showGformModal = true;
    },

    closeGformModal() {
      this.showGformModal = false;
    },

    saveCustomGformUrl() {
      const url = this.customGformInput.trim();
      if (!url || !url.startsWith('http')) {
        alert('Mohon masukkan URL Google Form yang valid (dimulai dengan https://)');
        return;
      }
      let embedUrl = url;
      if (!embedUrl.includes('embedded=true')) {
        embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'embedded=true';
      }
      this.gformUrl = embedUrl;
      localStorage.setItem('siklus_sehat_gform_yellow', this.gformUrl);
      this.showGformModal = false;
      this.showNotification('Tautan Google Form kustom berhasil diterapkan!');
    },

    // Print & Utilities
    printReport() {
      window.print();
    },

    showNotification(msg) {
      this.toast.message = msg;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 3200);
    },

    formatDateIso(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    parseDate(dateStr) {
      const parts = dateStr.split('-');
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    },

    formatDateIndonesian(date) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },

    formatDateShort(date) {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      return `${date.getDate()} ${months[date.getMonth()]}`;
    }
  }
}).mount('#app');
