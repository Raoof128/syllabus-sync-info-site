import Image from "next/image";

import { approvedTeam } from "@/content/project-facts";

export function TeamSection() {
  return (
    <section className="team-section" id="team">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Team</p>
          <h2>Built by two founders, collaboratively.</h2>
          <p>Syllabus Sync, Sylla and MQ Navigation are built together, with each founder leading different parts of the ecosystem.</p>
        </div>
        <div className="team-grid">
          {approvedTeam.map((member) => (
            <article className="team-card" key={member.name}>
              <div className="team-photo">
                <Image alt={member.name} height={72} src={member.photo} width={72} />
              </div>
              <div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p>{member.bio}</p>
                <div className="team-links">
                  <a href={member.linkedIn} rel="noreferrer" target="_blank">LinkedIn</a>
                  <a href={member.gitHub} rel="noreferrer" target="_blank">GitHub</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
