import { Controller, Get, Post, Body } from '@nestjs/common';

interface Project {
  title: string;
  url?: string;
  image?: string;
  tech: string;
  external?: boolean;
}

interface Skill {
  name: string;
  percent: number; // 0-100
}

interface Experience {
  date: string;
  title: string; // role
  company: string;
  bullets: string[];
}

interface Education {
  date: string;
  degree: string;
  institution: string;
  details?: string;
}

interface Contacts {
  address: string;
  phone: string;
  email: string;
}

class ContactDto {
  name!: string;
  email!: string;
  subject!: string;
  message!: string;
}

@Controller()
export class AppController {
  // Health check
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  // Basic profile info to drive the UI
  @Get('profile')
  getProfile() {
    return {
      name: 'Rifat Bin Siraj',
      role: 'Full-Stack Engineer',
      experience: 3.5,
      address: 'Dhaka, Bangladesh',
      phone: '+8801761233953',
      email: 'rifatrabbi024@gmail.com',
      languages: ['English', 'Bengali'],
      tools: ['Java (Spring Boot)', 'JavaScript (NodeJS, Serverless)', 'AWS', 'SQL', 'Unix', 'Git'],
      counters: {
        achievements: 20,
        projects: 30,
      },
      typingTitles: ['Software Engineer', 'Full-Stack Engineer', 'Back-End Engineer'],
      cvUrl: '/Rifat_Bin_Siraj_CV.pdf',
      socials: {
        github: 'https://github.com/Rifat024',
        linkedin: 'https://www.linkedin.com/in/rifatbinsiraj/',
        youtube: 'https://www.youtube.com/@rifatbinsiraj1249',
        facebook: 'https://www.facebook.com/rifatbin.siraj/',
        instagram: 'https://www.instagram.com/rifat_bin_siraj/',
      },
    };
  }

  // About text (from original site)
  @Get('about')
  getAbout() {
    return {
      headline: 'About Me',
      summary:
        'I am a highly skilled and motivated software developer with 3.5 years of experience in developing desktop and web applications. My career objective is to work in a position where I can use my skills to positively impact the business.',
      profile: 'Full-Stack Engineer',
      interests: ['Software Development', 'Traveling'],
    };
  }

  // Skills with percentages
  @Get('skills')
  getSkills(): Skill[] {
    return [
      { name: 'Java (Spring Boot)', percent: 95 },
      { name: 'JavaScript (NodeJS, Serverless)', percent: 90 },
      { name: 'AWS (Lambda, SNS, SES, DynamoDB, API Gateway, S3, Cognito)', percent: 85 },
      { name: 'SQL (MySQL, PostgreSQL, NoSQL)', percent: 80 },
      { name: 'Unix, Git', percent: 85 },
    ];
  }

  // Resume - Experience
  @Get('resume/experience')
  getExperience(): Experience[] {
    return [
      {
        date: '2022-Present',
        title: 'Full-Stack Engineer',
        company: 'Sense & Respond Software LLC',
        bullets: [
          'Write code and tests, build prototypes, resolve issues, and analyze bottlenecks.',
          'Manage and optimize scalable distributed systems in the cloud.',
          'Optimize web applications for performance and scalability.',
          'Develop automated tests to ensure business needs are met, enabling regression testing.',
        ],
      },
      {
        date: '2021-2022',
        title: 'Software Engineer',
        company: 'Ghuddy Limited',
        bullets: [
          'Developed and maintained web applications with a focus on user experience and performance.',
          'Worked on bill calculation, merchant payout, and payment method integration.',
          'Utilized Spring Boot, PostgreSQL, Firebase, and AWS to deliver robust solutions.',
        ],
      },
    ];
  }

  // Resume - Education
  @Get('resume/education')
  getEducation(): Education[] {
    return [
      {
        date: '2016-2021',
        degree: 'Bachelor of Engineering in Computer Science & Engineering',
        institution: 'Rajshahi University of Engineering & Technology',
        details: 'Graduated with First class distinction.',
      },
      {
        date: '2013-2015',
        degree: 'Higher Secondary Certificate (Science), GPA-5',
        institution: 'Rajshahi Govt City College',
      },
      {
        date: '2012-2013',
        degree: 'Secondary School Certificate (Science), GPA-5',
        institution: 'Rajshahi Govt Naohata High School',
      },
    ];
  }

  // Contacts info cards
  @Get('contacts')
  getContacts(): Contacts {
    return {
      address: 'Dhaka, Bangladesh',
      phone: '+8801761233953',
      email: 'rifatrabbi024@gmail.com',
    };
  }

  // Typing titles for the hero animation
  @Get('typing-titles')
  getTypingTitles(): string[] {
    return ['Software Engineer', 'Full-Stack Engineer', 'Back-End Engineer'];
  }

  // Project cards for the portfolio grid
  @Get('projects')
  getProjects(): Project[] {
    return [
      {
        title: 'Hotel Booking Management System for Admin',
        url: 'https://github.com/rifat024',
        image: '/images/proj_1.png',
        tech: 'Spring Boot, PostgreSQL, AWS S3, EC2, CI/CD',
      },
      {
        title: 'Hotel Booking Management System for Merchants',
        url: 'https://github.com/rifat024',
        image: '/images/proj_2.png',
        tech: 'Spring Boot, PostgreSQL, Firebase, AWS S3, EC2, CI/CD',
      },
      {
        title: 'Hotel Booking Management System for Users',
        url: 'https://ghuddy.com',
        image: '/images/proj_3.png',
        tech: 'Spring Boot, PostgreSQL, Firebase, AWS S3, EC2, CI/CD',
        external: true,
      },
      {
        title: 'Company Management',
        url: 'https://web.ata.dev/',
        image: '/images/proj_4.jpg',
        tech: 'Serverless, Node.js, React.js, DynamoDB, Lambda, API Gateway, SNS, SES',
        external: true,
      },
      {
        title: 'All Things API',
        url: 'https://web.ata.dev',
        image: '/images/proj_5.jpg',
        tech: 'Serverless, Node.js, React.js, DynamoDB, Lambda, API Gateway, SNS, SES',
        external: true,
      },
    ];
  }

  // Contact form submission (stub)
  @Post('contact')
  submitContact(@Body() dto: ContactDto) {
    // In production, integrate mailer or third-party service here.
    // For now, just acknowledge receipt.
    // eslint-disable-next-line no-console
    console.log('Contact message received:', dto);
    return { ok: true, received: true };
  }
}
