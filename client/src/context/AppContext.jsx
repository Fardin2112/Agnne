import { createContext, useState } from "react";

// Fix the typo here: AppContext not AppConetxt
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [toggleHome, setToggleHome] = useState(false);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const [sessionComlpletePopup, setSessionCompletePopup] = useState(false);

  const value = {
    toggleHome,
    setToggleHome,
    startButtonClicked,
    setStartButtonClicked,
    sessionComlpletePopup, setSessionCompletePopup
  };

  // Access the Provider inside the context object
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
