import { useUi } from '../../shared/context/UiContext';

export const DesktopButton = ({}) => {
  const { setIsAppOpen } = useUi();

  async function openApp() {
    setIsAppOpen(true);
  }

  return (
    <div
      className="desktop-icon"
      onClick={openApp}
      style={{ cursor: 'pointer', textAlign: 'center', width: '80px' }}
    >
      <div className="icon">
        <img
          src="/desktop-icon.png"
          alt="Icon"
          style={{ width: '64px', height: '64px', display: 'block', margin: '0 auto' }}
        />
      </div>
      <span
        style={{
          display: 'block',
          marginTop: '4px',
          marginLeft: '8px',
          fontSize: '14px',
          color: '#660033',
        }}
      >
        <strong>✧User Stats✧</strong>
      </span>
    </div>
  );
};
