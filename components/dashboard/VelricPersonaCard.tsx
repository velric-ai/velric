interface VelricPersonaCardProps {
  userData: any;
}

export default function VelricPersonaCard({ userData }: VelricPersonaCardProps) {
  // Mock persona data
  const personaData = {
    type: "Analytical Builder",
    strengths: [
      "Strong problem-solving approach",
      "Detail-oriented implementation",
      "Systematic thinking"
    ],
    emergingAreas: [
      "Leadership skills",
      "Communication"
    ],
    workStyle: ["Precise", "Builder", "Analytical"],
    projection: "Reach Tier 3 by December"
  };

  return (
    <div className="glass-card persona-card floating-card h-full">
      <div className="p-5">
        <h3 className="text-lg font-semibold glass-text-primary mb-4">Velric Persona</h3>
        
        <div className="space-y-4">
          {/* Persona Type */}
          <div>
            <h4 className="persona-type-text mb-2">
              {personaData.type}
            </h4>
          </div>

          {/* Strengths */}
          <div>
            <h5 className="text-sm font-medium glass-text-primary mb-2">Strengths</h5>
            <ul className="space-y-1">
              {personaData.strengths.map((strength, index) => (
                <li key={index} className="text-sm glass-text-secondary flex items-start">
                  <span className="glass-text-accent-positive mr-2">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Emerging Areas */}
          <div>
            <h5 className="text-sm font-medium glass-text-primary mb-2">Emerging Areas</h5>
            <ul className="space-y-1">
              {personaData.emergingAreas.map((area, index) => (
                <li key={index} className="text-sm glass-text-secondary flex items-start">
                  <span className="glass-text-accent-negative mr-2">•</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Work Style */}
          <div>
            <h5 className="text-sm font-medium glass-text-primary mb-2">Work Style</h5>
            <div className="flex flex-wrap gap-2">
              {personaData.workStyle.map((style, index) => (
                <span
                  key={index}
                  className="work-style-tag"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Projection */}
          <div className="projection-box">
            <h5 className="text-sm font-medium glass-text-primary mb-1">Projection</h5>
            <p className="text-sm glass-text-secondary">{personaData.projection}</p>
          </div>
        </div>
      </div>
    </div>
  );
}