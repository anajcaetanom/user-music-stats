import { useUi } from "@context/UiContext";

export const TitleBar = () => {
  const { setIsAppOpen } = useUi();

	async function closeApp() {
		setIsAppOpen(false);
	}

  return (
    <div className="title-bar">
      <div className="title-bar-text">LastFM Stats</div>
      <div className="title-bar-controls">
        <button 
          aria-label="Close" 
          onClick={closeApp}
        />
      </div>
    </div>
  )
}