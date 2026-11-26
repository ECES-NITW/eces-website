"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { roadmapTracks } from "@/lib/roadmaps";

export function RoadmapView() {
  const [trackId, setTrackId] = useState(roadmapTracks[0].id);
  const track = roadmapTracks.find(item => item.id === trackId) ?? roadmapTracks[0];

  return <main className="events-page">
    <div className="events-intro">
      <a className="back-link" href="/"><ArrowLeft size={16} /> Back to home</a>
      <div className="events-heading">
        <div>
          <h1>PLAN YOUR PATH.<br /><span>PREP SMARTER.</span></h1>
          <p>Roadmaps and resources for internships and placements.</p>
        </div>
        <div className="events-side-note"><span>ECE SOCIETY</span><strong>Start where<br />you are.</strong></div>
      </div>
    </div>

    <div className="roadmap-tabs" role="tablist" aria-label="Roadmap tracks">
      {roadmapTracks.map(item => (
        <button key={item.id} type="button" role="tab" aria-selected={trackId === item.id}
          className={trackId === item.id ? "roadmap-tab active" : "roadmap-tab"}
          onClick={() => setTrackId(item.id)}>{item.label}</button>
      ))}
    </div>

    <section className="roadmap-track" aria-label={`${track.label} roadmap`}>
      <p className="roadmap-blurb">{track.blurb}</p>
      {track.topics.map((topic, index) => (
        <article className="roadmap-topic" key={topic.title}>
          <span className="roadmap-step">{String(index + 1).padStart(2, "0")}</span>
          <div className="roadmap-body">
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            {topic.resources.length > 0 && <ul className="roadmap-resources">
              {topic.resources.map(resource => (
                <li key={resource.url}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <small>{resource.type}</small>{resource.label} <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>}
          </div>
        </article>
      ))}
    </section>
  </main>;
}