/**
 * SIRKULA B2B WEB APPLICATION
 * Platform Digital B2B Penyeimbang Ekosistem Ampas Kopi & Media Tanam Jamur Tiram
 * Core Logic & State Management
 */

// ==========================================================================
// AUTH: DEMO USER PRESETS
// ==========================================================================
const DEMO_USERS = {
  upstream: {
    name: 'Kopi Titik Koma',
    subtitle: 'Cabang Sudirman, Jakarta',
    role: 'upstream',
    roleLabel: 'Upstream',
    email: 'titikkoma@sirkula.id',
    avatar: 'K',
    avatarBg: '#6F4E37'
  },
  downstream: {
    name: 'Berkah Jamur Farm',
    subtitle: 'Lembang, Kab. Bandung Barat',
    role: 'downstream',
    roleLabel: 'Downstream',
    email: 'berkah@sirkula.id',
    avatar: 'B',
    avatarBg: '#1B4D3E'
  },
  biohub: {
    name: 'Bio-Hub Lembang',
    subtitle: 'Pusat Produksi Baglog SCG',
    role: 'biohub',
    roleLabel: 'Operator',
    email: 'operator@sirkula.id',
    avatar: 'O',
    avatarBg: '#3D52A0'
  }
};

// Global Application State
const appState = {
  activeRole: 'landing', // 'landing' | 'upstream' | 'downstream' | 'biohub'
  activeFarmerTab: 'store', // 'store' | 'calc'
  authUser: null, // null = not logged in
  
  // Telemetry Metrics
  metrics: {
    coffeeKgTotal: 14850,
    baglogsDistributed: 42600,
    ch4PreventedKg: 28215,
    
    // Cafe Specific State
    cafeSavedKg: 685,
    cafeCo2Kg: 1301,
    cafePoints: 3425,
    
    // Farmer Specific State
    baglogsOrdered: 2000
  },

  // Active Pipeline State
  pickupPipeline: {
    orderId: '#SRK-PK-904',
    currentStep: 2, // 1: Dijadwalkan, 2: Menuju Lokasi, 3: Ditimbang, 4: Selesai
    driverName: 'Kang Rahmat (Armada EV B-1492-SRK)'
  },

  // Formula Simulator
  formulaRatio: 20
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  initFormulaSimulation();
  calculateFarmerYield();
  updateWholesaleCalculation(2000, 'init');
  generateEcoBadgeQr();
  initAuthFromStorage(); // Restore session from localStorage

  // Close auth dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const pill = document.getElementById('authUserPill');
    const dropdown = document.getElementById('authDropdown');
    if (pill && dropdown && !pill.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Expose global functions to window for inline HTML onclick handlers
  window.switchRole = switchRole;
  window.switchFarmerTab = switchFarmerTab;
  window.updateFormulaSimulation = updateFormulaSimulation;
  window.setPresetWeight = setPresetWeight;
  window.handleSchedulePickup = handleSchedulePickup;
  window.simulateStep = simulateStep;
  window.openEcoBadgeModal = openEcoBadgeModal;
  window.closeEcoBadgeModal = closeEcoBadgeModal;
  window.copyBadgeLink = copyBadgeLink;
  window.downloadEcoBadge = downloadEcoBadge;
  window.updateWholesaleCalculation = updateWholesaleCalculation;
  window.setWholesaleQty = setWholesaleQty;
  window.openCheckoutModal = openCheckoutModal;
  window.closeCheckoutModal = closeCheckoutModal;
  window.handleConfirmOrder = handleConfirmOrder;
  window.calculateFarmerYield = calculateFarmerYield;
  window.updateCareScore = updateCareScore;
  window.handleSupportTicket = handleSupportTicket;
  window.handleTicketPhoto = handleTicketPhoto;
  window.handleBackdropClick = handleBackdropClick;
  window.scrollToElement = scrollToElement;
  window.showToast = showToast;

  // Auth functions
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.handleAuthBackdropClick = handleAuthBackdropClick;
  window.switchAuthTab = switchAuthTab;
  window.switchFormTab = switchFormTab;
  window.quickLoginAs = quickLoginAs;
  window.handleLogout = handleLogout;
  window.handleEmailLogin = handleEmailLogin;
  window.handleEmailRegister = handleEmailRegister;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.toggleAuthMenu = toggleAuthMenu;
  // Auth Page (full-page) functions
  window.openAuthPage = openAuthPage;
  window.switchAuthPageTab = switchAuthPageTab;
  window.selectRegRole = selectRegRole;
  window.handlePageEmailLogin = handlePageEmailLogin;
  window.handlePageEmailRegister = handlePageEmailRegister;
});

// Set default dates
function initDateDefaults() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const pickupDateInput = document.getElementById('pickupDate');
  if (pickupDateInput) pickupDateInput.value = todayStr;

  const yieldInocDateInput = document.getElementById('yieldInocDate');
  if (yieldInocDateInput) {
    // Default inoculation date: 27 Sep 2026
    yieldInocDateInput.value = todayStr;
  }

  const deliveryPref = document.getElementById('deliveryDatePref');
  if (deliveryPref) {
    const nextThreeDays = new Date(today);
    nextThreeDays.setDate(today.getDate() + 3);
    deliveryPref.value = nextThreeDays.toISOString().split('T')[0];
  }
}

// ==========================================================================
// ROLE SWITCHER NAVIGATION
// ==========================================================================
function switchRole(role, subTab = null) {
  appState.activeRole = role;

  // 1. Strictly Conditional Navbars: Hide all nav groups, then show only active role's nav
  const navGroups = {
    landing: document.getElementById('navGroupLanding'),
    upstream: document.getElementById('navGroupUpstream'),
    downstream: document.getElementById('navGroupDownstream'),
    biohub: document.getElementById('navGroupBiohub')
  };

  Object.values(navGroups).forEach(nav => {
    if (nav) nav.style.display = 'none';
  });

  if (navGroups[role]) {
    navGroups[role].style.display = 'flex';
  }

  // 2. Sync Floating Demo Role Switcher Buttons
  const barBtns = {
    landing: document.getElementById('barBtnLanding'),
    upstream: document.getElementById('barBtnUpstream'),
    downstream: document.getElementById('barBtnDownstream'),
    biohub: document.getElementById('barBtnBiohub')
  };

  Object.entries(barBtns).forEach(([key, btn]) => {
    if (btn) {
      if (key === role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  // 3. All views to hide first
  const allViews = ['viewLanding','viewUpstream','viewDownstream','viewBiohub','viewAuth'];
  allViews.forEach(id => document.getElementById(id)?.classList.remove('active'));

  // Show/hide navbar based on view
  const topNav = document.getElementById('topNav');

  if (role === 'auth') {
    // Full-page auth: hide top nav and floating bar
    if (topNav) topNav.style.display = 'none';
    const floatingBar = document.getElementById('floatingRoleBar');
    if (floatingBar) floatingBar.style.display = 'none';
    document.getElementById('viewAuth')?.classList.add('active');
    window.location.hash = 'auth';
    document.body.style.overflow = 'auto';
    return;
  }

  // Restore nav for all other views
  if (topNav) topNav.style.display = '';
  const floatingBar = document.getElementById('floatingRoleBar');
  if (floatingBar) floatingBar.style.display = 'flex';

  if (role === 'landing') {
    document.getElementById('viewLanding')?.classList.add('active');
    window.location.hash = 'landing';
  } else if (role === 'upstream') {
    document.getElementById('viewUpstream')?.classList.add('active');
    window.location.hash = 'upstream';
  } else if (role === 'downstream') {
    document.getElementById('viewDownstream')?.classList.add('active');
    window.location.hash = 'downstream';
    if (subTab) switchFarmerTab(subTab === 'catalog' ? 'store' : 'calc');
  } else if (role === 'biohub') {
    document.getElementById('viewBiohub')?.classList.add('active');
    window.location.hash = 'biohub';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sub-Tab Switcher for Farmer Downstream Portal
function switchFarmerTab(tabKey) {
  appState.activeFarmerTab = tabKey;
  const fNavStore = document.getElementById('fNavStore');
  const fNavCalc = document.getElementById('fNavCalc');
  const paneStore = document.getElementById('farmerTabStore');
  const paneCalc = document.getElementById('farmerTabCalc');

  if (tabKey === 'store') {
    fNavStore?.classList.add('active');
    fNavCalc?.classList.remove('active');
    paneStore?.classList.add('active');
    paneCalc?.classList.remove('active');
  } else {
    fNavCalc?.classList.add('active');
    fNavStore?.classList.remove('active');
    paneCalc?.classList.add('active');
    paneStore?.classList.remove('active');
  }
}

// ==========================================================================
// AUTHENTICATION SYSTEM
// ==========================================================================

/** Restore auth session from localStorage on page load */
function initAuthFromStorage() {
  try {
    const saved = localStorage.getItem('sirkula_auth');
    if (saved) {
      const user = JSON.parse(saved);
      appState.authUser = user;
      updateAuthNavbar(user);
      // Restore last view
      const lastRole = localStorage.getItem('sirkula_role') || user.role;
      if (lastRole && lastRole !== 'landing') switchRole(lastRole);
    }
  } catch (e) {
    localStorage.removeItem('sirkula_auth');
  }
}

/** Update navbar auth widget to reflect current auth state */
function updateAuthNavbar(user) {
  const btnLogin = document.getElementById('btnAuthLogin');
  const userPill = document.getElementById('authUserPill');
  const authName = document.getElementById('authName');
  const authRoleTag = document.getElementById('authRoleTag');
  const authAvatar = document.getElementById('authAvatar');
  const authDropdownName = document.getElementById('authDropdownName');

  if (user) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (userPill) userPill.style.display = 'flex';
    if (authName) authName.textContent = user.name;
    if (authRoleTag) {
      authRoleTag.textContent = user.roleLabel;
      authRoleTag.className = 'auth-role-tag';
      if (user.role === 'upstream') authRoleTag.classList.add('tag-upstream');
      else if (user.role === 'downstream') authRoleTag.classList.add('tag-downstream');
      else authRoleTag.classList.add('tag-biohub');
    }
    if (authAvatar) {
      authAvatar.textContent = user.avatar;
      authAvatar.style.background = user.avatarBg;
    }
    if (authDropdownName) authDropdownName.textContent = user.name;
  } else {
    if (btnLogin) btnLogin.style.display = 'flex';
    if (userPill) userPill.style.display = 'none';
  }
}

/** Open the auth modal */
function openAuthModal() {
  const overlay = document.getElementById('authModalOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Reset to Demo tab
    switchAuthTab('demo');
  }
}

/** Close the auth modal */
function closeAuthModal() {
  const overlay = document.getElementById('authModalOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/** Handle click outside modal box to close */
function handleAuthBackdropClick(e) {
  if (e.target.id === 'authModalOverlay') closeAuthModal();
}

/** Switch between Demo and Form tabs in the auth modal */
function switchAuthTab(tab) {
  const tabDemo = document.getElementById('authTabDemo');
  const tabForm = document.getElementById('authTabForm');
  const paneDemo = document.getElementById('authPaneDemo');
  const paneForm = document.getElementById('authPaneForm');

  if (tab === 'demo') {
    tabDemo?.classList.add('active');
    tabForm?.classList.remove('active');
    paneDemo?.classList.add('active');
    paneForm?.classList.remove('active');
  } else {
    tabForm?.classList.add('active');
    tabDemo?.classList.remove('active');
    paneForm?.classList.add('active');
    paneDemo?.classList.remove('active');
  }
}

/** Switch Masuk / Daftar sub-tabs inside Tab B */
function switchFormTab(tab) {
  const masukBtn = document.getElementById('formTabMasuk');
  const daftarBtn = document.getElementById('formTabDaftar');
  const masukForm = document.getElementById('formMasuk');
  const daftarForm = document.getElementById('formDaftar');

  if (tab === 'masuk') {
    masukBtn?.classList.add('active');
    daftarBtn?.classList.remove('active');
    if (masukForm) masukForm.style.display = 'flex';
    if (daftarForm) daftarForm.style.display = 'none';
  } else {
    daftarBtn?.classList.add('active');
    masukBtn?.classList.remove('active');
    if (daftarForm) daftarForm.style.display = 'flex';
    if (masukForm) masukForm.style.display = 'none';
  }
}

/** 1-Click demo login by role key ('upstream' | 'downstream' | 'biohub') */
function quickLoginAs(roleKey) {
  const user = DEMO_USERS[roleKey];
  if (!user) return;

  appState.authUser = user;
  localStorage.setItem('sirkula_auth', JSON.stringify(user));
  localStorage.setItem('sirkula_role', roleKey);

  updateAuthNavbar(user);
  closeAuthModal();
  closeAuthDropdown();
  switchRole(roleKey);

  showToast(`Masuk sebagai ${user.name} (${user.roleLabel})`, 'success');
}

/** Handle email/password mock login from Tab B */
function handleEmailLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail')?.value.trim();
  // Mock: accept any email; map to upstream by default or detect by email prefix
  let roleKey = 'upstream';
  if (email.includes('berkah') || email.includes('jamur') || email.includes('tani')) roleKey = 'downstream';
  else if (email.includes('operator') || email.includes('biohub') || email.includes('hub')) roleKey = 'biohub';

  // Create a user object from form input
  const mockUser = { ...DEMO_USERS[roleKey], email };
  appState.authUser = mockUser;
  localStorage.setItem('sirkula_auth', JSON.stringify(mockUser));
  localStorage.setItem('sirkula_role', roleKey);

  updateAuthNavbar(mockUser);
  closeAuthModal();
  switchRole(roleKey);
  showToast(`Berhasil masuk sebagai ${mockUser.name}`, 'success');
}

/** Handle registration mock flow */
function handleEmailRegister(event) {
  event.preventDefault();
  const name = document.getElementById('regNama')?.value.trim();
  const roleKey = document.getElementById('regPeran')?.value || 'upstream';
  const email = document.getElementById('regEmail')?.value.trim();

  const baseUser = DEMO_USERS[roleKey];
  const newUser = {
    ...baseUser,
    name: name || baseUser.name,
    email,
    avatar: (name || baseUser.name)[0].toUpperCase()
  };

  appState.authUser = newUser;
  localStorage.setItem('sirkula_auth', JSON.stringify(newUser));
  localStorage.setItem('sirkula_role', roleKey);

  updateAuthNavbar(newUser);
  closeAuthModal();
  switchRole(roleKey);
  showToast(`Akun berhasil dibuat! Selamat datang, ${newUser.name}`, 'success');
}

/** Logout and return to landing */
function handleLogout() {
  appState.authUser = null;
  localStorage.removeItem('sirkula_auth');
  localStorage.removeItem('sirkula_role');
  updateAuthNavbar(null);
  closeAuthDropdown();
  switchRole('landing');
  showToast('Berhasil keluar dari sesi Sirkula', 'info');
}

/** Toggle the auth account dropdown open/closed */
function toggleAuthMenu() {
  const dropdown = document.getElementById('authDropdown');
  dropdown?.classList.toggle('open');
}

/** Close the auth dropdown */
function closeAuthDropdown() {
  document.getElementById('authDropdown')?.classList.remove('open');
}

/** Toggle password field visibility */
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }
}

// ==========================================================================
// AUTH PAGE (FULL-PAGE LOGIN / REGISTER)
// ==========================================================================

/** Navigate to the full-page auth view */
function openAuthPage(tab = 'masuk') {
  switchRole('auth');
  switchAuthPageTab(tab);
  // Init password strength listener
  const pwInput = document.getElementById('pageRegPassword');
  if (pwInput && !pwInput._strengthBound) {
    pwInput.addEventListener('input', () => checkPasswordStrength(pwInput.value));
    pwInput._strengthBound = true;
  }
}

/** Switch tabs on the full-page auth: 'masuk' | 'daftar' | 'demo' */
function switchAuthPageTab(tab) {
  const tabs = {
    masuk: { btn: 'pageTabMasuk', pane: 'pagePaneMasuk' },
    daftar: { btn: 'pageTabDaftar', pane: 'pagePaneDaftar' },
    demo: { btn: 'pageTabDemo', pane: 'pagePaneDemo' }
  };

  // Deactivate all
  Object.values(tabs).forEach(({ btn, pane }) => {
    document.getElementById(btn)?.classList.remove('active');
    document.getElementById(pane)?.classList.remove('active');
  });

  // Activate target
  document.getElementById(tabs[tab]?.btn)?.classList.add('active');
  document.getElementById(tabs[tab]?.pane)?.classList.add('active');

  // Update header text
  const titleEl = document.getElementById('authPageTitle');
  const subEl = document.getElementById('authPageSubtitle');
  const demoBanner = document.getElementById('authDemoBanner');
  if (tab === 'masuk') {
    if (titleEl) titleEl.textContent = 'Masuk ke Akun Anda';
    if (subEl) subEl.textContent = 'Akses dashboard mitra Sirkula Anda';
    if (demoBanner) demoBanner.style.display = 'flex';
  } else if (tab === 'daftar') {
    if (titleEl) titleEl.textContent = 'Daftar Akun Mitra';
    if (subEl) subEl.textContent = 'Mulai bergabung dalam ekosistem Sirkula secara gratis';
    if (demoBanner) demoBanner.style.display = 'flex';
    // Init password strength
    const pwInput = document.getElementById('pageRegPassword');
    if (pwInput && !pwInput._strengthBound) {
      pwInput.addEventListener('input', () => checkPasswordStrength(pwInput.value));
      pwInput._strengthBound = true;
    }
  } else if (tab === 'demo') {
    if (titleEl) titleEl.textContent = 'Eksplorasi Demo Cepat';
    if (subEl) subEl.textContent = 'Masuk langsung tanpa registrasi sebagai akun percontohan';
    if (demoBanner) demoBanner.style.display = 'none';
  }
}

/** Select role in registration form visual selector */
function selectRegRole(roleKey) {
  const btns = ['roleSelUpstream', 'roleSelDownstream', 'roleSelBiohub'];
  const map = { upstream: 'roleSelUpstream', downstream: 'roleSelDownstream', biohub: 'roleSelBiohub' };
  btns.forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById(map[roleKey])?.classList.add('active');
  const hiddenInput = document.getElementById('pageRegRole');
  if (hiddenInput) hiddenInput.value = roleKey;
}

/** Real-time password strength meter */
function checkPasswordStrength(pw) {
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!fill || !label) return;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { pct: '25%', color: '#ef4444', text: 'Lemah' },
    { pct: '50%', color: '#f97316', text: 'Cukup' },
    { pct: '75%', color: '#eab308', text: 'Baik' },
    { pct: '100%', color: '#22c55e', text: 'Sangat Kuat' }
  ];
  const lvl = levels[Math.max(0, score - 1)] || levels[0];
  fill.style.width = pw.length > 0 ? lvl.pct : '0%';
  fill.style.background = lvl.color;
  label.textContent = pw.length > 0 ? lvl.text : '';
  label.style.color = lvl.color;
}

/** Handle login from full-page form */
function handlePageEmailLogin(event) {
  event.preventDefault();
  const email = document.getElementById('pageLoginEmail')?.value.trim();
  let roleKey = 'upstream';
  if (email.includes('berkah') || email.includes('jamur') || email.includes('tani')) roleKey = 'downstream';
  else if (email.includes('operator') || email.includes('biohub') || email.includes('hub')) roleKey = 'biohub';

  const mockUser = { ...DEMO_USERS[roleKey], email };
  appState.authUser = mockUser;
  localStorage.setItem('sirkula_auth', JSON.stringify(mockUser));
  localStorage.setItem('sirkula_role', roleKey);

  updateAuthNavbar(mockUser);
  switchRole(roleKey);
  showToast(`Selamat datang kembali, ${mockUser.name}!`, 'success');
}

/** Handle registration from full-page form */
function handlePageEmailRegister(event) {
  event.preventDefault();
  const name = document.getElementById('pageRegNama')?.value.trim();
  const roleKey = document.getElementById('pageRegRole')?.value || 'upstream';
  const email = document.getElementById('pageRegEmail')?.value.trim();
  const city = document.getElementById('pageRegCity')?.value.trim();

  const baseUser = DEMO_USERS[roleKey];
  const newUser = {
    ...baseUser,
    name: name || baseUser.name,
    email,
    subtitle: city ? `${city}` : baseUser.subtitle,
    avatar: (name || baseUser.name)[0].toUpperCase()
  };

  appState.authUser = newUser;
  localStorage.setItem('sirkula_auth', JSON.stringify(newUser));
  localStorage.setItem('sirkula_role', roleKey);

  updateAuthNavbar(newUser);
  switchRole(roleKey);
  showToast(`Akun berhasil dibuat! Selamat datang, ${newUser.name} 🎉`, 'success');
}

// ==========================================================================
// FEATURE 1 (MVP FISIK): INTERACTIVE FORMULA SIMULATOR
// ==========================================================================

function initFormulaSimulation() {
  updateFormulaSimulation(20);
}

function updateFormulaSimulation(scgPercent) {
  const percent = parseInt(scgPercent, 10);
  appState.formulaRatio = percent;

  const display = document.getElementById('coffeeRatioDisplay');
  const incubation = document.getElementById('formulaIncubationSpeed');
  const costSaving = document.getElementById('formulaCostSaving');
  const density = document.getElementById('formulaDensity');
  const cnRatio = document.getElementById('formulaCnRatio');
  const compBar = document.getElementById('compositionBar');

  if (!display) return;

  display.textContent = `${percent}% SCG Formula ${percent === 20 ? '(Formula Emas)' : ''}`;

  let incSpeedText = '22 Hari (-4 hari)';
  let savingText = 'Hemat 17.5% vs Pasaran';
  let densityText = 'Grade A+ (Putih Tebal Merata)';
  let cnText = '28.4 : 1 (Tingkat Optimal)';

  // Calculate compositions
  let sawdust = 80 - percent;
  let bran = 15;
  let calcium = 5;

  if (percent === 10) {
    incSpeedText = '24 Hari (-2 hari lebih cepat)';
    savingText = 'Hemat 12.0% vs Pasaran';
    densityText = 'Grade A (Pertumbuhan Normal)';
    cnText = '26.1 : 1 (Standar Basal)';
    sawdust = 70;
  } else if (percent === 15) {
    incSpeedText = '23 Hari (-3 hari lebih cepat)';
    savingText = 'Hemat 15.0% vs Pasaran';
    densityText = 'Grade A+ (Miselium Aktif)';
    cnText = '27.3 : 1 (Subur)';
    sawdust = 65;
  } else if (percent === 20) {
    incSpeedText = '22 Hari (-4 hari lebih cepat)';
    savingText = 'Hemat 17.5% vs Pasaran';
    densityText = 'Grade A+ (Putih Tebal Merata)';
    cnText = '28.4 : 1 (Tingkat Optimal)';
    sawdust = 60;
  } else if (percent === 25) {
    incSpeedText = '21 Hari (-5 hari lebih cepat)';
    savingText = 'Hemat 19.5% vs Pasaran';
    densityText = 'Grade A+ (Sangat Padat)';
    cnText = '29.6 : 1 (Kaya Nitrogen)';
    sawdust = 55;
  } else if (percent === 30) {
    incSpeedText = '20 Hari (-6 hari lebih cepat)';
    savingText = 'Hemat 21.0% vs Pasaran';
    densityText = 'Grade A (Perlu Aerasi Tambahan)';
    cnText = '31.2 : 1 (Kepadatan Tinggi)';
    sawdust = 50;
  }

  incubation.textContent = incSpeedText;
  costSaving.textContent = savingText;
  density.textContent = densityText;
  cnRatio.textContent = cnText;

  // Update Composition visual bar
  if (compBar) {
    compBar.innerHTML = `
      <div class="comp-slice comp-coffee" style="width: ${percent}%;" title="Ampas Kopi: ${percent}%">${percent}% Kopi</div>
      <div class="comp-slice comp-sawdust" style="width: ${sawdust}%;" title="Serbuk Sengon: ${sawdust}%">${sawdust}% Serbuk Sengon</div>
      <div class="comp-slice comp-bran" style="width: ${bran}%;" title="Dedak Padi: ${bran}%">${bran}% Dedak</div>
      <div class="comp-slice comp-calcium" style="width: ${calcium}%;" title="Kapur CaCO3: ${calcium}%">${calcium}% CaCO₃</div>
    `;
  }
}

// ==========================================================================
// FEATURE 1 (UPSTREAM): PICKUP SCHEDULER & PIPELINE
// ==========================================================================
function setPresetWeight(weight) {
  const weightInput = document.getElementById('pickupWeight');
  if (weightInput) {
    weightInput.value = weight;
  }
  const btns = document.querySelectorAll('.btn-preset');
  btns.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function handleSchedulePickup(e) {
  e.preventDefault();
  const dateVal = document.getElementById('pickupDate').value;
  const slotVal = document.getElementById('pickupSlot').value;
  const weightVal = parseFloat(document.getElementById('pickupWeight').value) || 25;
  const notesVal = document.getElementById('storageNotes').value;

  // Update Cafe Impact State
  appState.metrics.cafeSavedKg += weightVal;
  const co2Prevented = Math.round(weightVal * 1.9);
  appState.metrics.cafeCo2Kg += co2Prevented;
  appState.metrics.cafePoints += Math.round(weightVal * 5);

  // Update Global Telemetry Ribbon
  appState.metrics.coffeeKgTotal += weightVal;
  appState.metrics.ch4PreventedKg += co2Prevented;

  updateAllMetricDisplays();

  // Reset Pipeline Stepper to Step 1: "Dijadwalkan"
  const newOrderId = `#SRK-PK-${Math.floor(905 + Math.random() * 90)}`;
  appState.pickupPipeline.orderId = newOrderId;
  appState.pickupPipeline.currentStep = 1;

  const orderTag = document.getElementById('activeOrderIdTag');
  if (orderTag) orderTag.textContent = `Order ${newOrderId}`;

  simulateStep(1);

  // Prepend to history list
  const historyList = document.getElementById('pickupHistoryList');
  if (historyList) {
    const newItem = document.createElement('div');
    newItem.className = 'history-item';
    newItem.innerHTML = `
      <div class="history-left">
        <span class="hist-id">${newOrderId}</span>
        <span class="hist-date">${formatDate(dateVal)} (${slotVal.split(' ')[0]})</span>
      </div>
      <div class="history-mid">
        <span class="hist-weight">${weightVal} kg SCG</span>
        <span class="hist-co2">${co2Prevented} kg CO₂e dicegah</span>
      </div>
      <span class="badge-status-done" style="background:#FEF3C7;color:#92400E;">Dijadwalkan</span>
    `;
    historyList.prepend(newItem);
  }

  // Trigger Confetti & Success Toast
  triggerConfetti();
  showToast(`Berhasil! Jadwal penjemputan ${weightVal} kg ampas kopi terkonfirmasi untuk ${formatDate(dateVal)}.`, 'success');
}

function simulateStep(stepNumber) {
  appState.pickupPipeline.currentStep = stepNumber;

  // Demo step buttons
  const demoBtns = document.querySelectorAll('.btn-demo-step');
  demoBtns.forEach((btn, idx) => {
    if (idx + 1 === stepNumber) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const steps = [
    { node: document.getElementById('step1'), conn: document.getElementById('conn1') },
    { node: document.getElementById('step2'), conn: document.getElementById('conn2') },
    { node: document.getElementById('step3'), conn: document.getElementById('conn3') },
    { node: document.getElementById('step4'), conn: null }
  ];

  steps.forEach((s, idx) => {
    const stepIdx = idx + 1;
    s.node.className = 'step-node';

    if (stepIdx < stepNumber) {
      s.node.classList.add('completed');
      s.node.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-check"></i>';
      if (s.conn) s.conn.className = 'step-connector active';
    } else if (stepIdx === stepNumber) {
      s.node.classList.add('current');
      if (stepNumber === 1) s.node.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-calendar-check"></i>';
      if (stepNumber === 2) s.node.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-truck-moving"></i>';
      if (stepNumber === 3) s.node.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-scale-balanced"></i>';
      if (stepNumber === 4) s.node.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      if (s.conn) s.conn.className = 'step-connector';
    } else {
      s.node.classList.add('pending');
      if (s.conn) s.conn.className = 'step-connector';
    }
  });

  if (stepNumber === 4) {
    showToast('Penjemputan selesai! Emisi resmi terkreditasi ke akun kedai kopi Anda.', 'success');
  }
}

// Update Metric Displays Across App
function updateAllMetricDisplays() {
  const ribbonCoffee = document.getElementById('ribbonCoffeeKg');
  const ribbonBaglog = document.getElementById('ribbonBaglogCount');
  const ribbonCh4 = document.getElementById('ribbonCh4Kg');

  if (ribbonCoffee) ribbonCoffee.textContent = appState.metrics.coffeeKgTotal.toLocaleString('id-ID');
  if (ribbonBaglog) ribbonBaglog.textContent = appState.metrics.baglogsDistributed.toLocaleString('id-ID');
  if (ribbonCh4) ribbonCh4.textContent = appState.metrics.ch4PreventedKg.toLocaleString('id-ID');

  const cafeKg = document.getElementById('cafeTotalKg');
  const cafeCo2 = document.getElementById('cafeTotalCo2');
  const cafePts = document.getElementById('cafeRewardPoints');

  if (cafeKg) cafeKg.textContent = appState.metrics.cafeSavedKg.toLocaleString('id-ID');
  if (cafeCo2) cafeCo2.textContent = appState.metrics.cafeCo2Kg.toLocaleString('id-ID');
  if (cafePts) cafePts.textContent = appState.metrics.cafePoints.toLocaleString('id-ID');

  // Badge Modal numbers
  const badgeKg = document.getElementById('badgeSavedKg');
  const badgeCo2 = document.getElementById('badgeCo2Kg');
  if (badgeKg) badgeKg.textContent = appState.metrics.cafeSavedKg.toLocaleString('id-ID');
  if (badgeCo2) badgeCo2.textContent = appState.metrics.cafeCo2Kg.toLocaleString('id-ID');
}

// ==========================================================================
// ECO-BADGE MODAL & QR CODE GENERATION
// ==========================================================================
function openEcoBadgeModal() {
  const modal = document.getElementById('ecoBadgeModal');
  if (modal) {
    modal.classList.add('open');
    generateEcoBadgeQr();
  }
}

function closeEcoBadgeModal() {
  const modal = document.getElementById('ecoBadgeModal');
  if (modal) modal.classList.remove('open');
}

function generateEcoBadgeQr() {
  const qrBox = document.getElementById('ecoBadgeQr');
  if (!qrBox) return;

  qrBox.innerHTML = '';
  if (window.QRCode) {
    new QRCode(qrBox, {
      text: 'https://sirkula.id/verify/partner/SRK-UP-0881',
      width: 130,
      height: 130,
      colorDark: '#1B4D3E',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

function copyBadgeLink() {
  const dummyUrl = 'https://sirkula.id/verify/partner/SRK-UP-0881';
  navigator.clipboard.writeText(dummyUrl).then(() => {
    showToast('Tautan sertifikat berhasil disalin ke clipboard!', 'success');
  }).catch(() => {
    showToast('Tautan sertifikat: ' + dummyUrl, 'info');
  });
}

function downloadEcoBadge() {
  showToast('Mengunduh paket Eco-Badge Sirkula (PNG Resolusi Tinggi untuk Table Tent Meja Kasir)...', 'success');
  setTimeout(() => {
    showToast('Unduhan selesai: Sirkula_Eco_Badge_Sudirman_2026.png', 'info');
  }, 1200);
}

// ==========================================================================
// FEATURE 2 (DOWNSTREAM): BAGLOG WHOLESALE STORE & CALCULATOR
// ==========================================================================
function updateWholesaleCalculation(quantity, source = 'slider') {
  let qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 500) qty = 500;
  if (qty > 50000) qty = 50000;

  appState.metrics.baglogsOrdered = qty;

  const slider = document.getElementById('orderQtySlider');
  const input = document.getElementById('orderQtyInput');
  const btnCheckoutQty = document.getElementById('btnCheckoutQty');

  if (source === 'slider' && input) {
    input.value = qty;
  } else if (source === 'input' && slider) {
    slider.value = Math.min(qty, 10000);
  }

  if (btnCheckoutQty) {
    btnCheckoutQty.textContent = qty.toLocaleString('id-ID');
  }

  // Cost calculations
  const priceSirkula = 2500;
  const priceMarket = 3000;

  const totalSirkula = qty * priceSirkula;
  const totalMarket = qty * priceMarket;
  const savings = totalMarket - totalSirkula;

  const calcTotal = document.getElementById('calcSirkulaTotal');
  const calcMarket = document.getElementById('calcMarketTotal');
  const calcSavings = document.getElementById('calcSavingsTotal');

  if (calcTotal) calcTotal.textContent = `Rp ${totalSirkula.toLocaleString('id-ID')}`;
  if (calcMarket) calcMarket.textContent = `Rp ${totalMarket.toLocaleString('id-ID')}`;
  if (calcSavings) calcSavings.textContent = `Rp ${savings.toLocaleString('id-ID')}`;
}

function setWholesaleQty(qty) {
  const slider = document.getElementById('orderQtySlider');
  const input = document.getElementById('orderQtyInput');
  if (slider) slider.value = qty;
  if (input) input.value = qty;
  updateWholesaleCalculation(qty, 'slider');
}

function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const qty = appState.metrics.baglogsOrdered;
  const total = qty * 2500;

  const summaryQty = document.getElementById('modalSummaryQty');
  const summaryTotal = document.getElementById('modalSummaryTotal');

  if (summaryQty) summaryQty.textContent = `${qty.toLocaleString('id-ID')} Unit Baglog Sirkula`;
  if (summaryTotal) summaryTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;

  if (modal) modal.classList.add('open');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('open');
}

function handleConfirmOrder(e) {
  e.preventDefault();
  const qty = appState.metrics.baglogsOrdered;
  const total = qty * 2500;

  // Update baglog distributed ribbon
  appState.metrics.baglogsDistributed += qty;
  updateAllMetricDisplays();

  closeCheckoutModal();
  triggerConfetti();
  showToast(`Pemesanan grosir ${qty.toLocaleString('id-ID')} baglog (Rp ${total.toLocaleString('id-ID')}) berhasil dikonfirmasi! Surat Jalan & Faktur diterbitkan.`, 'success');
}

// ==========================================================================
// FEATURE 3 (DOWNSTREAM): FARMER YIELD & HARVEST CALCULATOR
// ==========================================================================
function calculateFarmerYield() {
  const baglogCountInput = document.getElementById('yieldBaglogCount');
  const inocDateInput = document.getElementById('yieldInocDate');
  const priceInput = document.getElementById('yieldPricePerKg');

  const baglogs = parseInt(baglogCountInput?.value || 1000, 10);
  const pricePerKg = parseInt(priceInput?.value || 15000, 10);

  let inocDate = new Date();
  if (inocDateInput && inocDateInput.value) {
    inocDate = new Date(inocDateInput.value);
  }

  // Sirkula Bio-Technology: Colonization in 22 days (vs 26-28 ordinary)
  const colonizationDays = 22;
  const flush1Days = 28;
  const flush2Days = 42;
  const flush3Days = 56;

  const dateCol = addDays(inocDate, colonizationDays);
  const dateF1 = addDays(inocDate, flush1Days);
  const dateF2 = addDays(inocDate, flush2Days);
  const dateF3 = addDays(inocDate, flush3Days);

  // Yield calculations:
  // Baglog weight: 1.2 kg. Biological efficiency: 40% = ~0.48 kg / baglog total over 3 flushes.
  // Flush 1: ~46% of total yield (~0.22 kg/baglog)
  // Flush 2: ~33% of total yield (~0.16 kg/baglog)
  // Flush 3: ~21% of total yield (~0.10 kg/baglog)
  const yieldF1 = Math.round(baglogs * 0.22);
  const yieldF2 = Math.round(baglogs * 0.16);
  const yieldF3 = Math.round(baglogs * 0.10);
  const totalYield = yieldF1 + yieldF2 + yieldF3;

  const totalRevenue = totalYield * pricePerKg;
  const baglogCost = baglogs * 2500;
  const estimatedNetProfit = totalRevenue - baglogCost;

  // Update DOM dates
  const dateColEl = document.getElementById('dateColonization');
  const dateF1El = document.getElementById('dateFlush1');
  const dateF2El = document.getElementById('dateFlush2');
  const dateF3El = document.getElementById('dateFlush3');

  if (dateColEl) dateColEl.textContent = formatDate(dateCol);
  if (dateF1El) dateF1El.textContent = formatDate(dateF1);
  if (dateF2El) dateF2El.textContent = formatDate(dateF2);
  if (dateF3El) dateF3El.textContent = formatDate(dateF3);

  // Update flush notes
  const descF1 = document.getElementById('descFlush1');
  const descF2 = document.getElementById('descFlush2');
  const descF3 = document.getElementById('descFlush3');

  if (descF1) descF1.textContent = `Estimasi panen: ${yieldF1.toLocaleString('id-ID')} kg jamur tiram segar`;
  if (descF2) descF2.textContent = `Estimasi panen: ${yieldF2.toLocaleString('id-ID')} kg jamur tiram segar`;
  if (descF3) descF3.textContent = `Estimasi panen: ${yieldF3.toLocaleString('id-ID')} kg jamur tiram segar`;

  // Update Big Stats
  const totalYieldKgEl = document.getElementById('totalYieldKg');
  const totalRevenueRpEl = document.getElementById('totalRevenueRp');
  const netProfitEl = document.getElementById('netProfitProjection');

  if (totalYieldKgEl) totalYieldKgEl.textContent = totalYield.toLocaleString('id-ID');
  if (totalRevenueRpEl) totalRevenueRpEl.textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
  if (netProfitEl) netProfitEl.textContent = `Estimasi Laba Kotor: Rp ${estimatedNetProfit.toLocaleString('id-ID')}`;
}

// Checklist Compliance Tracker
function updateCareScore() {
  const checkboxes = document.querySelectorAll('#careChecklist input[type="checkbox"]');
  let checkedCount = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  const percentage = Math.round((checkedCount / checkboxes.length) * 100);
  const progressBar = document.getElementById('careProgressBar');
  const scoreText = document.getElementById('careScoreText');

  if (progressBar) progressBar.style.width = `${percentage}%`;

  if (scoreText) {
    if (percentage === 100) {
      scoreText.textContent = '100% (Sangat Optimal)';
      scoreText.className = 'text-emerald';
      if (progressBar) progressBar.style.background = '#10B981';
    } else if (percentage >= 75) {
      scoreText.textContent = `${percentage}% (Cukup Baik)`;
      scoreText.className = 'text-blue';
      if (progressBar) progressBar.style.background = '#3B82F6';
    } else {
      scoreText.textContent = `${percentage}% (Perlu Perhatian Kumbung)`;
      scoreText.className = 'text-brown';
      if (progressBar) progressBar.style.background = '#D97706';
    }
  }
}

// Support Ticket Handler
function handleSupportTicket(e) {
  e.preventDefault();
  const batch = document.getElementById('ticketBatch').value;
  const issue = document.getElementById('ticketIssueType').value;
  const qty = document.getElementById('ticketQuantity').value;

  showToast(`Tiket garansi tercatat: #${Math.floor(1000 + Math.random() * 9000)}. Tim teknis Sirkula akan mengirimkan ${qty} baglog pengganti gratis setelah verifikasi.`, 'success');

  const dropzoneText = document.getElementById('dropzoneText');
  if (dropzoneText) dropzoneText.textContent = 'Klik untuk pilih foto kumbung / baglog bermasalah';
}

function handleTicketPhoto(input) {
  if (input.files && input.files[0]) {
    const filename = input.files[0].name;
    const dropzoneText = document.getElementById('dropzoneText');
    if (dropzoneText) {
      dropzoneText.textContent = `Foto terpilih: ${filename} (Siap diunggah)`;
    }
    showToast('Foto bukti substrat berhasil dilampirkan.', 'info');
  }
}



// ==========================================================================
// UTILITY HELPERS
// ==========================================================================
function handleBackdropClick(e, modalId) {
  if (e.target.id === modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }
}

function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(dateObjOrString) {
  const date = new Date(dateObjOrString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '<i class="fa-solid fa-circle-info"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function triggerConfetti() {
  if (window.confetti) {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#10B981', '#1B4D3E', '#DDB892', '#FBBF24']
    });
  }
}
