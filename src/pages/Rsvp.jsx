import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth } from "../firebase";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function Rsvp() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    willAttend: "",
    guestCount: 0,
  });

  const [familyNames, setFamilyNames] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const ADMIN_EMAIL = "alfredpioquid052702@gmail.com";
  const normalizeName = (name) =>
    (name || "").trim().toLowerCase().replace(/\s+/g, " ");
  // const [existingKeys, setExistingKeys] = useState([]);
  const [adminBlocked, setAdminBlocked] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const handleGuestCount = (count) => {
    let number = parseInt(count) || 0;

    // limit additional guests only
    if (number > 6) number = 6;
    if (number < 0) number = 0;

    setFormData((prev) => ({
      ...prev,
      guestCount: number,
    }));

    setFamilyNames((prev) => {
      const updated = [...prev];

      while (updated.length < number) {
        updated.push("");
      }

      return updated.slice(0, number);
    });
  };

  const handleNameChange = (index, value) => {
    const updated = [...familyNames];
    updated[index] = value;
    setFamilyNames(updated);
  };

  const buildGuestKey = (name) => {
    return (name || "")
      .toLowerCase()
      .trim()
      .split(" ")
      .filter(Boolean)
      .sort()
      .join("-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.willAttend) {
      setErrors({
        willAttend: "Please select an option.",
      });
      return;
    }

    const user = auth.currentUser;

    if (user?.email === ADMIN_EMAIL) {
      alert("Admin cannot submit RSVP");
      return;
    }

    const mainKey = buildGuestKey(formData.name);

    const companionKeys = familyNames.map(buildGuestKey).filter(Boolean);

    const allKeys = [mainKey, ...companionKeys];

    // INTERNAL DUPLICATES
    if (new Set(allKeys).size !== allKeys.length) {
      setError("Duplicate names detected in the form.");
      return;
    }

    try {
      setLoading(true);

      // CHECK IF ANY KEY ALREADY EXISTS
      for (const key of allKeys) {
        const guestRef = doc(db, "registeredGuests", key);

        const guestSnap = await getDoc(guestRef);

        if (guestSnap.exists()) {
          setError("This guest or companion already submitted an RSVP.");

          setLoading(false);
          return;
        }
      }

      // GENERATE RSVP CODE
      const rsvpCode = `RSVP-${Date.now().toString().slice(-6)}`;

      const emailParams = {
        guest_name: formData.name,

        guest_email: formData.email,

        rsvp_code: rsvpCode,

        attendance: formData.willAttend,

        guest_count: formData.willAttend === "yes" ? 1 + familyNames.length : 0,

        companions:
          familyNames.length > 0 ? familyNames.join(", ") : "No companions",
      };

      const templateId =
        formData.willAttend === "yes" ? "template_jnw01pf" : "template_nvb0gfu";

      try {
        await emailjs.send(
          "service_k0hj9pp",
          templateId,
          emailParams,
          "Qv-MwRcFhX2Qhhl8x",
        );
      } catch (err) {
        console.error("EmailJS failed:", err);
      }

      // SAVE RSVP
      await addDoc(collection(db, "rsvps"), {
        ...formData,
        rsvpCode,
        familyNames: formData.willAttend === "yes" ? familyNames : [],
        createdAt: serverTimestamp(),
      });

      // CREATE UNIQUE LOCKS
      for (const key of allKeys) {
        await setDoc(doc(db, "registeredGuests", key), {
          createdAt: serverTimestamp(),
        });
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchKeys = async () => {
  //     try {
  //       const snapshot = await getDocs(collection(db, "registeredGuests"));

  //       const keys = snapshot.docs.map((doc) => doc.id);

  //       setExistingKeys(keys);
  //     } catch (err) {
  //       console.error("Failed to fetch guest keys:", err);
  //     }
  //   };

  //   fetchKeys();
  // }, []);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // useEffect(() => {
  //   const fetchNames = async () => {
  //     try {
  //       const snapshot = await getDocs(collection(db, "rsvps"));

  //       const names = [];

  //       snapshot.docs.forEach((doc) => {
  //         const data = doc.data();

  //         // main name
  //         if (data.name) names.push(normalizeName(data.name));

  //         // family names
  //         if (Array.isArray(data.familyNames)) {
  //           data.familyNames.forEach((n) => names.push(normalizeName(n)));
  //         }
  //       });

  //       setExistingNames(names);
  //     } catch (err) {
  //       console.error("Failed to fetch existing names:", err);
  //     }
  //   };

  //   fetchNames();
  // }, []);

  return (
    <section className="py-50 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70">
      <div className="max-w-xl mx-auto">
        {adminBlocked && (
          <div className="mb-6 bg-red-500/20 border border-red-400 text-red-200 p-3 rounded-xl">
            Admin is not allowed to submit RSVP 🚫
          </div>
        )}
        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-[#2b1d1d] border border-red-400/40 text-center text-white px-8 py-6 rounded-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] max-w-sm w-full mx-4">
              <div className="text-3xl mb-2">⚠️</div>

              <p className="text-xl font-semibold text-red-300">Oops!</p>

              <p className="text-sm text-gray-300 mt-2">{error}</p>

              <button
                onClick={() => setError("")}
                className="mt-5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition text-white"
              >
                Close
              </button>
            </div>

            <style>
              {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
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
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white">
          RSVP
        </h2>

        <p className="text-gray-300 mb-8 text-sm sm:text-base px-2">
          We'd love to celebrate this special day with you.
        </p>

        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#2b1d1d] border border-green-400/40 text-center text-white px-8 py-6 rounded-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] max-w-sm w-full mx-4">
              <div className="text-3xl mb-2">💖</div>

              <p className="text-2xl font-semibold text-green-300">
                RSVP Submitted!
              </p>

              <p className="text-sm text-gray-300 mt-2">
                Thank you! Your response has been recorded.
              </p>

              <button
                onClick={() => setSuccess(false)}
                className="mt-5 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition text-white"
              >
                Close
              </button>
            </div>

            <style>
              {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-white"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            required
          />

          {/* Attendance */}
          <div className="text-left">
            <label className="block mb-3 text-sm text-gray-200">
              Will you attend the wedding?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    willAttend: "yes",
                  })
                }
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  formData.willAttend === "yes"
                    ? "bg-rose-500 border-rose-400 text-white"
                    : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                }`}
              >
                Yes, gladly! 💖
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    willAttend: "no",
                    guestCount: 0,
                  });

                  setFamilyNames([]);
                }}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  formData.willAttend === "no"
                    ? "bg-rose-500 border-rose-400 text-white"
                    : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                }`}
              >
                Sorry, I can't attend
              </button>
            </div>
            {errors.willAttend && (
              <p className="mt-2 text-sm text-stone-200">{errors.willAttend}</p>
            )}
          </div>

          {/* ONLY SHOW IF YES */}
          {formData.willAttend === "yes" && (
            <>
              {/* Guest Count */}
              <div className="text-left">
                <label className="block mb-3 text-sm text-gray-200">
                  How many additional guests will attend?
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleGuestCount(num)}
                      className={`p-3 rounded-xl border font-medium transition-all duration-200 ${
                        formData.guestCount === num
                          ? "bg-rose-500 border-rose-400 text-white"
                          : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleGuestCount(0)}
                  className={`mt-3 w-full p-3 rounded-xl border transition-all duration-200 ${
                    formData.guestCount === 0
                      ? "bg-rose-500 border-rose-400 text-white"
                      : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  No Additional Guests
                </button>
              </div>

              {/* Guest Names */}
              {formData.guestCount > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-left text-gray-200">
                    Please enter your guest names
                  </p>

                  {familyNames.map((name, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Guest ${index + 1} Full Name`}
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-all duration-300 text-white py-3 rounded-xl font-medium mt-2"
          >
            {loading ? "Submitting..." : "Submit RSVP"}
          </button>
        </form>
      </div>
    </section>
  );
}
