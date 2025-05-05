import { useEffect, useRef, ReactNode } from "react";

interface DropdownProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Dropdown({ show, onClose, children }: DropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            console.log("Clicked outside");
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5"
            ref={dropdownRef}
        >
            <div className="py-1">{children}</div>
        </div>
    );
}