import { FaClipboardList, FaPrescriptionBottleAlt, FaCamera } from "react-icons/fa";

type Tab = "form" | "prescription" | "vision";

interface NavTabsProps {
  currentTab: Tab;
  setTab: (t: Tab) => void;
}

const tabs: { id:Tab; label:string; icon: JSX.Element }[] = [
  { id:"form", label:"Form Input", icon:<FaClipboardList/> },
  { id:"prescription", label:"Prescription Image", icon:<FaPrescriptionBottleAlt/> },
  { id:"vision", label:"Symptom Photo", icon:<FaCamera/> },
];

export const NavTabs = ({ currentTab, setTab }: NavTabsProps) => (
  <nav className="bg-white shadow">
    <ul className="flex">
      {tabs.map(t => (
        <li key={t.id} className="flex-1">
          <button
            onClick={() => setTab(t.id)}
            className={`w-full p-4 flex items-center justify-center space-x-2 ${
              currentTab === t.id
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        </li>
      ))}
    </ul>
  </nav>
);
