import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

import { collection, getDocs, orderBy, query } from "firebase/firestore";

// PDF export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Admin() {
  const [rsvps, setRsvps] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoggedOut, setShowLoggedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [existingNames, setExistingNames] = useState([]);

  const navigate = useNavigate();

  const normalizeName = (name) =>
    (name || "").trim().toLowerCase().replace(/\s+/g, " ");

  // const getUniquePeopleCount = (rsvp) => {
  //   // main guest + additional guests
  //   return 1 + Number(rsvp.guestCount || 0);
  // };

  // const getUniquePeopleCount = (rsvp) => 1 + (rsvp.familyNames?.length || 0);

  const getAttendingCount = (rsvp) => {
    if (rsvp.willAttend !== "yes") return 0;

    return 1 + (rsvp.familyNames?.length || 0);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // AUTH GUARD
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // FETCH RSVPS
  useEffect(() => {
    const fetchRsvps = async () => {
      const q = query(collection(db, "rsvps"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      setRsvps(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    };

    fetchRsvps();
  }, []);

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Loading admin dashboard...
      </div>
    );
  }

  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth);

    setShowLogoutModal(false);
    setShowLoggedOut(true);

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // EMAIL MASK
  const maskEmail = (email) => {
    if (!email) return "";

    const [name, domain] = email.split("@");

    const visible = name.slice(0, 2);
    const masked = "*".repeat(Math.max(name.length - 2, 0));

    return `${visible}${masked}@${domain}`;
  };

  // FILTER LOGIC
  const filtered = rsvps.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "yes"
          ? r.willAttend === "yes"
          : filter === "no"
            ? r.willAttend === "no"
            : true;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedRsvps = filtered.slice(startIndex, startIndex + itemsPerPage);

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(22);
    doc.setTextColor(120, 40, 60);

    doc.text("Mark & Jane Wedding RSVP List", 14, 20);

    // SUBTITLE
    doc.setFontSize(11);
    doc.setTextColor(100);

    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    // TOTAL COUNTS
    const totalAttending = rsvps.reduce(
      (sum, r) => sum + getAttendingCount(r),
      0,
    );

    const totalDeclined = rsvps.filter((r) => r.willAttend === "no").length;

    const totalYesRsvps = rsvps.filter((r) => r.willAttend === "yes").length;

    doc.text(
      `Total RSVPs: ${rsvps.length} | Yes RSVPs: ${totalYesRsvps} | Attending People: ${totalAttending} | Declined: ${totalDeclined}`,
      14,
      36,
    );

    // TABLE
    autoTable(doc, {
      startY: 45,

      head: [
        ["RSVP Code", "Name", "Email", "Attendance", "Guests", "Companions"],
      ],

      body: rsvps.map((r) => [
        r.rsvpCode || "N/A",
        r.name,
        maskEmail(r.email),
        r.willAttend,
        getAttendingCount(r),
        r.familyNames?.length > 0 ? r.familyNames.join(", ") : "No companions",
      ]),

      styles: {
        fontSize: 9,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [120, 40, 60],
        textColor: 255,
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // SAVE
    doc.save("wedding-rsvps.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70 text-white px-4 md:px-8 py-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">RSVP Dashboard</h1>

          <p className="text-gray-200 mt-1">Manage wedding guest responses</p>
        </div>

        <div className="gap-10">
          <button
            onClick={exportPDF}
            className=" bg-purple-600 hover:bg-purple-700 hover:text-black transition px-4 py-2 rounded-xl"
          >
            Export PDF
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="ml-2 bg-rose-600 hover:bg-rose-700 hover:text-black transition px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search guest or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-sm p-3 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none"
        >
          <option value="all" className="text-black">
            All Guests
          </option>

          <option value="yes" className="text-black">
            Attending
          </option>

          <option value="no" className="text-black">
            Not Attending
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-white/10 text-left">
            <tr>
              <th className="p-4 font-semibold">RSVP Code</th>

              <th className="p-4 font-semibold">Name</th>

              <th className="p-4 font-semibold">Email</th>

              <th className="p-4 font-semibold">Attendance</th>

              <th className="p-4 font-semibold">Guests</th>

              <th className="p-4 font-semibold">Companions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRsvps.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 text-stone-300 font-semibold">
                  {r.rsvpCode || "N/A"}
                </td>

                <td className="p-4 text-md">{r.name}</td>

                <td className="p-4 text-gray-300">{maskEmail(r.email)}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.willAttend === "yes"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {r.willAttend}
                  </span>
                </td>

                <td className="p-4">{getAttendingCount(r)}</td>

                <td className="p-4">
                  {r.familyNames?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {r.familyNames.map((name, index) => (
                        <span
                          key={index}
                          className="bg-white/10 px-2 py-1 rounded-lg text-md"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-200 text-md">No companions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40 hover:bg-white/20 transition"
        >
          Previous
        </button>

        <p className="text-sm text-gray-300">
          Page {currentPage} of {totalPages || 1}
        </p>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40 hover:bg-white/20 transition"
        >
          Next
        </button>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-[#2b1d1d] border border-white/10 rounded-2xl p-6 text-white text-center animate-[fadeIn_0.2s_ease-out]">
            <p className="text-3xl text-gray-300">Logout?</p>
            <p className="text-gray-300 mb-10 p-4">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 hover:text-black transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 hover:text-black transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>

          <style>
            {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}
          </style>
        </div>
      )}
      {showLoggedOut && (
        <div className="fixed top-6 right-6 z-[999] animate-[slideIn_0.3s_ease-out]">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              ✓ Logged out successfully
            </h3>

            <p className="text-sm text-green-100 mt-1">
              Redirecting to homepage...
            </p>
          </div>

          <style>
            {`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}
          </style>
        </div>
      )}
    </div>
  );
}
