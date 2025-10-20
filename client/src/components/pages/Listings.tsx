import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

function Listings() {
  const user = useSelector((state: RootState) => state.auth.authData);
  return (
    <div>
      <h1>This is Listings page</h1>
      <b>Welcome {user?.name}</b>
    </div>
  );
}

export default Listings;
