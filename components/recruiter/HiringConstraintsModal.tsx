import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Globe, Calendar, Briefcase } from "lucide-react";

interface HiringConstraints {
  location?: string[];
  visaSponsorshipAllowed: boolean;
  relocationRequired: boolean;
  preferredTimezone?: string;
}

interface HiringConstraintsModalProps {
  isOpen: boolean;
  onSave: (constraints: HiringConstraints) => void;
  onSkip: () => void;
}

const COMMON_LOCATIONS = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
  "Middle East",
];

const COMMON_TIMEZONES = [
  "UTC",
  "EST (UTC-5)",
  "PST (UTC-8)",
  "CST (UTC-6)",
  "GMT (UTC+0)",
  "CET (UTC+1)",
  "IST (UTC+5:30)",
  "JST (UTC+9)",
  "AEST (UTC+10)",
];

export default function HiringConstraintsModal({
  isOpen,
  onSave,
  onSkip,
}: HiringConstraintsModalProps) {
  const [constraints, setConstraints] = useState<HiringConstraints>({
    visaSponsorshipAllowed: false,
    relocationRequired: false,
  });
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Load saved constraints from sessionStorage on mount
  useEffect(() => {
    if (isOpen) {
      const saved = sessionStorage.getItem("recruiter_hiring_constraints");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConstraints(parsed);
          setSelectedLocations(parsed.location || []);
        } catch (e) {
          console.warn("Failed to parse saved constraints:", e);
        }
      }
    }
  }, [isOpen]);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handleSave = () => {
    const finalConstraints: HiringConstraints = {
      ...constraints,
      location: selectedLocations.length > 0 ? selectedLocations : undefined,
    };
    sessionStorage.setItem(
      "recruiter_hiring_constraints",
      JSON.stringify(finalConstraints)
    );
    onSave(finalConstraints);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onSkip}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
              style={{
                background: "rgba(15, 23, 42, 1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-500 to-cyan-500">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Hiring Constraints
                  </h2>
                </div>
                <button
                  onClick={onSkip}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <p className="text-white/70 text-sm">
                  Set your hiring preferences to see compatibility badges on
                  candidate profiles. You can skip this and set it later.
                </p>

                {/* Location Preferences */}
                <div>
                  <label className="text-sm font-semibold text-white mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                    Preferred Locations (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_LOCATIONS.map((location) => (
                      <button
                        key={location}
                        onClick={() => toggleLocation(location)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          selectedLocations.includes(location)
                            ? "bg-cyan-500/20 border-cyan-400 text-white"
                            : "border-white/10 text-white/60 hover:border-white/30"
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visa Sponsorship */}
                <div>
                  <label className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                    Visa Sponsorship
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visaSponsorship"
                        checked={constraints.visaSponsorshipAllowed === true}
                        onChange={() =>
                          setConstraints({
                            ...constraints,
                            visaSponsorshipAllowed: true,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
                      />
                      <span className="text-white/80">Allowed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visaSponsorship"
                        checked={constraints.visaSponsorshipAllowed === false}
                        onChange={() =>
                          setConstraints({
                            ...constraints,
                            visaSponsorshipAllowed: false,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
                      />
                      <span className="text-white/80">Not Allowed</span>
                    </label>
                  </div>
                </div>

                {/* Relocation */}
                <div>
                  <label className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-cyan-400" />
                    Relocation Required
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="relocation"
                        checked={constraints.relocationRequired === true}
                        onChange={() =>
                          setConstraints({
                            ...constraints,
                            relocationRequired: true,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
                      />
                      <span className="text-white/80">Required</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="relocation"
                        checked={constraints.relocationRequired === false}
                        onChange={() =>
                          setConstraints({
                            ...constraints,
                            relocationRequired: false,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
                      />
                      <span className="text-white/80">Not Required</span>
                    </label>
                  </div>
                </div>

                {/* Preferred Timezone */}
                <div>
                  <label className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                    Preferred Timezone (Optional)
                  </label>
                  <select
                    value={constraints.preferredTimezone || ""}
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        preferredTimezone:
                          e.target.value || undefined,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">Any timezone</option>
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz} value={tz} className="bg-[#0f172a]">
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={onSkip}
                    className="px-6 py-2 rounded-lg font-medium text-white/60 hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg font-medium text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                    }}
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

