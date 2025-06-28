import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './Game'
import Game from './Game';
import MainMenu from './Components/MainMenu.tsx';
import { BASE_PATH, PLAY_PATH } from './PathConfig.tsx';

const router = createBrowserRouter([
  {
    path: BASE_PATH,
    element: <App/>,
    children: [
      {
        path: BASE_PATH,
        element: <MainMenu/>
      },
      {
        path: PLAY_PATH,
        element: <Game/>,
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
);
