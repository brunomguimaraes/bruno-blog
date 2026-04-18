"use client";

import { useEasterEggs } from "./context";

export default function CyberterrorAlert() {
  const { alarmOpen } = useEasterEggs();
  return (
    <div className={"alarm" + (alarmOpen ? " show" : "")} aria-hidden={!alarmOpen}>
      <div className="flash" />
      <div className="scanbars" />
      <div className="noise" />
      <div className="msg">
        <div className="code">ERR 0xANN · TRACE: NEGATIVE ZONE</div>
        <h2>ANNIHILATION WAVE</h2>
        <div className="det">Hostile signature detected. Milano shields up.</div>
        <div className="bar"><i /></div>
      </div>
    </div>
  );
}
