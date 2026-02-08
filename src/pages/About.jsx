export default function About() {
  return (
    <div className="page about-page">
      <h2>About</h2>

      <div className="about-card">
        <div className="about-photo-wrapper">
          <img
            src="https://qhrssbqpik3aatz0.public.blob.vercel-storage.com/Screenshot%202026-01-13%20at%207.04.09%E2%80%AFPM.png"
            alt="Brady Lambert"
            className="about-photo"
          />
        </div>
        <div className="about-info">
          <h3>Brady Lambert</h3>
          <p className="about-subtitle">Soccer player &middot; Varsity &middot; ECNL RL &middot; International High School</p>
          <p className="about-bio">
            A high school soccer player and Concussion Coach founder, Brady Lambert is passionate
            about helping students study smarter. As someone who has balanced competitive athletics
            with academics, Brady understands the importance of effective study tools that work
            around a busy schedule.
          </p>
          <p className="about-bio">
            StudyDeck was built to make it easy to create flash cards, organize study guides, and
            practice with self-grading tests &mdash; all in one place, right from your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
