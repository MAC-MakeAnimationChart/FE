import { RouterProvider } from "react-router-dom"
import { MACRouter } from './MACRouter'
function App() {
  return (
    <>
      <RouterProvider router={MACRouter} />
    </>
  )
}

export default App
