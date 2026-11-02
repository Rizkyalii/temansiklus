/**
 * SIKLUSSEHAT REMAJA - MAIN APPLICATION SCRIPT
 * Berbasis Ilmu Kebidanan & Kesehatan Reproduksi Remaja Putri
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State & Storage Keys
  const STORAGE_KEY_CYCLE = 'siklus_sehat_cycle_data';
  const STORAGE_KEY_LOGS = 'siklus_sehat_daily_logs';
  const STORAGE_KEY_GFORM = 'siklus_sehat_gform_url';

  // Default initial configuration
  const defaultState = {
    lastPeriodDate: getFormattedDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)), // 14 days ago by default
    periodDuration: 5,
    cycleLength: 28,
  };

  let cycleState = loadSavedCycle() || defaultState;
  let dailyLogs = loadSavedLogs() || {};
  let currentCalDate = new Date(); // Viewing month in calendar
  let selectedLogDate = getFormattedDate(new Date());

  // Default Google Form URL (Placeholder with pre-filled instructions)
  const DEFAULT_GFORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeU6iQcKqO8q2L34lXb_8qA-default/viewform?embedded=true";
  let activeGFormUrl = localStorage.getItem(STORAGE_KEY_GFORM) || DEFAULT_GFORM_URL;

  // Initialize UI Components
  initNavigation();
  initEduTabs();
  initTrackerForm();
  initCalendar();
  initDailyLogUI();
  initTriageScreening();
  initBuiltinQuiz();
  initGFormIntegration();
  initSmoothScroll();

  /* ==========================================================================
     NAVIGATION & MOBILE MENU
     ========================================================================== */
  function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-open');
      });

      // Close menu when clicking outside or on a link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('mobile-open');
        });
      });
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /* ==========================================================================
     FEATURE 1: EDUKASI TABS
     ========================================================================== */
  function initEduTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.edu-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const activeContent = document.getElementById(`tab-${targetTab}`);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     FEATURE 2: KALENDER MENSTRUASI & TRACKER
     ========================================================================== */
  function initTrackerForm() {
    const hphtInput = document.getElementById('hphtDate');
    const durationInput = document.getElementById('periodDuration');
    const durationVal = document.getElementById('periodDurationVal');
    const cycleInput = document.getElementById('cycleLength');
    const cycleVal = document.getElementById('cycleLengthVal');
    const form = document.getElementById('cycleTrackerForm');
    const resetBtn = document.getElementById('resetCycleBtn');
    const printBtn = document.getElementById('printReportBtn');

    // Populate existing values
    if (hphtInput) hphtInput.value = cycleState.lastPeriodDate;
    if (durationInput) {
      durationInput.value = cycleState.periodDuration;
      if (durationVal) durationVal.textContent = `${cycleState.periodDuration} Hari`;
      durationInput.addEventListener('input', (e) => {
        if (durationVal) durationVal.textContent = `${e.target.value} Hari`;
      });
    }
    if (cycleInput) {
      cycleInput.value = cycleState.cycleLength;
      if (cycleVal) cycleVal.textContent = `${cycleState.cycleLength} Hari`;
      cycleInput.addEventListener('input', (e) => {
        if (cycleVal) cycleVal.textContent = `${e.target.value} Hari`;
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        cycleState = {
          lastPeriodDate: hphtInput.value,
          periodDuration: parseInt(durationInput.value, 10),
          cycleLength: parseInt(cycleInput.value, 10),
        };
        saveCycleData(cycleState);
        updatePredictionSummary();
        renderCalendar(currentCalDate);
        showToast('Data siklus berhasil disimpan & kalender diperbarui!');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Apakah kamu yakin ingin mereset pengaturan siklus menstruasi?')) {
          cycleState = { ...defaultState };
          saveCycleData(cycleState);
          hphtInput.value = cycleState.lastPeriodDate;
          durationInput.value = cycleState.periodDuration;
          if (durationVal) durationVal.textContent = `${cycleState.periodDuration} Hari`;
          cycleInput.value = cycleState.cycleLength;
          if (cycleVal) cycleVal.textContent = `${cycleState.cycleLength} Hari`;
          updatePredictionSummary();
          renderCalendar(currentCalDate);
          showToast('Pengaturan siklus telah dikembalikan ke awal.');
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    updatePredictionSummary();
  }

  function updatePredictionSummary() {
    const hpht = parseDate(cycleState.lastPeriodDate);
    const cycleLength = cycleState.cycleLength;
    const periodDuration = cycleState.periodDuration;

    // Next period prediction
    const nextPeriodDate = new Date(hpht);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

    // Ovulation & fertile window (approx. 14 days before next period)
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 4);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Days countdown
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = nextPeriodDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Update DOM
    const nextPeriodEl = document.getElementById('nextPeriodDateDisplay');
    const fertileWindowEl = document.getElementById('fertileWindowDisplay');
    const countdownEl = document.getElementById('periodCountdownDisplay');
    const currentPhaseEl = document.getElementById('currentPhaseDisplay');

    if (nextPeriodEl) {
      nextPeriodEl.textContent = formatDateIndonesian(nextPeriodDate);
    }
    if (fertileWindowEl) {
      fertileWindowEl.textContent = `${formatDateShort(fertileStart)} - ${formatDateShort(fertileEnd)}`;
    }
    if (countdownEl) {
      if (diffDays > 0) {
        countdownEl.textContent = `${diffDays} Hari Lagi`;
      } else if (diffDays === 0) {
        countdownEl.textContent = `Hari Ini!`;
      } else {
        countdownEl.textContent = `Terlambat ${Math.abs(diffDays)} Hari`;
      }
    }

    // Determine current phase based on cycle day
    if (currentPhaseEl) {
      const daysSinceHpht = Math.floor((today - hpht) / (1000 * 60 * 60 * 24));
      const cycleDay = (daysSinceHpht % cycleLength) + 1;
      let phaseName = 'Fase Folikuler (Persiapan)';

      if (cycleDay >= 1 && cycleDay <= periodDuration) {
        phaseName = 'Fase Menstruasi (Pendarahan)';
      } else if (cycleDay >= (cycleLength - 18) && cycleDay <= (cycleLength - 12)) {
        phaseName = 'Fase Ovulasi (Masa Subur)';
      } else if (cycleDay > (cycleLength - 12)) {
        phaseName = 'Fase Luteal (Menjelang Haid)';
      }
      currentPhaseEl.textContent = `Hari ke-${cycleDay > 0 ? cycleDay : 1} (${phaseName})`;
    }
  }

  function initCalendar() {
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        renderCalendar(currentCalDate);
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderCalendar(currentCalDate);
      });
    }

    renderCalendar(currentCalDate);
  }

  function renderCalendar(date) {
    const monthTitle = document.getElementById('calMonthTitle');
    const daysGrid = document.getElementById('calDaysGrid');
    if (!monthTitle || !daysGrid) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    monthTitle.textContent = `${monthNames[month]} ${year}`;

    // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    daysGrid.innerHTML = '';

    // Empty cells before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day empty';
      daysGrid.appendChild(emptyCell);
    }

    const todayStr = getFormattedDate(new Date());

    // Calculate period, predicted, ovulation dates
    const hpht = parseDate(cycleState.lastPeriodDate);
    const cycleLength = cycleState.cycleLength;
    const periodDuration = cycleState.periodDuration;

    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(year, month, day);
      const dateStr = getFormattedDate(cellDate);
      const dayCell = document.createElement('div');
      dayCell.className = 'cal-day';
      dayCell.textContent = day;
      dayCell.setAttribute('data-date', dateStr);

      if (dateStr === todayStr) {
        dayCell.classList.add('today');
      }

      // Check classification
      const dayStatus = getCycleDayStatus(cellDate, hpht, cycleLength, periodDuration);
      if (dayStatus) {
        dayCell.classList.add(dayStatus);
      }

      // Check if user has daily symptom log
      if (dailyLogs[dateStr]) {
        dayCell.classList.add('has-log');
      }

      // Interaction: click to log symptom
      dayCell.addEventListener('click', () => {
        selectDateForLog(dateStr);
      });

      daysGrid.appendChild(dayCell);
    }
  }

  function getCycleDayStatus(targetDate, hpht, cycleLength, periodDuration) {
    targetDate.setHours(0, 0, 0, 0);
    const hphtCopy = new Date(hpht);
    hphtCopy.setHours(0, 0, 0, 0);

    // Difference in days from initial HPHT
    const diffTime = targetDate - hphtCopy;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    const cycleIndex = Math.floor(diffDays / cycleLength);
    const dayInCycle = (diffDays % cycleLength) + 1;

    // Period days in current/future cycles
    if (dayInCycle >= 1 && dayInCycle <= periodDuration) {
      return cycleIndex === 0 ? 'period' : 'period-predicted';
    }

    // Ovulation is roughly 14 days before next period
    const ovulationDay = cycleLength - 14;
    if (dayInCycle === ovulationDay) {
      return 'ovulation';
    }

    // Fertile window: ovulation - 4 days to ovulation + 1 day
    if (dayInCycle >= (ovulationDay - 4) && dayInCycle <= (ovulationDay + 1)) {
      return 'fertile';
    }

    return null;
  }

  /* Daily Log UI */
  function initDailyLogUI() {
    const selectedDateTitle = document.getElementById('logDateDisplay');
    const flowPills = document.querySelectorAll('#flowPills .pill-option');
    const crampPills = document.querySelectorAll('#crampPills .pill-option');
    const moodPills = document.querySelectorAll('#moodPills .pill-option');
    const notesInput = document.getElementById('dailyNotesInput');
    const saveBtn = document.getElementById('saveLogBtn');
    const deleteBtn = document.getElementById('deleteLogBtn');

    // Pill click handlers
    function setupPillGroup(pills, multi = false) {
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          if (!multi) {
            pills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
          } else {
            pill.classList.toggle('selected');
          }
        });
      });
    }

    setupPillGroup(flowPills, false);
    setupPillGroup(crampPills, false);
    setupPillGroup(moodPills, true);

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const selectedFlow = document.querySelector('#flowPills .pill-option.selected')?.dataset.val || '';
        const selectedCramp = document.querySelector('#crampPills .pill-option.selected')?.dataset.val || '';
        const selectedMoods = Array.from(document.querySelectorAll('#moodPills .pill-option.selected')).map(p => p.dataset.val);
        const notes = notesInput ? notesInput.value.trim() : '';

        dailyLogs[selectedLogDate] = {
          flow: selectedFlow,
          cramp: selectedCramp,
          moods: selectedMoods,
          notes: notes
        };

        saveDailyLogs(dailyLogs);
        renderCalendar(currentCalDate);
        showToast(`Catatan harian untuk tanggal ${formatDateIndonesian(parseDate(selectedLogDate))} tersimpan!`);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (dailyLogs[selectedLogDate]) {
          delete dailyLogs[selectedLogDate];
          saveDailyLogs(dailyLogs);
          loadLogIntoUI(selectedLogDate);
          renderCalendar(currentCalDate);
          showToast('Catatan harian untuk tanggal ini dihapus.');
        }
      });
    }

    selectDateForLog(selectedLogDate);
  }

  function selectDateForLog(dateStr) {
    selectedLogDate = dateStr;
    const titleEl = document.getElementById('logDateDisplay');
    if (titleEl) {
      titleEl.textContent = formatDateIndonesian(parseDate(dateStr));
    }
    loadLogIntoUI(dateStr);
  }

  function loadLogIntoUI(dateStr) {
    const log = dailyLogs[dateStr] || {};
    const flowPills = document.querySelectorAll('#flowPills .pill-option');
    const crampPills = document.querySelectorAll('#crampPills .pill-option');
    const moodPills = document.querySelectorAll('#moodPills .pill-option');
    const notesInput = document.getElementById('dailyNotesInput');

    flowPills.forEach(p => p.classList.toggle('selected', p.dataset.val === log.flow));
    crampPills.forEach(p => p.classList.toggle('selected', p.dataset.val === log.cramp));
    moodPills.forEach(p => p.classList.toggle('selected', log.moods && log.moods.includes(p.dataset.val)));
    if (notesInput) notesInput.value = log.notes || '';
  }

  /* ==========================================================================
     FEATURE 3: PANDUAN & SKRINING TRIAGE KEBIDANAN
     ========================================================================== */
  function initTriageScreening() {
    const form = document.getElementById('triageScreeningForm');
    const resultBox = document.getElementById('triageResultBox');

    if (!form || !resultBox) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const cycleLengthVal = form.querySelector('input[name="triageCycle"]:checked')?.value;
      const periodDurationVal = form.querySelector('input[name="triageDuration"]:checked')?.value;
      const padCountVal = form.querySelector('input[name="triagePads"]:checked')?.value;
      const painVal = form.querySelector('input[name="triagePain"]:checked')?.value;
      const redFlagsVal = form.querySelector('input[name="triageRedFlags"]:checked')?.value;

      if (!cycleLengthVal || !periodDurationVal || !padCountVal || !painVal || !redFlagsVal) {
        alert('Mohon jawab semua pertanyaan skrining untuk mendapatkan analisis kebidanan yang akurat.');
        return;
      }

      // Midwifery Triage Algorithm:
      // Red Flags: Severe pain disabling, extreme bleeding, cycle > 35 days repeatedly or < 21 days + clots
      let status = 'normal'; // 'normal', 'warning', 'danger'
      let title = '';
      let message = '';
      let checklist = [];

      if (painVal === 'severe' || padCountVal === 'very_heavy' || redFlagsVal === 'yes' || cycleLengthVal === 'amenorrhea') {
        status = 'danger';
        title = 'Kategori Merah: Perlu Konsultasi ke Bidan atau Dokter Sp.OG';
        message = 'Berdasarkan gejala yang kamu laporkan, terdapat indikasi keluhan menstruasi yang melampaui batas fisiologis umum (misalnya nyeri hebat yang melumpuhkan aktivitas, perdarahan sangat banyak, atau gumpalan besar). Jangan cemas, kondisi ini umum terjadi namun butuh evaluasi medis langsung.';
        checklist = [
          'Jadwalkan kunjungan ke Bidan Praktik Mandiri, Puskesmas, atau Poli Kebidanan terdekat.',
          'Bawa catatan kalender menstruasi dari website ini (gunakan tombol Cetak Laporan).',
          'Jangan menahan nyeri berlebih atau mengonsumsi sembarang obat keras tanpa anjuran bidan/dokter.',
          'Bila mengalami pusing berputar hebat, lemas lunglai, atau pingsan, segera minta bantuan keluarga ke UGD.'
        ];
      } else if (cycleLengthVal === 'irregular' || periodDurationVal === 'long' || periodDurationVal === 'short' || painVal === 'moderate') {
        status = 'warning';
        title = 'Kategori Kuning: Perlu Observasi & Modifikasi Gaya Hidup';
        message = 'Siklusmu menunjukkan sedikit variasi dari standar rata-rata. Pada remaja putri (terutama 1-3 tahun awal setelah menarche), poros hormon HPO belum matang sepenuhnya sehingga variasi ini sangat sering terjadi. Kamu perlu memantau siklusmu dalam 2-3 bulan ke depan.';
        checklist = [
          'Lakukan terapi kompres hangat pada perut bawah saat kram terasa mengganggu.',
          'Rutin minum 1 Tablet Tambah Darah (TTD) seminggu sekali bersama air putih/jus jeruk.',
          'Catat tanggal mulai dan berakhirnya haid secara teliti di kalender SiklusSehat.',
          'Bila ketidakteraturan berlanjut lebih dari 3 siklus berturut-turut, konsultasikan ke bidan.'
        ];
      } else {
        status = 'normal';
        title = 'Kategori Hijau: Siklus Menstruasi Normal & Fisiologis';
        message = 'Selamat! Pola siklus menstruasimu berada dalam rentang kesehatan reproduksi yang ideal menurut standar kebidanan (jarak 21-35 hari, durasi 3-8 hari, dan keluhan nyeri dalam batas wajar).';
        checklist = [
          'Pertahankan kebersihan organ kewanitaan (cebok dari depan ke belakang).',
          'Ganti pembalut secara teratur setiap 3 - 4 jam sekali.',
          'Konsumsi makanan bergizi kaya zat besi (bayam, telur, daging) & cukupi cairan tubuh.',
          'Tetap rajin mencatat tanggal haid di SiklusSehat Remaja.'
        ];
      }

      // Render Result
      resultBox.className = `triage-result ${status}`;
      resultBox.innerHTML = `
        <div class="triage-result-header">
          <span style="font-size: 1.5rem;">${status === 'normal' ? '🟢' : status === 'warning' ? '🟡' : '🔴'}</span>
          <h4>${title}</h4>
        </div>
        <p>${message}</p>
        <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem; color: inherit;">Rekomendasi Langkah Bidan:</div>
        <ul class="triage-checklist">
          ${checklist.map(item => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> ${item}</li>`).join('')}
        </ul>
      `;
      resultBox.style.display = 'block';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ==========================================================================
     FEATURE 4: BUILT-IN INTERACTIVE QUIZ & GOOGLE FORM
     ========================================================================== */
  const quizQuestions = [
    {
      q: "1. Berapa rentang panjang siklus menstruasi yang dianggap normal menurut standar medis kebidanan?",
      opts: [
        "10 - 15 hari",
        "21 - 35 hari",
        "40 - 60 hari",
        "Harus tepat 30 hari setiap bulan"
      ],
      correct: 1,
      exp: "Siklus menstruasi normal fisiologis wanita berkisar antara 21 hingga 35 hari, dihitung dari hari pertama haid sampai hari pertama haid berikutnya."
    },
    {
      q: "2. Mengapa saat buang air atau mandi, arah membersihkan organ kewanitaan harus dari DEPAN ke BELAKANG?",
      opts: [
        "Agar busa sabun tidak masuk ke mata",
        "Mencegah perpindahan bakteri E. coli dari anus ke vagina dan saluran kemih",
        "Supaya darah haid lebih cepat berhenti keluar",
        "Agar aroma organ kewanitaan tetap wangi"
      ],
      correct: 1,
      exp: "Arah cebok dari depan ke belakang mencegah bakteri usus (seperti Escherichia coli) berpindah dari anus ke lubang vagina atau uretra, sehingga terhindar dari Infeksi Saluran Kemih (ISK) dan keputihan patologis."
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
      exp: "Teh dan kopi mengandung tanin, sedangkan susu kaya akan kalsium, yang keduanya dapat mengikat zat besi sehingga menghambat penyerapan TTD di usus. Minumlah TTD dengan air putih atau jus jeruk."
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
      exp: "Kompres hangat melancarkan aliran darah dan merelaksasi kontraksi otot polos dinding rahim (miometrium), meredakan kram yang dipicu pelepasan hormon prostaglandin."
    },
    {
      q: "5. Manakah kondisi di bawah ini yang merupakan 'Tanda Bahaya' menstruasi dan wajib segera diperiksakan ke bidan atau dokter?",
      opts: [
        "Muncul sedikit jerawat di dahi menjelang haid",
        "Perdarahan sangat deras hingga harus mengganti pembalut penuh setiap 1 jam selama beberapa jam berturut-turut",
        "Merasa sedikit lebih sensitif atau sedih 2 hari sebelum haid",
        "Lama menstruasi berlangsung selama 5 hari"
      ],
      correct: 1,
      exp: "Pembalut yang penuh dan tembus setiap 1 jam menandakan menorrhagia (perdarahan haid berlebih) yang berisiko menyebabkan syok hipovolemik dan anemia akut. Kondisi ini harus segera dievaluasi tenaga medis."
    }
  ];

  let currentQuizIndex = 0;
  let quizScore = 0;

  function initBuiltinQuiz() {
    renderQuizQuestion(0);

    const restartBtn = document.getElementById('restartQuizBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        currentQuizIndex = 0;
        quizScore = 0;
        document.getElementById('quizResultView').style.display = 'none';
        document.getElementById('quizQuestionBox').style.display = 'block';
        renderQuizQuestion(0);
      });
    }
  }

  function renderQuizQuestion(index) {
    const questionText = document.getElementById('quizQuestionText');
    const optionsContainer = document.getElementById('quizOptions');
    const progressBar = document.getElementById('quizProgressBar');
    const currentStepText = document.getElementById('quizCurrentStep');
    const expBox = document.getElementById('quizExpBox');

    if (!questionText || !optionsContainer) return;

    if (expBox) {
      expBox.className = 'quiz-explanation';
      expBox.style.display = 'none';
      expBox.innerHTML = '';
    }

    const qData = quizQuestions[index];
    questionText.textContent = qData.q;
    if (currentStepText) currentStepText.textContent = `Pertanyaan ${index + 1} dari ${quizQuestions.length}`;
    if (progressBar) progressBar.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;

    optionsContainer.innerHTML = '';

    qData.opts.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<span>${String.fromCharCode(65 + optIndex)}. ${opt}</span> <span class="opt-icon"></span>`;
      btn.addEventListener('click', () => {
        handleQuizAnswer(index, optIndex, btn);
      });
      optionsContainer.appendChild(btn);
    });
  }

  function handleQuizAnswer(qIndex, selectedOptIndex, clickedBtn) {
    const qData = quizQuestions[qIndex];
    const allButtons = document.querySelectorAll('.quiz-opt-btn');
    const expBox = document.getElementById('quizExpBox');

    allButtons.forEach(b => b.disabled = true);

    const isCorrect = selectedOptIndex === qData.correct;
    if (isCorrect) {
      clickedBtn.classList.add('correct');
      quizScore += 20;
    } else {
      clickedBtn.classList.add('wrong');
      allButtons[qData.correct].classList.add('correct');
    }

    if (expBox) {
      expBox.className = `quiz-explanation show ${isCorrect ? 'correct-exp' : 'wrong-exp'}`;
      expBox.innerHTML = `
        <strong>${isCorrect ? '✅ Jawaban Tepat!' : '❌ Jawaban Kurang Tepat!'}</strong><br>
        ${qData.exp}
        <div style="margin-top: 0.85rem; text-align: right;">
          <button class="btn btn-primary btn-sm" id="nextQuizBtn">
            ${qIndex + 1 < quizQuestions.length ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil Akhir →'}
          </button>
        </div>
      `;
      expBox.style.display = 'block';

      const nextBtn = document.getElementById('nextQuizBtn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (qIndex + 1 < quizQuestions.length) {
            currentQuizIndex++;
            renderQuizQuestion(currentQuizIndex);
          } else {
            showQuizResults();
          }
        });
      }
    }
  }

  function showQuizResults() {
    document.getElementById('quizQuestionBox').style.display = 'none';
    const resultView = document.getElementById('quizResultView');
    const scoreNum = document.getElementById('quizScoreNum');
    const feedbackText = document.getElementById('quizFeedbackText');

    if (!resultView) return;

    if (scoreNum) scoreNum.textContent = quizScore;
    if (feedbackText) {
      if (quizScore >= 80) {
        feedbackText.innerHTML = `<strong>Luar Biasa! Pemahamanmu Sangat Baik (Kategori Tinggi).</strong><br>Kamu memiliki pengetahuan kesehatan reproduksi kebidanan yang kuat untuk merawat diri selama menstruasi!`;
      } else if (quizScore >= 60) {
        feedbackText.innerHTML = `<strong>Bagus! Pemahaman Cukup Baik (Kategori Sedang).</strong><br>Sudah banyak hal yang kamu pahami, namun yuk baca kembali materi di tab Edukasi untuk tips pencegahan keluhan yang lebih lengkap.`;
      } else {
        feedbackText.innerHTML = `<strong>Perlu Ditingkatkan (Kategori Kurang).</strong><br>Tidak apa-apa, kamu sedang dalam proses belajar! Luangkan waktu sejenak untuk membaca materi edukasi dan mitos vs fakta di atas.`;
      }
    }

    resultView.style.display = 'block';
  }

  /* ==========================================================================
     GOOGLE FORM CUSTOMIZER MODAL
     ========================================================================== */
  function initGFormIntegration() {
    const iframe = document.getElementById('gformIframe');
    const openDirectBtn = document.getElementById('openGFormDirectBtn');
    const customizeBtn = document.getElementById('customizeGformBtn');
    const modal = document.getElementById('gformModal');
    const closeModal = document.getElementById('closeModalBtn');
    const saveGformLinkBtn = document.getElementById('saveGformLinkBtn');
    const inputGformLink = document.getElementById('inputGformLink');

    function updateGFormUI() {
      if (iframe) iframe.src = activeGFormUrl;
      if (openDirectBtn) openDirectBtn.href = activeGFormUrl.replace('embedded=true', '');
    }

    updateGFormUI();

    if (customizeBtn && modal) {
      customizeBtn.addEventListener('click', () => {
        if (inputGformLink) inputGformLink.value = activeGFormUrl;
        modal.classList.add('open');
      });
    }

    if (closeModal && modal) {
      closeModal.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    if (saveGformLinkBtn && inputGformLink) {
      saveGformLinkBtn.addEventListener('click', () => {
        const url = inputGformLink.value.trim();
        if (!url || !url.startsWith('http')) {
          alert('Mohon masukkan URL Google Form yang valid (dimulai dengan https://)');
          return;
        }
        let embedUrl = url;
        if (!embedUrl.includes('embedded=true')) {
          embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'embedded=true';
        }
        activeGFormUrl = embedUrl;
        localStorage.setItem(STORAGE_KEY_GFORM, activeGFormUrl);
        updateGFormUI();
        if (modal) modal.classList.remove('open');
        showToast('Tautan Google Form kustom berhasil disimpan dan diperbarui!');
      });
    }
  }

  /* ==========================================================================
     HELPERS & UTILITIES
     ========================================================================== */
  function loadSavedCycle() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CYCLE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  function saveCycleData(data) {
    try {
      localStorage.setItem(STORAGE_KEY_CYCLE, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  function loadSavedLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveDailyLogs(data) {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  function getFormattedDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseDate(dateStr) {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function formatDateIndonesian(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatDateShort(date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }

  function showToast(msg) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1e293b;
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(10px);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3200);
  }
});
