import { useUi } from "../context/UiContext"

export const DesktopButton = ({}) => {
	const { setIsAppOpen } = useUi();

	async function openApp() {
		setIsAppOpen(true);
	}

	return (
		<div className="desktop-icon" onClick={openApp}>
			<p>oi</p>
		</div>
	)
}