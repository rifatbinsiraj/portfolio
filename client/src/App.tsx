import React, { useEffect, useMemo, useState } from 'react';

type Counters = { achievements: number; projects: number };
type Socials = {
  github?: string;
  linkedin?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
};
type Profile = {
  name: string;
  role: string;
  experience: number;
  address: string;
  phone: string;
  email: string;
  languages: string[];
  tools: string[];
  counters: Counters;
  typingTitles: string[];
  cvUrl?: string;
  socials: Socials;
};

type Project = {
  title: string;
  url?: string;
  image?: string;
  tech: string;
  external?: boolean;
};

type Skill = { name: string; percent: number };

type Experience = {
  date: string;
  title: string;
  company: string;
  bullets: string[];
};

type Education = {
  date: string;
  degree: string;
  institution: string;
  details?: string;
};

type Contacts = {
  address: string;
  phone: string;
  email: string;
};

async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

export default function App() {
  // Data state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [about, setAbout] = useState<{ headline: string; summary: string; profile: string; interests: string[] } | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [contactCards, setContactCards] = useState<Contacts | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contact form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | 'ok' | 'fail'>(null);

  // Typing animation state
  const titles = useMemo(() => profile?.typingTitles ?? ['Software Engineer', 'Full-Stack Engineer', 'Back-End Engineer'], [profile]);
  const [typingText, setTypingText] = useState(titles[0] ?? '');
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, prj, ab, sk, exp, edu, cards] = await Promise.all([
          getJSON<Profile>('/api/profile'),
          getJSON<Project[]>('/api/projects'),
          getJSON<{ headline: string; summary: string; profile: string; interests: string[] }>('/api/about'),
          getJSON<Skill[]>('/api/skills'),
          getJSON<Experience[]>('/api/resume/experience'),
          getJSON<Education[]>('/api/resume/education'),
          getJSON<Contacts>('/api/contacts'),
        ]);
        if (!mounted) return;
        setProfile(p);
        setProjects(prj);
        setAbout(ab);
        setSkills(sk);
        setExperience(exp);
        setEducation(edu);
        setContactCards(cards);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Typing effect
  useEffect(() => {
    const current = titles[typingIndex % titles.length] ?? '';
    // if deleting, remove char; else add char
    const stepMs = deleting ? 60 : 120;
    const pauseEnd = 1000;
    const pauseStart = 300;

    const timer = setTimeout(() => {
      if (!deleting) {
        const nextLen = charIndex + 1;
        setTypingText(current.slice(0, nextLen));
        setCharIndex(nextLen);
        if (nextLen === current.length) {
          setDeleting(true);
          setTimeout(() => {}, pauseEnd);
        }
      } else {
        const nextLen = charIndex - 1;
        setTypingText(current.slice(0, Math.max(0, nextLen)));
        setCharIndex(nextLen);
        if (nextLen <= 0) {
          setDeleting(false);
          setTypingIndex((i) => (i + 1) % Math.max(1, titles.length));
          setTimeout(() => {}, pauseStart);
        }
      }
    }, stepMs);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, typingIndex, titles]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent(null);
    try {
      await getJSON('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      setSent('ok');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setSent('fail');
    } finally {
      setSending(false);
    }
  };

  const SocialLinks = ({ socials }: { socials: Socials }) => (
    <ul className="ftco-footer-social list-unstyled d-flex align-items-center mb-0" style={{ gap: 16, paddingLeft: 0 }}>
      {socials.youtube && (
        <li><a href={socials.youtube} target="_blank" rel="noreferrer"><span className="icon-youtube" /></a></li>
      )}
      {socials.linkedin && (
        <li><a href={socials.linkedin} target="_blank" rel="noreferrer"><span className="icon-linkedin" /></a></li>
      )}
      {socials.facebook && (
        <li><a href={socials.facebook} target="_blank" rel="noreferrer"><span className="icon-facebook" /></a></li>
      )}
      {socials.instagram && (
        <li><a href={socials.instagram} target="_blank" rel="noreferrer"><span className="icon-instagram" /></a></li>
      )}
      {socials.github && (
        <li><a href={socials.github} target="_blank" rel="noreferrer"><span className="icon-github" /></a></li>
      )}
    </ul>
  );

  return (
    <div>
      {/* Navbar */}
      <header className="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light site-navbar-target" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#000' }}>
        <div className="container">
          <a className="navbar-brand" href="#home">{profile?.name ?? 'Portfolio'}</a>
          <nav className="ml-auto d-flex" style={{ gap: 16 }}>
            <a className="nav-link text-white" href="#about">About</a>
            <a className="nav-link text-white" href="#resume">Resume</a>
            <a className="nav-link text-white" href="#projects">Projects</a>
            <a className="nav-link text-white" href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero-wrap ftco-section" style={{ background: '#000' }}>
        <div className="container">
          {loading && <p className="text-center text-white">Loading...</p>}
          {error && <div className="alert alert-danger text-center">{error}</div>}
          {profile && (
            <div className="row align-items-center">
              <div className="col-md-7">
                <span className="subheading text-primary">Hello!</span>
                <h1 className="mb-3" style={{ color: '#fff', fontWeight: 800 }}>
                  I'm <span style={{ color: '#ffbd39' }}>{profile.name}</span>
                </h1>

                <h2 className="mb-1" style={{ color: '#fff' }}>{profile.role}</h2>
                <div id="typing-animation" style={{ color: '#ffbd39', minHeight: 36, fontWeight: 700 }}>
                  {typingText}<span className="blinking-cursor">|</span>
                </div>

                <p className="text-white-50 mt-3">
                  Experience: {profile.experience} years • {profile.address}
                </p>

                <div className="d-flex mt-3" style={{ gap: 12, flexWrap: 'wrap' }}>
                  {profile.socials?.linkedin && (
                    <a className="btn btn-primary" href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                  )}
                  {profile.socials?.github && (
                    <a className="btn btn-white btn-outline-white" href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
                  )}
                  {profile.cvUrl && (
                    <a className="btn btn-secondary" href={profile.cvUrl} target="_blank" rel="noreferrer">Download CV</a>
                  )}
                </div>

                <div className="d-flex mt-4" style={{ gap: 24 }}>
                  <div className="text-center">
                    <strong className="ftco-number" style={{ color: '#ffbd39' }}>{profile.counters.achievements}</strong>
                    <div className="ftco-label text-white-50">Achievements</div>
                  </div>
                  <div className="text-center">
                    <strong className="ftco-number" style={{ color: '#ffbd39' }}>{profile.counters.projects}</strong>
                    <div className="ftco-label text-white-50">Projects</div>
                  </div>
                </div>

                <div className="mt-4">
                  {profile.socials && <SocialLinks socials={profile.socials} />}
                </div>
              </div>
              <div className="col-md-5 text-center">
                <img src="/images/about.png" alt="About" style={{ maxWidth: 320 }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="ftco-about img ftco-section ftco-no-pb">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-5 d-flex">
              <div className="img-about img d-flex align-items-stretch">
                <div className="overlay w-100 text-center py-4">
                  <div className="img-about-small">
                    <img src="/images/about-me.png" alt="Rifat Bin Siraj" style={{ maxWidth: 200 }} />
                  </div>
                  <div className="about-info mt-3">
                    <p><span className="title-s">Name:</span> <span>{profile?.name}</span></p>
                    <p><span className="title-s">Job Role:</span> <span>{profile?.role}</span></p>
                    <p><span className="title-s">Experience:</span> <span>{profile?.experience} Years</span></p>
                    <p><span className="title-s">Address:</span> <span>{profile?.address}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-7 pl-lg-5 pb-5">
              <div className="heading-section">
                <h1 className="big">About</h1>
                <h2 className="mb-4">About Me</h2>
                {about ? (
                  <p>{about.summary}</p>
                ) : (
                  <p>I love solving complex problems and building scalable systems.</p>
                )}
                <ul className="about-info mt-4 px-md-0 px-2">
                  <li className="d-flex"><span>Profile:</span> <span>{about?.profile ?? 'Full-Stack Engineer'}</span></li>
                  <li className="d-flex"><span>Education:</span> <span>Bachelor of Engineering in CSE</span></li>
                  <li className="d-flex"><span>Language:</span> <span>{profile?.languages.join(', ')}</span></li>
                  <li className="d-flex"><span>Tools & Technologies:</span> <span>{profile?.tools.join(', ')}</span></li>
                  <li className="d-flex"><span>Interest:</span> <span>{about?.interests?.join(', ')}</span></li>
                </ul>
              </div>

              {/* Skills */}
              <div className="skill-mf mt-4">
                <p className="title-s">Skills</p>
                {skills.map((s) => (
                  <div key={s.name}>
                    <span>{s.name}</span> <span className="pull-right">{s.percent}%</span>
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{ width: `${s.percent}%` }} aria-valuenow={s.percent} aria-valuemin={0} aria-valuemax={100} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume */}
      <section id="resume" className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-4">
            <div className="col-md-10 heading-section text-center">
              <h1 className="big big-2">Resume</h1>
              <h2 className="mb-4">Resume</h2>
              <p>Highly skilled software engineer with experience in full-stack development, cloud services, and software architecture.</p>
              <p className="mt-3">
                <a href={profile?.cvUrl ?? '/Rifat_Bin_Siraj_CV.pdf'} className="btn btn-primary py-3 px-4" target="_blank" rel="noreferrer">Download CV</a>
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h1 className="big-4">Experience</h1>
              <div className="underline" />
              <br />
              {experience.map((e) => (
                <div key={e.title + e.company} className="resume-wrap ftco-animate">
                  <span className="date">{e.date}</span>
                  <h2>{e.title}</h2>
                  <span className="position">{e.company}</span>
                  <ul className="mt-3">
                    {e.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="col-md-6">
              <h1 className="big-4">Education</h1>
              <div className="underline" />
              <br />
              {education.map((ed) => (
                <div key={ed.institution + ed.date} className="resume-wrap ftco-animate">
                  <span className="date">{ed.date}</span>
                  <h2>{ed.degree}</h2>
                  <span className="position">{ed.institution}</span>
                  {ed.details && <p className="mt-3">{ed.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="ftco-section">
        <div className="container">
          <div className="heading-section text-center mb-5">
            <h1 className="big big-2">Projects</h1>
            <h2 className="mb-4">Projects</h2>
            <p>Highlighted work across back-end, front-end and cloud.</p>
            <div className="underline" />
          </div>

          <div className="row">
            {projects.map((p) => (
              <div key={p.title} className="col-md-4 d-flex mb-4">
                <div className="blog-entry w-100">
                  <a
                    className="block-20 zoom-effect"
                    href={p.url ?? '#'}
                    target={p.external ? '_blank' : '_self'}
                    rel="noreferrer"
                    style={{ backgroundImage: `url('${p.image ?? '/images/bg_1.jpg'}')` }}
                  />
                  <div className="text mt-3 d-block">
                    <h3 className="heading">
                      <a href={p.url ?? '#'} target={p.external ? '_blank' : '_self'} rel="noreferrer">
                        {p.title}
                      </a>
                    </h3>
                    <p className="text-white-50">Technology: {p.tech}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="ftco-section contact-section ftco-no-pb">
        <div className="container">
          <div className="heading-section text-center mb-5">
            <h1 className="big big-2">Contact</h1>
            <h2 className="mb-4">Contact Me</h2>
            <p>Reach out using the form below</p>
            <div className="underline" />
          </div>

          {/* Info cards */}
          {contactCards && (
            <div className="row d-flex justify-content-center contact-info mb-5">
              <div className="col-md-6 col-lg-3 d-flex ftco-animate">
                <div className="align-self-stretch box p-4 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="icon-map-signs" />
                  </div>
                  <h3 className="mb-4">Address</h3>
                  <p>{contactCards.address}</p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 d-flex ftco-animate">
                <div className="align-self-stretch box p-4 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="icon-phone2" />
                  </div>
                  <h3 className="mb-4">Contact Number</h3>
                  <p><a href={`tel://${contactCards.phone}`}>{contactCards.phone}</a></p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 d-flex ftco-animate">
                <div className="align-self-stretch box p-4 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="icon-paper-plane" />
                  </div>
                  <h3 className="mb-4">Email Address</h3>
                  <p><a href={`mailto:${contactCards.email}`}>{contactCards.email}</a></p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form className="contact-form" onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" className="form-control" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>
                <div className="text-center">
                  <button className="btn btn-primary" disabled={sending} type="submit">
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {sent === 'ok' && <p className="text-center text-success mt-3">Thank you! Your message has been sent.</p>}
                {sent === 'fail' && <p className="text-center text-danger mt-3">Oops! Something went wrong.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="ftco-footer ftco-section">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} All rights reserved. Built with React + NestJS.</p>
        </div>
      </footer>
    </div>
  );
}