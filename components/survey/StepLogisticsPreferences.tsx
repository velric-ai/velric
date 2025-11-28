import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Globe, MapPin, Plane, Monitor, Check, AlertCircle } from "lucide-react";
import {
  REGIONS,
  SPONSORSHIP_OPTIONS,
  RELOCATION_OPTIONS,
  REMOTE_WORK_OPTIONS,
} from "@/data/surveyConstants";

interface StepLogisticsPreferencesProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

export function StepLogisticsPreferences({
  formData,
  updateFormData,
  onNext,
  onPrev,
  canProceed,
  isSubmitting,
}: StepLogisticsPreferencesProps) {
  const [currentRegion, setCurrentRegion] = useState<string>(
    formData.logisticsPreferences?.currentRegion?.value || ""
  );
  const [legalWorkRegions, setLegalWorkRegions] = useState<string[]>(
    formData.logisticsPreferences?.legalWorkRegions?.value || []
  );
  const [sponsorshipConsideration, setSponsorshipConsideration] = useState<string>(
    formData.logisticsPreferences?.sponsorshipConsideration?.value || ""
  );
  const [sponsorshipRegions, setSponsorshipRegions] = useState<string[]>(
    formData.logisticsPreferences?.sponsorshipRegions?.value || []
  );
  const [sponsorshipDependsText, setSponsorshipDependsText] = useState<string>(
    formData.logisticsPreferences?.sponsorshipDependsText?.value || ""
  );
  const [relocationOpenness, setRelocationOpenness] = useState<string>(
    formData.logisticsPreferences?.relocationOpenness?.value || ""
  );
  const [relocationRegions, setRelocationRegions] = useState<string>(
    formData.logisticsPreferences?.relocationRegions?.value || ""
  );
  const [remoteWorkInternational, setRemoteWorkInternational] = useState<string>(
    formData.logisticsPreferences?.remoteWorkInternational?.value || ""
  );

  // Update form data when any field changes
  useEffect(() => {
    const error = !currentRegion ? "Please select your current region" : null;

    updateFormData({
      logisticsPreferences: {
        currentRegion: {
          value: currentRegion,
          error: null,
          touched: true,
        },
        legalWorkRegions: {
          value: legalWorkRegions,
          error: null,
          touched: true,
        },
        sponsorshipConsideration: {
          value: sponsorshipConsideration,
          error: null,
          touched: true,
        },
        sponsorshipRegions: {
          value: sponsorshipRegions,
          error: null,
          touched: true,
        },
        sponsorshipDependsText: {
          value: sponsorshipDependsText,
          error: null,
          touched: true,
        },
        relocationOpenness: {
          value: relocationOpenness,
          error: null,
          touched: true,
        },
        relocationRegions: {
          value: relocationRegions,
          error: null,
          touched: true,
        },
        remoteWorkInternational: {
          value: remoteWorkInternational,
          error: null,
          touched: true,
        },
        error,
        touched: true,
      },
    });
  }, [
    currentRegion,
    legalWorkRegions,
    sponsorshipConsideration,
    sponsorshipRegions,
    sponsorshipDependsText,
    relocationOpenness,
    relocationRegions,
    remoteWorkInternational,
    updateFormData,
  ]);

  const handleRegionToggle = (region: string) => {
    setLegalWorkRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleSponsorshipRegionToggle = (region: string) => {
    setSponsorshipRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Logistics & Interview Preferences
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center space-x-2 text-yellow-400 mb-2"
        >
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            This does NOT affect your Velric Score
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/70"
        >
          Help us understand your work preferences and availability
        </motion.p>
      </div>

      <div
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="space-y-8">
          {/* Current Region */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-400" />
              Current region
            </label>
            <select
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            >
              <option value="">Select your current region</option>
              {REGIONS.map((region) => (
                <option key={region} value={region} className="bg-[#1C1C1E]">
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Legal Work Regions */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-400" />
              Where can you legally work without sponsorship?
            </label>
            <p className="text-sm text-white/60 mb-3">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => {
                const isSelected = legalWorkRegions.includes(region);
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => handleRegionToggle(region)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-green-500/20 border-2 border-green-400 text-green-300"
                        : "bg-white/5 border border-white/20 text-white/70 hover:border-white/40"
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sponsorship Consideration */}
          <div>
            <label className="block text-white font-semibold mb-3">
              If sponsorship is required, would you still consider roles in other regions?
            </label>
            <div className="space-y-2">
              {SPONSORSHIP_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="sponsorshipConsideration"
                    value={option.value}
                    checked={sponsorshipConsideration === option.value}
                    onChange={(e) => setSponsorshipConsideration(e.target.value)}
                    className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-white">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Sponsorship Regions (if Yes) */}
            {sponsorshipConsideration === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <label className="block text-white/80 text-sm mb-2">
                  Specify regions:
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.filter((r) => r !== "Remote only").map((region) => {
                    const isSelected = sponsorshipRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleSponsorshipRegionToggle(region)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                            : "bg-white/5 border border-white/20 text-white/70 hover:border-white/40"
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Depends Text */}
            {sponsorshipConsideration === "depends" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <label className="block text-white/80 text-sm mb-2">
                  Please specify:
                </label>
                <textarea
                  value={sponsorshipDependsText}
                  onChange={(e) => setSponsorshipDependsText(e.target.value)}
                  placeholder="Explain your circumstances..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  rows={3}
                />
              </motion.div>
            )}
          </div>

          {/* Relocation Openness */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-purple-400" />
              Are you open to relocating?
            </label>
            <div className="space-y-2">
              {RELOCATION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="relocationOpenness"
                    value={option.value}
                    checked={relocationOpenness === option.value}
                    onChange={(e) => setRelocationOpenness(e.target.value)}
                    className="w-4 h-4 text-purple-400 focus:ring-purple-400"
                  />
                  <span className="text-white">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Relocation Regions (if Only some regions) */}
            {relocationOpenness === "only_some" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <label className="block text-white/80 text-sm mb-2">
                  Specify regions:
                </label>
                <input
                  type="text"
                  value={relocationRegions}
                  onChange={(e) => setRelocationRegions(e.target.value)}
                  placeholder="e.g., North America, Europe"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </motion.div>
            )}
          </div>

          {/* Remote Work International */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-blue-400" />
              Are you open to remote work internationally?
            </label>
            <div className="space-y-2">
              {REMOTE_WORK_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="remoteWorkInternational"
                    value={option.value}
                    checked={remoteWorkInternational === option.value}
                    onChange={(e) => setRemoteWorkInternational(e.target.value)}
                    className="w-4 h-4 text-blue-400 focus:ring-blue-400"
                  />
                  <span className="text-white">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {formData.logisticsPreferences?.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-red-400 text-sm">{formData.logisticsPreferences.error}</p>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center pt-8 mt-8 border-t border-white/10"
        >
          <button
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              canProceed && !isSubmitting
                ? "bg-gradient-to-r from-purple-500 to-cyan-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

