import React, { memo } from "react";

import { Code2 } from "lucide-react";

import {
    getUserSkills,
    getUserSkillColor,
} from "./userCardHelpers";

const MAX_VISIBLE_SKILLS = 4;

const UserCardSkills = ({ user }) => {
    const skills = getUserSkills(user);

    const visibleSkills = skills.slice(
        0,
        MAX_VISIBLE_SKILLS
    );

    const extraSkills = Math.max(
        0,
        skills.length - MAX_VISIBLE_SKILLS
    );

    return (
        <section className="mt-5 min-w-0 flex-1">
            <h4
                className="
                    mb-3 flex items-center gap-2
                    font-mono text-[11px] font-black
                    uppercase tracking-wider
                    text-slate-600 dark:text-slate-400
                "
            >
                <Code2
                    size={15}
                    aria-hidden="true"
                    className="text-indigo-600 dark:text-cyan-400"
                />
                skills
            </h4>

            {visibleSkills.length ? (
                <div className="flex flex-wrap gap-2">
                    {visibleSkills.map((skill) => (
                        <span
                            key={skill.toLowerCase()}
                            title={skill}
                            className={`
                                inline-flex max-w-full items-center
                                rounded-full border px-2.5 py-1.5
                                text-[11px] font-bold
                                ${getUserSkillColor(skill)}
                            `}
                        >
                            <span className="truncate">
                                #{skill}
                            </span>
                        </span>
                    ))}

                    {extraSkills > 0 && (
                        <span
                            title={`Yana ${extraSkills} ta ko‘nikma`}
                            className="
                                rounded-full border border-slate-200
                                bg-slate-50 px-2.5 py-1.5
                                text-[11px] font-black text-slate-600
                                dark:border-white/10
                                dark:bg-white/[0.05]
                                dark:text-slate-300
                            "
                        >
                            +{extraSkills}
                        </span>
                    )}
                </div>
            ) : (
                <p
                    className="
                        rounded-xl border border-dashed
                        border-slate-200 bg-slate-50/70
                        px-3 py-4 text-xs text-slate-500
                        dark:border-white/[0.09]
                        dark:bg-white/[0.025]
                        dark:text-slate-400
                    "
                >
                    Skills hali qo‘shilmagan.
                </p>
            )}
        </section>
    );
};

export default memo(UserCardSkills);