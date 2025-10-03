"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
class ContactDto {
    name;
    email;
    subject;
    message;
}
let AppController = class AppController {
    health() {
        return { status: 'ok' };
    }
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
    getAbout() {
        return {
            headline: 'About Me',
            summary: 'I am a highly skilled and motivated software developer with 3.5 years of experience in developing desktop and web applications. My career objective is to work in a position where I can use my skills to positively impact the business.',
            profile: 'Full-Stack Engineer',
            interests: ['Software Development', 'Traveling'],
        };
    }
    getSkills() {
        return [
            { name: 'Java (Spring Boot)', percent: 95 },
            { name: 'JavaScript (NodeJS, Serverless)', percent: 90 },
            { name: 'AWS (Lambda, SNS, SES, DynamoDB, API Gateway, S3, Cognito)', percent: 85 },
            { name: 'SQL (MySQL, PostgreSQL, NoSQL)', percent: 80 },
            { name: 'Unix, Git', percent: 85 },
        ];
    }
    getExperience() {
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
    getEducation() {
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
    getContacts() {
        return {
            address: 'Dhaka, Bangladesh',
            phone: '+8801761233953',
            email: 'rifatrabbi024@gmail.com',
        };
    }
    getTypingTitles() {
        return ['Software Engineer', 'Full-Stack Engineer', 'Back-End Engineer'];
    }
    getProjects() {
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
    submitContact(dto) {
        console.log('Contact message received:', dto);
        return { ok: true, received: true };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('about'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAbout", null);
__decorate([
    (0, common_1.Get)('skills'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AppController.prototype, "getSkills", null);
__decorate([
    (0, common_1.Get)('resume/experience'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AppController.prototype, "getExperience", null);
__decorate([
    (0, common_1.Get)('resume/education'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AppController.prototype, "getEducation", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Get)('typing-titles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AppController.prototype, "getTypingTitles", null);
__decorate([
    (0, common_1.Get)('projects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AppController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Post)('contact'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContactDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "submitContact", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map