import {
    Link,
    Outlet,
    useLocation,
    Form,
} from "@remix-run/react";
import {useState} from "react";
import Dropdown from "./dropdown";
import {User} from "~/types/user";

const activeRouteClassName =
    "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium";
const inactiveRouteClassName =
    "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium hidden md:block";

export default function UserLayout({user, headerTitle, children}: {
    user: User,
    headerTitle?: string,
    children?: React.ReactNode
}) {
    const {pathname} = useLocation();
    const [showSetting, setShowSetting] = useState(false);

    const toggleSettingDropdown = () => {
        setShowSetting(!showSetting);
    };

    return (
        <div className="min-h-full">
            <nav className="bg-gray-800">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex flex-shrink-0">
                                <img
                                    className="h-8 w-8"
                                    src="https://www.free-materials.com/adm/wp-content/uploads/2020/10/logo_07.png"
                                    alt="Your Company"
                                />
                                <span className="text-white text-2xl font-bold ml-2">機材管理システム</span>
                            </div>
                            <div>
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        to="/reservations"
                                        className={
                                            pathname === "/reservations"
                                                ? activeRouteClassName
                                                : inactiveRouteClassName
                                        }
                                    >
                                        現場スケジュール
                                    </Link>
                                    <Link
                                        to="/equipments"
                                        className={
                                            pathname === "/equipments"
                                                ? activeRouteClassName
                                                : inactiveRouteClassName
                                        }
                                    >
                                        機材管理
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div /**className="hidden md:block"**/>
                            <div className="ml-4 flex items-center md:ml-6">
                                <div className="relative ml-3">
                                    <button
                                        type="button"
                                        className="relative flex max-w-xs items-center bg-gray-800 text-gray-400 text-sm hover:text-white"
                                        id="user-menu-button"
                                        onClick={toggleSettingDropdown}
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                    >
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open user menu</span>
                                        <svg
                                            className="hidden h-6 w-6 md:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 1.5c-3.038 0-9 1.518-9 4.5V21h18v-3c0-2.982-5.962-4.5-9-4.5z"
                                            />
                                        </svg>
                                        <svg
                                            className="block h-6 w-6 md:hidden"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                            />
                                        </svg>
                                    </button>
                                    <Dropdown
                                        show={showSetting}
                                        onClose={() => setShowSetting(false)}
                                    >
                                        <div className={`md:hidden`}>
                                            <ul className={`list-none`}>
                                                <li className={`px-4 py-2 dark:text-white`}><Link to="/reservations">
                                                    現場スケジュール
                                                </Link></li>
                                                <li className={`px-4 py-2 dark:text-white`}><Link to="/equipments">
                                                    機材管理
                                                </Link></li>
                                            </ul>
                                            <hr className="dark:text-white" />
                                        </div>
                                        <div className="px-4 py-2 dark:text-white text-ellipsis overflow-hidden whitespace-nowrap">
                                            {user.email}
                                        </div>
                                        <Form method="post" action={`/logout`}>
                                            <button
                                                type="submit"
                                                className="flex w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100"
                                                tabIndex={-1}
                                            >
                                                ログアウト
                                            </button>
                                        </Form>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {headerTitle ? (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {headerTitle}
                        </h1>
                    </div>
                </header>
            ) : null}
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}