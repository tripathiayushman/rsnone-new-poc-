import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { DeviceFrame } from './layout/DeviceFrame';
import { useStore } from './store/useStore';

import C01Splash from './screens/C01Splash/C01Splash';
import C02Welcome from './screens/C02Welcome/C02Welcome';
import C03Home from './screens/C03Home/C03Home';
import C04Shop from './screens/C04Shop/C04Shop';
import C05Search from './screens/C05Search/C05Search';
import C06SearchResults from './screens/C06SearchResults/C06SearchResults';
import C07ProductDetail from './screens/C07ProductDetail/C07ProductDetail';
import C08HouseProfile from './screens/C08HouseProfile/C08HouseProfile';
import C09Wishlist from './screens/C09Wishlist/C09Wishlist';
import C10Bag from './screens/C10Bag/C10Bag';
import C11CheckoutDetails from './screens/C11CheckoutDetails/C11CheckoutDetails';
import C12CheckoutPayments from './screens/C12CheckoutPayments/C12CheckoutPayments';
import C13OrderConfirmation from './screens/C13OrderConfirmation/C13OrderConfirmation';
import C14Membership from './screens/C14Membership/C14Membership';
import C15LimitedDrops from './screens/C15LimitedDrops/C15LimitedDrops';
import C16RSNConcierge from './screens/C16RSNConcierge/C16RSNConcierge';
import C17Me from './screens/C17Me/C17Me';
import C18OrderTracking from './screens/C18OrderTracking/C18OrderTracking';
import C19StoreSelection from './screens/C19StoreSelection/C19StoreSelection';
import C20LoginSignup from './screens/C20LoginSignup/C20LoginSignup';
import C21MembershipJoin from './screens/C21MembershipJoin/C21MembershipJoin';
import C22MembershipPayment from './screens/C22MembershipPayment/C22MembershipPayment';
import C23MembershipConfirmation from './screens/C23MembershipConfirmation/C23MembershipConfirmation';
import C24DropDetail from './screens/C24DropDetail/C24DropDetail';
import C25Orders from './screens/C25Orders/C25Orders';
import C26OrderDetail from './screens/C26OrderDetail/C26OrderDetail';
import C27AddressManagement from './screens/C27AddressManagement/C27AddressManagement';
import C28PaymentMethods from './screens/C28PaymentMethods/C28PaymentMethods';
import C29Notifications from './screens/C29Notifications/C29Notifications';
import C30HelpSupport from './screens/C30HelpSupport/C30HelpSupport';
import C31AddEditAddress from './screens/C31AddEditAddress/C31AddEditAddress';
import C32ReturnRequest from './screens/C32ReturnRequest/C32ReturnRequest';
import C33MemberWallet from './screens/C33MemberWallet/C33MemberWallet';
import C34MemberReferrals from './screens/C34MemberReferrals/C34MemberReferrals';

/** Shopping surfaces need a chosen store (C19). */
function RequireStore({ children }: { children: ReactNode }) {
  const store = useStore(s => s.store);
  const loc = useLocation();
  if (!store) return <Navigate to="/store" replace state={{ returnTo: loc.pathname + loc.search }} />;
  return <>{children}</>;
}

/** Account, checkout and member surfaces need a signed-in user (guests are sent to C20). */
function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthed = useStore(s => s.isAuthed);
  const loc = useLocation();
  if (!isAuthed) return <Navigate to="/login" replace state={{ returnTo: loc.pathname + loc.search }} />;
  return <RequireStore>{children}</RequireStore>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<DeviceFrame />}>
        {/* Entry */}
        <Route path="/" element={<C01Splash />} />
        <Route path="/welcome" element={<C02Welcome />} />
        <Route path="/login" element={<C20LoginSignup />} />
        <Route path="/store" element={<C19StoreSelection />} />

        {/* Core + shopping (guest OK) */}
        <Route path="/home" element={<RequireStore><C03Home /></RequireStore>} />
        <Route path="/shop" element={<RequireStore><C04Shop /></RequireStore>} />
        <Route path="/search" element={<RequireStore><C05Search /></RequireStore>} />
        <Route path="/search/results" element={<RequireStore><C06SearchResults /></RequireStore>} />
        <Route path="/product/:id" element={<RequireStore><C07ProductDetail /></RequireStore>} />
        <Route path="/house/:id" element={<RequireStore><C08HouseProfile /></RequireStore>} />
        <Route path="/wishlist" element={<RequireStore><C09Wishlist /></RequireStore>} />
        <Route path="/bag" element={<RequireStore><C10Bag /></RequireStore>} />
        <Route path="/drops" element={<RequireStore><C15LimitedDrops /></RequireStore>} />
        <Route path="/drops/:id" element={<RequireStore><C24DropDetail /></RequireStore>} />
        <Route path="/concierge" element={<RequireStore><C16RSNConcierge /></RequireStore>} />
        <Route path="/membership" element={<RequireStore><C14Membership /></RequireStore>} />
        <Route path="/help" element={<RequireStore><C30HelpSupport /></RequireStore>} />

        {/* Signed-in only */}
        <Route path="/checkout/details" element={<RequireAuth><C11CheckoutDetails /></RequireAuth>} />
        <Route path="/checkout/payment" element={<RequireAuth><C12CheckoutPayments /></RequireAuth>} />
        <Route path="/order/confirmation/:id" element={<RequireAuth><C13OrderConfirmation /></RequireAuth>} />
        <Route path="/membership/join" element={<RequireAuth><C21MembershipJoin /></RequireAuth>} />
        <Route path="/membership/payment" element={<RequireAuth><C22MembershipPayment /></RequireAuth>} />
        <Route path="/membership/welcome" element={<RequireAuth><C23MembershipConfirmation /></RequireAuth>} />
        <Route path="/member/wallet" element={<RequireAuth><C33MemberWallet /></RequireAuth>} />
        <Route path="/member/referrals" element={<RequireAuth><C34MemberReferrals /></RequireAuth>} />
        <Route path="/me" element={<RequireAuth><C17Me /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><C25Orders /></RequireAuth>} />
        <Route path="/orders/:id" element={<RequireAuth><C26OrderDetail /></RequireAuth>} />
        <Route path="/orders/:id/track" element={<RequireAuth><C18OrderTracking /></RequireAuth>} />
        <Route path="/orders/:id/return" element={<RequireAuth><C32ReturnRequest /></RequireAuth>} />
        <Route path="/addresses" element={<RequireAuth><C27AddressManagement /></RequireAuth>} />
        <Route path="/addresses/new" element={<RequireAuth><C31AddEditAddress /></RequireAuth>} />
        <Route path="/addresses/:id" element={<RequireAuth><C31AddEditAddress /></RequireAuth>} />
        <Route path="/payments" element={<RequireAuth><C28PaymentMethods /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><C29Notifications /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
