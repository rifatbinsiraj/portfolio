interface Project {
    title: string;
    url?: string;
    image?: string;
    tech: string;
    external?: boolean;
}
interface Skill {
    name: string;
    percent: number;
}
interface Experience {
    date: string;
    title: string;
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
declare class ContactDto {
    name: string;
    email: string;
    subject: string;
    message: string;
}
export declare class AppController {
    health(): {
        status: string;
    };
    getProfile(): {
        name: string;
        role: string;
        experience: number;
        address: string;
        phone: string;
        email: string;
        languages: string[];
        tools: string[];
        counters: {
            achievements: number;
            projects: number;
        };
        typingTitles: string[];
        cvUrl: string;
        socials: {
            github: string;
            linkedin: string;
            youtube: string;
            facebook: string;
            instagram: string;
        };
    };
    getAbout(): {
        headline: string;
        summary: string;
        profile: string;
        interests: string[];
    };
    getSkills(): Skill[];
    getExperience(): Experience[];
    getEducation(): Education[];
    getContacts(): Contacts;
    getTypingTitles(): string[];
    getProjects(): Project[];
    submitContact(dto: ContactDto): {
        ok: boolean;
        received: boolean;
    };
}
export {};
