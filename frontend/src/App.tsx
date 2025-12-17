import MercahntLogin from './componets/auth/Merchantlongin.tsx';
import { Route,Routes ,Navigate} from 'react-router-dom';
import MerchantSignup from './componets/auth/Merchantsignup.tsx';
import Merchantdash from './componets/pages/merchant/Merchantdash.tsx';

function App() {
  

  return(<>
  <Routes>
      <Route path='/MerchDash' element={<Merchantdash/>}/>
     <Route path="/" element={<Navigate to="/m-login" replace />} />
    <Route path='/m-login' element={<MercahntLogin/>}/>
    <Route path='/m-signup' element={<MerchantSignup/>}/>
  </Routes>
  </>)
}

export default App
