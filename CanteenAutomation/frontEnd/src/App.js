import './App.css';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
import SignIn from './sign_in.js';
import SignUp from './sign_up.js';
import RootLayout from './rootLayout.js';
import HomePage from './homepage.js';
import Feedback from './feedback.js';
import AboutUs from './aboutus.js';
import Contact from './contact.js';
import Account from './account.js';
import Cart from './cart.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<SignIn/>}/>
      <Route path="/sign_up" element={<SignUp/>}/>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/home/feedback' element={<Feedback/>}/>
      <Route path='/home/aboutUs' element={<AboutUs/>}/>
      <Route path='/home/contact' element={<Contact/>}/>
      <Route path='/home/account' element={<Account/>}/>
      <Route path='/home/cart' element={<Cart/>}/>
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;