import '../styles/App.css';
import "98.css";

import {DesktopButton} from "./components/DesktopButton";
import ChartsPage from "../features/charts/ChartsPage";
import {TitleBar} from "./components/TitleBar";
import {useUi} from "../shared/context/UiContext";
import clsx from "clsx";



const App = () => {

  const { isAppOpen, isClosing } = useUi();

  return (
    <div className="background">
      {!isAppOpen ? (
        <DesktopButton />
      ) : (
          <div
            className={clsx(
                "window",
                { closing: isClosing },
            )}
          >
          <TitleBar />
          <div className="window-body">
            <ChartsPage />
          </div>
        </div>
      )}
    </div>
  );
};


export default App;
