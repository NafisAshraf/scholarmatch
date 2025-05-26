import { CVData } from "@/components/cv-form";

export default function TemplateA({ data }: { data: CVData }) {
  return (
    <div
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
      className="text-slate-900"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
        {data.name}
      </h1>
      <p className="text-sm text-gray-700 mt-1 mb-2">
        {data.email} · {data.phone}
      </p>
      <p className="text-base font-medium mt-2 mb-3">{data.summary}</p>

      <div className="my-3">
        <h2 className="font-bold text-lg text-indigo-500 mb-1">Education</h2>
        <ul className="list-disc pl-5">
          {data.education.map((e, i) => (
            <li key={i} className="mb-1">
              <span className="font-bold">{e.school}</span>
              {e.degree && (
                <>
                  {" "}
                  – <span>{e.degree}</span>
                </>
              )}
              {e.year && <> ({e.year})</>}
            </li>
          ))}
        </ul>
      </div>
      <div className="my-3">
        <h2 className="font-bold text-lg text-indigo-500 mb-1">Experience</h2>
        <ul className="list-disc pl-5">
          {data.experience.map((ex, i) => (
            <li key={i} className="mb-1">
              <span className="font-bold">{ex.company}</span>
              {ex.role && (
                <>
                  {" "}
                  – <span>{ex.role}</span>
                </>
              )}
              {ex.duration && <> ({ex.duration})</>}
              {ex.description && (
                <div className="ml-2 text-sm">{ex.description}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="my-3">
        <h2 className="font-bold text-lg text-indigo-500 mb-1">Skills</h2>
        <ul className="flex flex-wrap gap-2 pl-0 mt-1">
          {data.skills.map(
            (sk, i) =>
              sk && (
                <li
                  key={i}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {sk}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
}
