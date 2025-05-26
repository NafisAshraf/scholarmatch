import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type CVData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  education: {
    school: string;
    degree: string;
    location: string;
    year: string;
    details: string[];
  }[];
  experience: {
    company: string;
    role: string;
    location: string;
    duration: string;
    description: string[];
  }[];
  skills: string[];
  interests: string[];
  recognitions: string[];
  certifications: { title: string; institution: string; year: string }[];
  volunteering: {
    organization: string;
    role: string;
    location: string;
    duration: string;
    description: string[];
  }[];
  achievements: string[];
  references: { name: string; position: string; contact: string }[];
};

type Props = {
  value: CVData;
  onChange: (cv: CVData) => void;
};

function handleArrayChange<T>(arr: T[], i: number, field: keyof T, value: any) {
  return arr.map((item, idx) =>
    idx === i ? { ...item, [field]: value } : item
  );
}

// Helper to update string arrays (e.g. skills, interests, recognitions, achievements)
function updateStringArray(arr: string[], i: number, value: string) {
  return arr.map((item, idx) => (idx === i ? value : item));
}

// Helper to update array of string for points
function updateStringListArray(arr: string[][], i: number, value: string[]) {
  return arr.map((item, idx) => (idx === i ? value : item));
}

const CVForm: React.FC<Props> = ({ value, onChange }) => {
  // Field change helpers
  const updateField = (field: keyof CVData, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  // Dynamic section add/remove helpers
  const addEducation = () =>
    updateField("education", [
      ...value.education,
      { school: "", degree: "", location: "", year: "", details: [""] },
    ]);
  const removeEducation = (i: number) =>
    updateField(
      "education",
      value.education.filter((_, idx) => idx !== i)
    );
  const addExperience = () =>
    updateField("experience", [
      ...value.experience,
      { company: "", role: "", location: "", duration: "", description: [""] },
    ]);
  const removeExperience = (i: number) =>
    updateField(
      "experience",
      value.experience.filter((_, idx) => idx !== i)
    );
  const addSkill = () => updateField("skills", [...value.skills, ""]);
  const removeSkill = (i: number) =>
    updateField(
      "skills",
      value.skills.filter((_, idx) => idx !== i)
    );
  const addInterest = () => updateField("interests", [...value.interests, ""]);
  const removeInterest = (i: number) =>
    updateField(
      "interests",
      value.interests.filter((_, idx) => idx !== i)
    );
  const addRecognition = () =>
    updateField("recognitions", [...value.recognitions, ""]);
  const removeRecognition = (i: number) =>
    updateField(
      "recognitions",
      value.recognitions.filter((_, idx) => idx !== i)
    );
  const addCertification = () =>
    updateField("certifications", [
      ...value.certifications,
      { title: "", institution: "", year: "" },
    ]);
  const removeCertification = (i: number) =>
    updateField(
      "certifications",
      value.certifications.filter((_, idx) => idx !== i)
    );
  const addVolunteering = () =>
    updateField("volunteering", [
      ...value.volunteering,
      {
        organization: "",
        role: "",
        location: "",
        duration: "",
        description: [""],
      },
    ]);
  const removeVolunteering = (i: number) =>
    updateField(
      "volunteering",
      value.volunteering.filter((_, idx) => idx !== i)
    );
  const addAchievement = () =>
    updateField("achievements", [...value.achievements, ""]);
  const removeAchievement = (i: number) =>
    updateField(
      "achievements",
      value.achievements.filter((_, idx) => idx !== i)
    );
  const addReference = () =>
    updateField("references", [
      ...value.references,
      { name: "", position: "", contact: "" },
    ]);
  const removeReference = (i: number) =>
    updateField(
      "references",
      value.references.filter((_, idx) => idx !== i)
    );

  // Helper for editing multi-line bullet lists
  const handleDescriptionChange = (
    items: any[],
    i: number,
    field: string,
    idx: number,
    value: string
  ) => {
    const updated = items.map((item, j) => {
      if (j !== i) return item;
      return {
        ...item,
        [field]: item[field].map((p: string, k: number) =>
          k === idx ? value : p
        ),
      };
    });
    return updated;
  };
  const addDescriptionLine = (items: any[], i: number, field: string) => {
    const updated = items.map((item, j) => {
      if (j !== i) return item;
      return { ...item, [field]: [...item[field], ""] };
    });
    return updated;
  };
  const removeDescriptionLine = (
    items: any[],
    i: number,
    field: string,
    idx: number
  ) => {
    const updated = items.map((item, j) => {
      if (j !== i) return item;
      return {
        ...item,
        [field]: item[field].filter((_: string, k: number) => k !== idx),
      };
    });
    return updated;
  };

  return (
    <div className="space-y-2 overflow-y-auto max-h-[80vh] pb-3 px-5">
      <div>
        <Label>Name</Label>
        <Input
          value={value.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={value.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label>Email</Label>
          <Input
            value={value.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
        <div className="w-1/2">
          <Label>Phone</Label>
          <Input
            value={value.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Summary</Label>
        <Textarea
          rows={2}
          value={value.summary}
          onChange={(e) => updateField("summary", e.target.value)}
        />
      </div>
      <div>
        <Label>Education</Label>
        {value.education.map((ed, i) => (
          <div key={i} className="mb-2 border-l-2 pl-3">
            <div className="flex gap-2">
              <Input
                placeholder="School"
                value={ed.school}
                onChange={(e) =>
                  updateField(
                    "education",
                    handleArrayChange(
                      value.education,
                      i,
                      "school",
                      e.target.value
                    )
                  )
                }
                className="w-2/6"
              />
              <Input
                placeholder="Degree"
                value={ed.degree}
                onChange={(e) =>
                  updateField(
                    "education",
                    handleArrayChange(
                      value.education,
                      i,
                      "degree",
                      e.target.value
                    )
                  )
                }
                className="w-2/6"
              />
              <Input
                placeholder="Location"
                value={ed.location}
                onChange={(e) =>
                  updateField(
                    "education",
                    handleArrayChange(
                      value.education,
                      i,
                      "location",
                      e.target.value
                    )
                  )
                }
                className="w-1/6"
              />
              <Input
                placeholder="Year/Dates"
                value={ed.year}
                onChange={(e) =>
                  updateField(
                    "education",
                    handleArrayChange(
                      value.education,
                      i,
                      "year",
                      e.target.value
                    )
                  )
                }
                className="w-1/6"
              />
              {value.education.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeEducation(i)}
                >
                  ✕
                </Button>
              )}
            </div>
            <Label>Details/Bullets</Label>
            {ed.details.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <Input
                  value={pt}
                  onChange={(e) =>
                    updateField(
                      "education",
                      handleDescriptionChange(
                        value.education,
                        i,
                        "details",
                        idx,
                        e.target.value
                      )
                    )
                  }
                  placeholder="Accomplishment or detail"
                  className="w-full"
                />
                {ed.details.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      updateField(
                        "education",
                        removeDescriptionLine(
                          value.education,
                          i,
                          "details",
                          idx
                        )
                      )
                    }
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateField(
                  "education",
                  addDescriptionLine(value.education, i, "details")
                )
              }
            >
              Add Detail
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addEducation}
        >
          Add Education
        </Button>
      </div>
      <div>
        <Label>Experience</Label>
        {value.experience.map((ex, i) => (
          <div key={i} className="mb-2 border-l-2 pl-3">
            <div className="flex gap-2">
              <Input
                placeholder="Company"
                value={ex.company}
                onChange={(e) =>
                  updateField(
                    "experience",
                    handleArrayChange(
                      value.experience,
                      i,
                      "company",
                      e.target.value
                    )
                  )
                }
                className="w-2/6"
              />
              <Input
                placeholder="Role"
                value={ex.role}
                onChange={(e) =>
                  updateField(
                    "experience",
                    handleArrayChange(
                      value.experience,
                      i,
                      "role",
                      e.target.value
                    )
                  )
                }
                className="w-2/6"
              />
              <Input
                placeholder="Location"
                value={ex.location}
                onChange={(e) =>
                  updateField(
                    "experience",
                    handleArrayChange(
                      value.experience,
                      i,
                      "location",
                      e.target.value
                    )
                  )
                }
                className="w-1/6"
              />
              <Input
                placeholder="Duration/Dates"
                value={ex.duration}
                onChange={(e) =>
                  updateField(
                    "experience",
                    handleArrayChange(
                      value.experience,
                      i,
                      "duration",
                      e.target.value
                    )
                  )
                }
                className="w-1/6"
              />
              {value.experience.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeExperience(i)}
                >
                  ✕
                </Button>
              )}
            </div>
            <Label>Description/Bullets</Label>
            {ex.description.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <Input
                  value={pt}
                  onChange={(e) =>
                    updateField(
                      "experience",
                      handleDescriptionChange(
                        value.experience,
                        i,
                        "description",
                        idx,
                        e.target.value
                      )
                    )
                  }
                  placeholder="Achievement or responsibility"
                  className="w-full"
                />
                {ex.description.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      updateField(
                        "experience",
                        removeDescriptionLine(
                          value.experience,
                          i,
                          "description",
                          idx
                        )
                      )
                    }
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateField(
                  "experience",
                  addDescriptionLine(value.experience, i, "description")
                )
              }
            >
              Add Point
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addExperience}
        >
          Add Experience
        </Button>
      </div>
      <div>
        <Label>Skills</Label>
        {value.skills.map((sk, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={sk}
              onChange={(e) =>
                updateField(
                  "skills",
                  updateStringArray(value.skills, i, e.target.value)
                )
              }
              className="w-full"
            />
            {value.skills.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeSkill(i)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" className="mt-1" onClick={addSkill}>
          Add Skill
        </Button>
      </div>
      <div>
        <Label>Interests</Label>
        {value.interests.map((interest, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={interest}
              onChange={(e) =>
                updateField(
                  "interests",
                  updateStringArray(value.interests, i, e.target.value)
                )
              }
              className="w-full"
            />
            {value.interests.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeInterest(i)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addInterest}
        >
          Add Interest
        </Button>
      </div>
      <div>
        <Label>Recognitions</Label>
        {value.recognitions.map((rec, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={rec}
              onChange={(e) =>
                updateField(
                  "recognitions",
                  updateStringArray(value.recognitions, i, e.target.value)
                )
              }
              className="w-full"
            />
            {value.recognitions.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeRecognition(i)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addRecognition}
        >
          Add Recognition
        </Button>
      </div>
      <div>
        <Label>Certifications</Label>
        {value.certifications.map((c, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input
              placeholder="Title"
              value={c.title}
              onChange={(e) =>
                updateField(
                  "certifications",
                  handleArrayChange(
                    value.certifications,
                    i,
                    "title",
                    e.target.value
                  )
                )
              }
              className="w-2/6"
            />
            <Input
              placeholder="Institution"
              value={c.institution}
              onChange={(e) =>
                updateField(
                  "certifications",
                  handleArrayChange(
                    value.certifications,
                    i,
                    "institution",
                    e.target.value
                  )
                )
              }
              className="w-2/6"
            />
            <Input
              placeholder="Year"
              value={c.year}
              onChange={(e) =>
                updateField(
                  "certifications",
                  handleArrayChange(
                    value.certifications,
                    i,
                    "year",
                    e.target.value
                  )
                )
              }
              className="w-1/6"
            />
            {value.certifications.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeCertification(i)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addCertification}
        >
          Add Certification
        </Button>
      </div>
      <div>
        <Label>Volunteering</Label>
        {value.volunteering.map((vol, i) => (
          <div key={i} className="mb-2 border-l-2 pl-3">
            <div className="flex gap-2">
              <Input
                placeholder="Organization"
                value={vol.organization}
                onChange={(e) =>
                  updateField(
                    "volunteering",
                    handleArrayChange(
                      value.volunteering,
                      i,
                      "organization",
                      e.target.value
                    )
                  )
                }
                className="w-2/5"
              />
              <Input
                placeholder="Role"
                value={vol.role}
                onChange={(e) =>
                  updateField(
                    "volunteering",
                    handleArrayChange(
                      value.volunteering,
                      i,
                      "role",
                      e.target.value
                    )
                  )
                }
                className="w-1/4"
              />
              <Input
                placeholder="Location"
                value={vol.location}
                onChange={(e) =>
                  updateField(
                    "volunteering",
                    handleArrayChange(
                      value.volunteering,
                      i,
                      "location",
                      e.target.value
                    )
                  )
                }
                className="w-1/6"
              />
              <Input
                placeholder="Duration"
                value={vol.duration}
                onChange={(e) =>
                  updateField(
                    "volunteering",
                    handleArrayChange(
                      value.volunteering,
                      i,
                      "duration",
                      e.target.value
                    )
                  )
                }
                className="w-1/6"
              />
              {value.volunteering.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeVolunteering(i)}
                >
                  ✕
                </Button>
              )}
            </div>
            <Label>Description</Label>
            {vol.description.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <Input
                  value={pt}
                  onChange={(e) =>
                    updateField(
                      "volunteering",
                      handleDescriptionChange(
                        value.volunteering,
                        i,
                        "description",
                        idx,
                        e.target.value
                      )
                    )
                  }
                  placeholder="Contribution, activity, etc"
                  className="w-full"
                />
                {vol.description.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      updateField(
                        "volunteering",
                        removeDescriptionLine(
                          value.volunteering,
                          i,
                          "description",
                          idx
                        )
                      )
                    }
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateField(
                  "volunteering",
                  addDescriptionLine(value.volunteering, i, "description")
                )
              }
            >
              Add Description
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addVolunteering}
        >
          Add Volunteering
        </Button>
      </div>
      <div>
        <Label>Achievements/Awards</Label>
        {value.achievements.map((ach, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={ach}
              onChange={(e) =>
                updateField(
                  "achievements",
                  updateStringArray(value.achievements, i, e.target.value)
                )
              }
              className="w-full"
            />
            {value.achievements.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeAchievement(i)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addAchievement}
        >
          Add Achievement
        </Button>
      </div>
      <div>
        <Label>References</Label>
        {value.references.map((ref, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input
              placeholder="Name"
              value={ref.name}
              onChange={(e) =>
                updateField(
                  "references",
                  handleArrayChange(value.references, i, "name", e.target.value)
                )
              }
              className="w-1/3"
            />
            <Input
              placeholder="Position/Org"
              value={ref.position}
              onChange={(e) =>
                updateField(
                  "references",
                  handleArrayChange(
                    value.references,
                    i,
                    "position",
                    e.target.value
                  )
                )
              }
              className="w-1/3"
            />
            <Input
              placeholder="Contact"
              value={ref.contact}
              onChange={(e) =>
                updateField(
                  "references",
                  handleArrayChange(
                    value.references,
                    i,
                    "contact",
                    e.target.value
                  )
                )
              }
              className="w-1/3"
            />
            {value.references.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeReference(i)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={addReference}
        >
          Add Reference
        </Button>
      </div>
    </div>
  );
};

export default CVForm;
