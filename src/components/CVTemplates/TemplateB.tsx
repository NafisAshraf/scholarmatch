import { CVData } from "@/components/cv-form";
import React from "react";

// Classic A4 style, clear section lines, employer/role/location/dates, bullets (styled for print)
const sectionCls = "mb-2 break-inside-avoid-page";
const headingCls =
  "font-bold text-base border-b border-gray-300 pb-1 pt-2 uppercase tracking-wide text-gray-700";
const contentItemCls = "mb-1 ml-4";
const detailsListCls = "list-disc ml-8 mr-2";
const rightInfoCls =
  "text-xs text-right text-gray-500 min-w-[120px] ml-auto whitespace-nowrap";

export default function TemplateB({ data }: { data: CVData }) {
  console.log(data);
  return (
    <div
      style={{
        fontFamily: "Georgia, Times, serif",
        fontSize: "13px",
        color: "#222",
      }}
      className="p-1"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center border-b pb-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        <div className="text-sm text-gray-700">{data.address}</div>
        <div className="text-xs">
          {data.email} | {data.phone}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className={`${sectionCls}`}>
          <div className={headingCls}>Summary</div>
          <p className="italic ml-1">{data.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>Education</div>
          {data.education.map((e, i) => (
            <div className="flex gap-2 mb-1" key={i}>
              <div>
                <div className="font-semibold">{e.degree}</div>
                <div className="text-xs">{e.school}</div>
                <div className="text-xs text-gray-500">{e.location}</div>
                {e.details && e.details.length > 0 && (
                  <ul className={detailsListCls}>
                    {e.details.map((li, j) => li && <li key={j}>{li}</li>)}
                  </ul>
                )}
              </div>
              <div className={rightInfoCls}>{e.year}</div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>Experience</div>
          {data.experience.map((ex, i) => (
            <div className="flex gap-2 mb-1" key={i}>
              <div>
                <div className="font-semibold">{ex.role}</div>
                <div className="text-xs">{ex.company}</div>
                <div className="text-xs text-gray-500">{ex.location}</div>
                {ex.description && ex.description.length > 0 && (
                  <ul className={detailsListCls}>
                    {ex.description.map((li, j) => li && <li key={j}>{li}</li>)}
                  </ul>
                )}
              </div>
              <div className={rightInfoCls}>{ex.duration}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>Skills</div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 ml-2">
            {data.skills.map(
              (sk, i) =>
                sk && (
                  <span
                    key={i}
                    className="bg-gray-200 text-gray-700 rounded px-2 text-xs mr-1"
                  >
                    {sk}
                  </span>
                )
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>Interests</div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 ml-2">
            {data.interests.map(
              (sk, i) =>
                sk && (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 rounded px-2 text-xs mr-1"
                  >
                    {sk}
                  </span>
                )
            )}
          </div>
        </div>
      )}

      {/* Recognitions */}
      {data.recognitions.length > 0 && (
        <div className={sectionCls + " break-after-page"}>
          <div className={headingCls}>Recognitions</div>
          <ul className={detailsListCls}>
            {data.recognitions.map((r, i) => r && <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>Certifications</div>
          <ul className={detailsListCls}>
            {data.certifications.map(
              (c, i) =>
                c &&
                (c.title || c.institution) && (
                  <li key={i}>
                    <span className="font-semibold">{c.title}</span>
                    {c.institution && ` (${c.institution})`}
                    {c.year && `, ${c.year}`}
                  </li>
                )
            )}
          </ul>
        </div>
      )}

      {/* Volunteering */}
      {data.volunteering.length > 0 && (
        <div className={sectionCls + " break-after-page"}>
          <div className={headingCls}>Volunteering</div>
          {data.volunteering.map((vol, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <div>
                <div className="font-semibold">{vol.role}</div>
                <div className="text-xs">{vol.organization}</div>
                <div className="text-xs text-gray-500">{vol.location}</div>
                {vol.description && vol.description.length > 0 && (
                  <ul className={detailsListCls}>
                    {vol.description.map(
                      (li, j) => li && <li key={j}>{li}</li>
                    )}
                  </ul>
                )}
              </div>
              <div className={rightInfoCls}>{vol.duration}</div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements/Awards */}
      {data.achievements.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>Achievements & Awards</div>
          <ul className={detailsListCls}>
            {data.achievements.map((a, i) => a && <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className={sectionCls}>
          <div className={headingCls}>References</div>
          <ul className="ml-2">
            {data.references.map(
              (ref, i) =>
                ref &&
                ref.name && (
                  <li key={i}>
                    <span className="font-semibold">{ref.name}</span> –{" "}
                    {ref.position} – {ref.contact}
                  </li>
                )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
