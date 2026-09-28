'use client';

import { useApp } from '@/context/AppContext';
import { RoleKey } from '@/lib/types';

const ROLE_BUTTONS: { key: RoleKey; icon: string; label: string }[] = [
  { key: 'landing',    icon: 'fa-globe',      label: 'Overview Publik' },
  { key: 'upstream',   icon: 'fa-mug-saucer', label: 'Kedai Kopi' },
  { key: 'downstream', icon: 'fa-seedling',   label: 'Petani Jamur' },
  { key: 'biohub',     icon: 'fa-microchip',  label: 'BioHub Central' },
];

export default function FloatingRoleBar() {
  const { state, switchRole, openRoleSettings } = useApp();
  const { activeRole } = state;

  return (
    <aside className="floating-role-bar" id="floatingRoleBar" aria-label="Demo Role Switcher">
      <div className="role-bar-label">
        <i className="fa-solid fa-wand-magic-sparkles" />
        <span>Peran:</span>
      </div>
      {ROLE_BUTTONS.map(({ key, icon, label }) => (
        <button
          key={key}
          className={`role-bar-btn${activeRole === key ? ' active' : ''}`}
          id={`barBtn${key.charAt(0).toUpperCase() + key.slice(1)}`}
          onClick={() => switchRole(key)}
        >
          <i className={`fa-solid ${icon}`} />
          {' '}{label}
        </button>
      ))}

      <div className="role-bar-divider" />

      <button
        type="button"
        className="role-bar-btn role-bar-settings-btn"
        onClick={openRoleSettings}
        title="Buka Pengaturan Akun & Peran"
        id="barBtnSettings"
      >
        <i className="fa-solid fa-gear" />
        <span>Pengaturan</span>
      </button>
    </aside>
  );
}
