import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SocialIcon } from "@/components/social-icon";
import { teamGroups, type TeamMember } from "@/lib/team";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team | ECE Society NIT Warangal",
  description: "Meet the student team behind the ECE Society at NIT Warangal and get in touch.",
};

const socialProfiles = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
] as const;

function MemberCard({ member, featured }: { member: TeamMember; featured: boolean }) {
  const { name, email, portrait } = member;
  const nameParts = name.split(" ");
  const initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];

  return (
    <article className={styles.member}>
      <div className={styles.portrait}>
        {portrait ? (
          // The site ships these portraits as resized WebP files.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/team/${portrait}.webp`}
            alt=""
            width={featured ? 720 : 480}
            height={featured ? 960 : 480}
            loading={featured ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">{initials}</div>
        )}
      </div>
      <div className={styles.memberInfo}>
        <h3>{name}</h3>
        <div className={styles.contacts}>
          <a href={`mailto:${email}`} aria-label={`Email ${name}`} title={email}>
            <Mail size={17} strokeWidth={1.5} aria-hidden="true" />
          </a>
          {socialProfiles.map(({ id, label }) => {
            const href = member[id];
            return href ? (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${label} (opens in a new tab)`}
                title={label}
              >
                <SocialIcon id={id} size={17} />
              </a>
            ) : (
              <span key={id} className={styles.socialPlaceholder} title={`${label} profile pending`}>
                <SocialIcon id={id} size={17} />
                <span className="sr-only">{label} profile pending</span>
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default function TeamPage() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Meet the <span>team</span></h1>
        <p>The students behind the ECE Society at NIT Warangal.</p>
      </header>

      <nav className={styles.jumpNav} aria-label="Jump to a team role">
        {teamGroups.map(({ id, title }) => (
          <a key={id} href={`#${id}`}>{title}</a>
        ))}
      </nav>

      {teamGroups.map(({ id, title, year, members }) => {
        const featured = id === "general-secretary";
        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-title`}
            className={featured ? styles.featured : styles.group}
          >
            <header className={styles.groupHeading}>
              <h2 id={`${id}-title`}>{title}</h2>
              <p>{year}</p>
            </header>
            <ul className={styles.grid} role="list">
              {members.map(member => (
                <li key={member.email}>
                  <MemberCard member={member} featured={featured} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
