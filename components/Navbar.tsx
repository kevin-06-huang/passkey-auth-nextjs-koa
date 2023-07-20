"use client";
import Link from "next/link";
import useStore from "@/store/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const store = useStore();
  const user = store.authUser;
  const router = useRouter();

  const handleLogout = () => {
    store.setAuthUser(null);
    router.push("/login");
  };

  return (
    <div className="navbar bg-base-100 justify-end">
      {!user ? (
        <div className="flex-none font-comic">
          <ul className="menu menu-horizontal flex justify-end">
            <li>
              <Link href="/" className="m-2">
                Home
              </Link>
            </li>
            <li>
              <Link href="/register" className="m-2">
                Register
              </Link>
            </li>
            <li>
              <Link href="/login" className="m-2">
                Login
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex-none">
          <ul className="menu menu-horizontal flex justify-end">
            <li onClick={handleLogout}>
              <button>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
