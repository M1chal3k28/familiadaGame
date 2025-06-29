import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './Game'
import Game from './Game';
import MenuContainer from './Components/Menu/MenuContainer.tsx';
import { BASE_PATH, PLAY_PATH, SETTINGS_PATH } from './PathConfig.tsx';
import { SettingsProvider } from './SettingsContext.tsx';
import MainMenu from './Components/Menu/MainMenu.tsx';
import SettingsMenu from './Components/Menu/SettingsMenu.tsx';

const router = createHashRouter([
  {
    path: BASE_PATH,
    element: <App/>,
    children: [
      {
        path: BASE_PATH,
        element: <MenuContainer/>,
        children: [
          {
            path: BASE_PATH,
            element: <MainMenu/>
          },
          {
            path: SETTINGS_PATH,
            element: <SettingsMenu/>
          }
        ]
      },
      {
        path: PLAY_PATH,
        element: <Game/>,
      }
    ]
  }
]);

console.log(BASE_PATH);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <RouterProvider router={router}/>
    </SettingsProvider>
  </StrictMode>,
);
