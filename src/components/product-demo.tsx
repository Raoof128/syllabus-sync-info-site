import { Icon } from "./icons";

type DemoView = "today" | "calendar" | "deadlines" | "campus" | "events" | "overview";

const nav = [
  ["today", "clock", "Today"],
  ["calendar", "calendar", "Calendar"],
  ["deadlines", "deadline", "Deadlines"],
  ["campus", "map", "Campus"],
  ["events", "event", "Events"],
] as const;

export function ProductDemo({ view = "today", compact = false }: { view?: DemoView; compact?: boolean }) {
  return (
    <div className={`product-demo ${compact ? "product-demo-compact" : ""}`}>
      <div className="demo-topbar">
        <span className="mini-brand"><span className="mini-mark" /> Syllabus Sync</span>
        <span className="avatar" aria-hidden="true">SK</span>
      </div>
      <div className="demo-body">
        {!compact && (
          <div className="demo-sidebar" aria-hidden="true">
            {nav.map(([targetView, icon, label]) => (
              <span className={view === targetView || (view === "overview" && targetView === "today") ? "active" : ""} key={label}>
                <Icon name={icon} size={15} /> {label}
              </span>
            ))}
          </div>
        )}
        <div className="demo-content">
          <DemoContent view={view} />
        </div>
      </div>
    </div>
  );
}

function DemoContent({ view }: { view: DemoView }) {
  if (view === "calendar") {
    return <>
      <DemoHeading title="My semester" action="Month" />
      <div className="calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => <b key={day}>{day}</b>)}
        {["", "Data Structures", "", "Career fair", ""].map((item, index) => <span key={`${item}-${index}`} className={item ? `calendar-event tone-${index}` : ""}>{item}</span>)}
        {["Design studio", "", "Business Analytics", "", "Deadline"].map((item, index) => <span key={`${item}-${index}`} className={item ? `calendar-event tone-${index + 2}` : ""}>{item}</span>)}
        {["", "Workshop", "", "", "Society meetup"].map((item, index) => <span key={`${item}-${index}`} className={item ? `calendar-event tone-${index + 4}` : ""}>{item}</span>)}
      </div>
    </>;
  }

  if (view === "deadlines") {
    return <>
      <DemoHeading title="Deadlines" action="All units" />
      <div className="deadline-list">
        <Deadline label="Problem Set 2" unit="Data Structures" due="In 3 days" tone="red" />
        <Deadline label="Business Case Report" unit="Business Analytics" due="In 7 days" tone="green" />
        <Deadline label="Design Portfolio" unit="Design Thinking" due="In 2 weeks" tone="blue" />
      </div>
    </>;
  }

  if (view === "campus") {
    return <>
      <DemoHeading title="Campus" action="Get directions" />
      <div className="campus-grid">
        <div className="map-graphic" aria-label="Fictional campus map illustration" role="img">
          <span className="road road-a" /><span className="road road-b" /><span className="road road-c" />
          <span className="map-pin"><Icon name="map" size={18} /></span>
        </div>
        <div className="location-copy"><b>Central Library</b><span>Level 2, Study Zone</span><small>Open until 9:00 PM</small></div>
      </div>
    </>;
  }

  if (view === "events") {
    return <>
      <DemoHeading title="Events" action="Upcoming" />
      <div className="event-list">
        <Event date="14 May" title="Careers Fair" place="Main Quad · 10:00 AM" />
        <Event date="16 May" title="Design Society Meetup" place="Studio A · 5:30 PM" />
        <Event date="21 May" title="Guest lecture: Future of AI" place="Central Lecture Theatre" />
      </div>
    </>;
  }

  if (view === "overview") {
    return <>
      <DemoHeading title="Academic overview" action="This week" />
      <div className="overview-grid">
        <Metric label="Classes" value="4" /><Metric label="Deadlines" value="2" />
        <Metric label="Events" value="2" /><Metric label="Tasks" value="1" />
      </div>
      <div className="day-bars"><span /><span /><span /></div>
    </>;
  }

  return <>
    <DemoHeading title="Today" action="Tuesday 13 May" />
    <div className="today-layout">
      <div className="schedule">
        <Schedule time="9:00 AM" label="Data Structures" place="Central Lecture Theatre 2" tone="blue" />
        <Schedule time="11:00 AM" label="Business Analytics" place="Building 8, Room 203" tone="green" />
        <Schedule time="2:00 PM" label="Design Thinking" place="Studio A" tone="purple" />
      </div>
      <div className="today-side">
        <div className="mini-panel"><small>Upcoming deadline</small><b>Problem Set 2</b><span>Due Friday · 11:59 PM</span></div>
        <div className="mini-panel"><small>Campus location</small><b>Central Library</b><span>Level 2, Study Zone</span></div>
      </div>
    </div>
  </>;
}

function DemoHeading({ title, action }: { title: string; action: string }) {
  return <div className="demo-heading"><strong className="demo-title">{title}</strong><span>{action}</span></div>;
}

function Schedule({ time, label, place, tone }: { time: string; label: string; place: string; tone: string }) {
  return <div className={`schedule-row ${tone}`}><time>{time}</time><div><b>{label}</b><span>{place}</span></div></div>;
}

function Deadline({ label, unit, due, tone }: { label: string; unit: string; due: string; tone: string }) {
  return <div className="deadline-row"><span className={`deadline-dot ${tone}`} /><div><b>{label}</b><span>{unit}</span></div><time>{due}</time></div>;
}

function Event({ date, title, place }: { date: string; title: string; place: string }) {
  return <div className="event-row"><time>{date}</time><div><b>{title}</b><span>{place}</span></div></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><b>{value}</b><span>{label}</span></div>;
}
