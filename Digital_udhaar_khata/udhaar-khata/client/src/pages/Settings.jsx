import { useState, useEffect } from "react";

import Layout from "../components/Layout";

import toast from "react-hot-toast";

import {

  Bell,
  Shield,
  Building2,
  Upload,
  Settings2

} from "lucide-react";

function Settings() {

  // ================= STATES =================

  const [notifications, setNotifications] =
    useState(true);

  const [autoBackup, setAutoBackup] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [logo, setLogo] =
    useState("");

  const [businessData, setBusinessData] =
    useState({

      businessName: "",

      ownerName: "",

      email: "",

      phone: "",

      gst: "",

      currency: "INR"

    });

  // ================= LOAD SAVED DATA =================

  useEffect(() => {

    const savedData =
      localStorage.getItem(
        "businessData"
      );

    if (savedData) {

      setBusinessData(
        JSON.parse(savedData)
      );

    }

    const savedNotifications =
      localStorage.getItem(
        "notifications"
      );

    if (
      savedNotifications !== null
    ) {

      setNotifications(

        JSON.parse(
          savedNotifications
        )

      );

    }

    const savedBackup =
      localStorage.getItem(
        "autoBackup"
      );

    if (
      savedBackup !== null
    ) {

      setAutoBackup(

        JSON.parse(
          savedBackup
        )

      );

    }

    const savedDark =
      localStorage.getItem(
        "darkMode"
      );

    if (
      savedDark !== null
    ) {

      const dark =
        JSON.parse(savedDark);

      setDarkMode(dark);

      if (dark) {

        document.documentElement.classList.add(
          "dark"
        );

      }

      else {

        document.documentElement.classList.remove(
          "dark"
        );

      }

    }

    const savedLogo =
      localStorage.getItem(
        "businessLogo"
      );

    if (savedLogo) {

      setLogo(savedLogo);

    }

  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setBusinessData({

      ...businessData,

      [e.target.name]:
        e.target.value

    });

  };

  // ================= SAVE SETTINGS =================

  const saveSettings = () => {

    try {

      localStorage.setItem(

        "businessData",

        JSON.stringify({

          businessName:
            businessData.businessName,

          ownerName:
            businessData.ownerName,

          email:
            businessData.email,

          phone:
            businessData.phone,

          gst:
            businessData.gst,

          currency:
            businessData.currency

        })

      );

      localStorage.setItem(

        "notifications",

        JSON.stringify(
          notifications
        )

      );

      localStorage.setItem(

        "autoBackup",

        JSON.stringify(
          autoBackup
        )

      );

      localStorage.setItem(

        "darkMode",

        JSON.stringify(
          darkMode
        )

      );

      toast.success(
        "Settings Saved Successfully"
      );

      console.log(
        "Saved Successfully"
      );

    }

    catch (error) {

      console.log(error);

      toast.error(
        "Failed To Save Settings"
      );

    }

  };

  // ================= LOGO UPLOAD =================

  const handleLogoUpload = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setLogo(reader.result);

      localStorage.setItem(

        "businessLogo",

        reader.result

      );

      toast.success(
        "Logo Uploaded Successfully"
      );

    };

    reader.readAsDataURL(file);

  };

  // ================= EXPORT DATA =================

  const exportData = () => {

    const data = {

      businessData,

      notifications,

      autoBackup,

      darkMode

    };

    const blob =
      new Blob(

        [

          JSON.stringify(
            data,
            null,
            2
          )

        ],

        {

          type:
            "application/json"

        }

      );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "erp-settings.json";

    link.click();

    toast.success(
      "Data Exported"
    );

  };

  // ================= BACKUP =================

  const backupData = () => {

    localStorage.setItem(

      "backupData",

      JSON.stringify({

        businessData,

        notifications,

        autoBackup,

        darkMode

      })

    );

    toast.success(
      "Backup Created"
    );

  };

  // ================= CLEAR DATA =================

  const clearData = () => {

    const confirmDelete =
      window.confirm(

        "Clear all local data?"

      );

    if (confirmDelete) {

      localStorage.clear();

      toast.success(
        "Data Cleared"
      );

      window.location.reload();

    }

  };

  return (

    <Layout>

      <div className="min-h-screen bg-[#eef2ff]

      dark:bg-[#0b1220]

      p-4 lg:p-8 space-y-8">

        {/* HEADER */}

        <div className="rounded-[35px]

        bg-gradient-to-r

        from-violet-600

        via-indigo-600

        to-blue-600

        p-8 text-white shadow-2xl">

          <div className="flex justify-between items-center flex-wrap gap-6">

            <div className="flex items-center gap-5">

              <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center">

                <Settings2 size={35} />

              </div>

              <div>

                <h1 className="text-5xl font-black">

                  Settings

                </h1>

                <p className="text-white/80 mt-2">

                  Manage ERP preferences

                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <div className="bg-white/10 px-6 py-4 rounded-3xl">

                <p className="text-sm text-white/70">

                  Theme

                </p>

                <h2 className="text-4xl font-black">

                  {

                    darkMode

                      ? "Dark"

                      : "Light"

                  }

                </h2>

              </div>

              <div className="bg-white/10 px-6 py-4 rounded-3xl">

                <p className="text-sm text-white/70">

                  Notifications

                </p>

                <h2 className="text-4xl font-black">

                  {

                    notifications

                      ? "ON"

                      : "OFF"

                  }

                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* LEFT */}

          <div className="bg-white dark:bg-[#111827]

          rounded-[35px] p-8 border dark:border-gray-700">

            <div className="flex items-center gap-4 mb-8">

              <div className="w-14 h-14 rounded-2xl

              bg-violet-100 flex items-center justify-center">

                <Building2
                  className="text-violet-600"
                />

              </div>

              <div>

                <h2 className="text-3xl font-black dark:text-white">

                  Business Profile

                </h2>

              </div>

            </div>

            <div className="space-y-5">

              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={businessData.businessName}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:text-white"
              />

              <input
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                value={businessData.ownerName}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:text-white"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={businessData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:text-white"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={businessData.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:text-white"
              />

              <input
                type="text"
                name="gst"
                placeholder="GST Number"
                value={businessData.gst}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:text-white"
              />

              <select
                name="currency"
                value={businessData.currency}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:text-white"
              >

                <option value="INR">

                  INR (₹)

                </option>

                <option value="USD">

                  USD ($)

                </option>

              </select>

              {/* LOGO */}

              <label className="border-2 border-dashed

              border-violet-300 rounded-2xl

              p-6 flex flex-col items-center

              justify-center cursor-pointer">

                {

                  logo ? (

                    <img

                      src={logo}

                      alt="logo"

                      className="w-24 h-24 rounded-2xl object-cover mb-3"

                    />

                  ) : (

                    <Upload
                      size={40}
                      className="text-violet-600"
                    />

                  )

                }

                <span className="text-gray-500 mt-2">

                  Upload Business Logo

                </span>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />

              </label>

              <button

                type="button"

                onClick={saveSettings}

                className="w-full bg-gradient-to-r

                from-violet-600 to-indigo-600

                hover:from-violet-700

                hover:to-indigo-700

                text-white py-4 rounded-2xl

                font-bold transition-all"

              >

                Save Settings

              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            {/* APP PREF */}

            <div className="bg-white dark:bg-[#111827]

            rounded-[35px] p-8 border dark:border-gray-700">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-14 h-14 rounded-2xl

                bg-indigo-100 flex items-center justify-center">

                  <Bell className="text-indigo-600" />

                </div>

                <h2 className="text-3xl font-black dark:text-white">

                  App Preferences

                </h2>

              </div>

              <div className="space-y-8">

                {/* NOTIFICATION */}

                <div className="flex justify-between items-center">

                  <h3 className="font-bold dark:text-white">

                    Notifications

                  </h3>

                  <button

                    onClick={() => {

                      const updated =
                        !notifications;

                      setNotifications(updated);

                      localStorage.setItem(

                        "notifications",

                        JSON.stringify(updated)

                      );

                    }}

                    className={`w-16 h-8 rounded-full transition-all

                    ${

                      notifications

                        ? "bg-green-500"

                        : "bg-gray-300"

                    }`}

                  >

                    <div

                      className={`w-6 h-6 bg-white rounded-full mt-1 transition-all

                      ${

                        notifications

                          ? "translate-x-9"

                          : "translate-x-1"

                      }`}

                    />

                  </button>

                </div>

                {/* AUTO BACKUP */}

                <div className="flex justify-between items-center">

                  <h3 className="font-bold dark:text-white">

                    Auto Backup

                  </h3>

                  <button

                    onClick={() => {

                      const updated =
                        !autoBackup;

                      setAutoBackup(updated);

                      localStorage.setItem(

                        "autoBackup",

                        JSON.stringify(updated)

                      );

                    }}

                    className={`w-16 h-8 rounded-full transition-all

                    ${

                      autoBackup

                        ? "bg-green-500"

                        : "bg-gray-300"

                    }`}

                  >

                    <div

                      className={`w-6 h-6 bg-white rounded-full mt-1 transition-all

                      ${

                        autoBackup

                          ? "translate-x-9"

                          : "translate-x-1"

                      }`}

                    />

                  </button>

                </div>

                {/* DARK MODE */}

                <div className="flex justify-between items-center">

                  <h3 className="font-bold dark:text-white">

                    Dark Mode

                  </h3>

                  <button

                    onClick={() => {

                      const updated =
                        !darkMode;

                      setDarkMode(updated);

                      localStorage.setItem(

                        "darkMode",

                        JSON.stringify(updated)

                      );

                      if (updated) {

                        document.documentElement.classList.add(
                          "dark"
                        );

                      }

                      else {

                        document.documentElement.classList.remove(
                          "dark"
                        );

                      }

                    }}

                    className={`w-16 h-8 rounded-full transition-all

                    ${

                      darkMode

                        ? "bg-indigo-600"

                        : "bg-gray-300"

                    }`}

                  >

                    <div

                      className={`w-6 h-6 bg-white rounded-full mt-1 transition-all

                      ${

                        darkMode

                          ? "translate-x-9"

                          : "translate-x-1"

                      }`}

                    />

                  </button>

                </div>

              </div>

            </div>

            {/* SECURITY */}

            <div className="bg-white dark:bg-[#111827]

            rounded-[35px] p-8 border dark:border-gray-700">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-14 h-14 rounded-2xl

                bg-red-100 flex items-center justify-center">

                  <Shield className="text-red-600" />

                </div>

                <h2 className="text-3xl font-black dark:text-white">

                  Security & Data

                </h2>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <button

                  onClick={exportData}

                  className="bg-green-600 text-white py-4 rounded-2xl font-semibold"

                >

                  Export Data

                </button>

                <button

                  onClick={backupData}

                  className="bg-indigo-600 text-white py-4 rounded-2xl font-semibold"

                >

                  Backup Data

                </button>

                <button

                  onClick={clearData}

                  className="bg-red-500 text-white py-4 rounded-2xl font-semibold"

                >

                  Clear Data

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Settings;