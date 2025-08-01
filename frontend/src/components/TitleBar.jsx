import { useUi } from "@context/UiContext";

export const TitleBar = () => {
  const { setIsAppOpen, setIsClosing } = useUi();

	async function closeApp() {
    setIsClosing(true);
    setTimeout(() => {
      setIsAppOpen(false);
      setIsClosing(false);
    }, 150);
	}

  return (
    <div className="title-bar">
      <div className="title-bar-text">WinCharts</div>
      <div className="title-bar-controls">
        <button 
          aria-label="Close" 
          onClick={closeApp}
        />
      </div>
    </div>
  )
}