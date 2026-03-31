package com.campusconnect.config;

import com.campusconnect.model.Event;
import com.campusconnect.model.User;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email}")
    private String adminEmail;

    @Value("${app.seed.admin-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin user already exists, skipping seed");
            return;
        }

        log.info("Seeding admin user and sample events...");

        User admin = new User();
        admin.setName("CEMS Admin");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole("admin");
        admin.setDepartment("Administration");
        admin = userRepository.save(admin);

        Instant now = Instant.now();

        List<Event> events = List.of(
                createEvent("AI Hackathon Sprint",
                        "24-hour coding challenge focused on AI-driven campus solutions. Teams of up to 4 will compete to build intelligent apps tackling real campus problems — from smart scheduling to accessibility tools. Mentors from top tech companies will guide participants, and winning teams receive internship opportunities. Meals, snacks, and caffeine provided around the clock.",
                        "technical", now.plus(3, ChronoUnit.DAYS), now.plus(4, ChronoUnit.DAYS),
                        "Innovation Lab - Block A", 150, 127, admin.getId(),
                        "https://picsum.photos/seed/cems-ai-hackathon/1200/700",
                        List.of("tech", "ai", "hackathon", "coding"),
                        now.plus(2, ChronoUnit.DAYS)),

                createEvent("Open Source Contribution Workshop",
                        "Learn Git workflows, PR etiquette, and real-world open-source collaboration. This hands-on workshop walks you through forking repos, writing meaningful commits, navigating code reviews, and building your contributor profile. By the end, every participant will have submitted a real pull request to an active open-source project.",
                        "workshop", now.plus(5, ChronoUnit.DAYS), now.plus(5, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS),
                        "Computer Lab 2", 100, 42, admin.getId(),
                        "https://picsum.photos/seed/cems-open-source/1200/700",
                        List.of("github", "open-source", "workshop", "development"),
                        now.plus(4, ChronoUnit.DAYS)),

                createEvent("Cybersecurity Awareness Bootcamp",
                        "Practical session on phishing defense, password security, and safe browsing. Ethical hackers demonstrate live attack simulations while you learn to identify vulnerabilities in everyday tools. Walk away with a personal security checklist and hands-on experience with industry-standard tools like Wireshark and Burp Suite.",
                        "technical", now.plus(7, ChronoUnit.DAYS), now.plus(7, ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS),
                        "Seminar Hall - C Block", 180, 165, admin.getId(),
                        "https://picsum.photos/seed/cems-cybersecurity/1200/700",
                        List.of("cybersecurity", "security", "tech"),
                        now.plus(6, ChronoUnit.DAYS)),

                createEvent("Cloud Computing Fundamentals",
                        "Beginner-friendly introduction to cloud architecture and deployment workflows. Explore AWS, Azure, and GCP through guided labs — spin up virtual machines, deploy a containerized app, and configure CI/CD pipelines. No prior cloud experience needed; just bring your laptop and curiosity.",
                        "seminar", now.plus(9, ChronoUnit.DAYS), now.plus(9, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS),
                        "Main Auditorium", 220, 187, admin.getId(),
                        "https://picsum.photos/seed/cems-cloud/1200/700",
                        List.of("cloud", "aws", "devops", "seminar"),
                        now.plus(8, ChronoUnit.DAYS)),

                createEvent("UI/UX Design Jam",
                        "Rapid design challenge for building intuitive app interfaces. Work in small teams to research, wireframe, prototype, and test a mobile app concept in just 5 hours. Industry designers critique final presentations, and the best prototype wins a Figma Pro subscription for the entire team.",
                        "workshop", now.plus(11, ChronoUnit.DAYS), now.plus(11, ChronoUnit.DAYS).plus(5, ChronoUnit.HOURS),
                        "Design Studio", 90, 78, admin.getId(),
                        "https://picsum.photos/seed/cems-uiux/1200/700",
                        List.of("ui", "ux", "design", "prototype"),
                        now.plus(10, ChronoUnit.DAYS)),

                createEvent("Leadership Seminar 2026",
                        "Interactive seminar on leadership, communication, and team dynamics. Featuring keynote talks from alumni CEOs, breakout sessions on conflict resolution, and a live panel on building inclusive teams. Every attendee receives a leadership toolkit and certificate of participation.",
                        "seminar", now.plus(13, ChronoUnit.DAYS), now.plus(13, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS),
                        "Conference Hall", 200, 134, admin.getId(),
                        "https://picsum.photos/seed/cems-leadership/1200/700",
                        List.of("leadership", "career", "soft-skills"),
                        now.plus(12, ChronoUnit.DAYS)),

                createEvent("Annual Sports Fest",
                        "Inter-department sports competition featuring cricket, football, basketball, badminton, and track events. Cheer for your department, participate in fun relays, and enjoy live music between matches. Trophies, medals, and the coveted Sports Fest Champion shield are up for grabs.",
                        "sports", now.plus(15, ChronoUnit.DAYS), now.plus(17, ChronoUnit.DAYS),
                        "College Ground", 500, 467, admin.getId(),
                        "https://picsum.photos/seed/cems-sports-fest/1200/700",
                        List.of("sports", "fitness", "competition"),
                        now.plus(14, ChronoUnit.DAYS)),

                createEvent("Quantum Computing 101",
                        "An introductory dive into the world of qubits and quantum entanglement with Professor Mehta. Understand superposition, quantum gates, and how quantum algorithms will reshape cryptography and machine learning. Includes a live demo on IBM Quantum Experience.",
                        "technical", now.plus(2, ChronoUnit.DAYS), now.plus(2, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS),
                        "Lab 4B", 60, 51, admin.getId(),
                        "https://picsum.photos/seed/cems-quantum/1200/700",
                        List.of("quantum", "physics", "computing", "tech"),
                        now.plus(1, ChronoUnit.DAYS)),

                createEvent("Global Fusion Fest",
                        "A celebration of diverse cultures featuring food stalls, traditional music, and dance performances from over 20 countries represented on campus. Taste authentic cuisines, learn folk dances, and explore art and craft exhibitions curated by international student associations.",
                        "cultural", now.plus(4, ChronoUnit.DAYS), now.plus(4, ChronoUnit.DAYS).plus(8, ChronoUnit.HOURS),
                        "Central Plaza", 400, 162, admin.getId(),
                        "https://picsum.photos/seed/cems-fusion-fest/1200/700",
                        List.of("cultural", "food", "music", "diversity"),
                        now.plus(3, ChronoUnit.DAYS)),

                createEvent("Inter-College Basketball Finals",
                        "The ultimate showdown on the court. Support your home team in the championship finals against rival colleges. Pre-game tailgate party starts two hours before tip-off with food trucks and live DJ. Student section seating is first-come, first-served.",
                        "sports", now.plus(6, ChronoUnit.DAYS), now.plus(6, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS),
                        "Sports Arena", 500, 425, admin.getId(),
                        "https://picsum.photos/seed/cems-basketball/1200/700",
                        List.of("basketball", "sports", "inter-college"),
                        now.plus(5, ChronoUnit.DAYS)),

                createEvent("Startup Pitch Night",
                        "Student entrepreneurs pitch their startup ideas to a panel of investors and industry mentors. Each team gets 5 minutes to present followed by Q&A. Top 3 pitches receive seed funding and incubation support from the campus entrepreneurship cell.",
                        "seminar", now.plus(8, ChronoUnit.DAYS), now.plus(8, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS),
                        "Entrepreneurship Hub", 120, 108, admin.getId(),
                        "https://picsum.photos/seed/cems-startup-pitch/1200/700",
                        List.of("startup", "entrepreneurship", "pitch", "business"),
                        now.plus(7, ChronoUnit.DAYS)),

                createEvent("Future Tech Symposium",
                        "A full-day symposium exploring emerging technologies — from brain-computer interfaces and AR/VR to sustainable energy tech. Featuring keynotes from industry leaders, panel discussions, and networking sessions. Lunch and refreshments included.",
                        "seminar", now.plus(10, ChronoUnit.DAYS), now.plus(10, ChronoUnit.DAYS).plus(8, ChronoUnit.HOURS),
                        "Innovation Hall, Center Wing", 250, 213, admin.getId(),
                        "https://picsum.photos/seed/cems-future-tech/1200/700",
                        List.of("technology", "innovation", "symposium", "future"),
                        now.plus(9, ChronoUnit.DAYS)),

                createEvent("Acoustic Sunset Sessions",
                        "An evening of live acoustic performances on the rooftop garden. Local student bands and solo artists perform original compositions and beloved covers as the sun sets over campus. Bring blankets, friends, and good vibes. Light refreshments available.",
                        "cultural", now.plus(12, ChronoUnit.DAYS), now.plus(12, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS),
                        "The Quad Rooftop Garden", 150, 60, admin.getId(),
                        "https://picsum.photos/seed/cems-acoustic/1200/700",
                        List.of("music", "acoustic", "live", "cultural"),
                        now.plus(11, ChronoUnit.DAYS)),

                createEvent("Data Science Masterclass",
                        "Intensive workshop covering Python for data analysis, machine learning pipelines, and data visualization with real-world datasets. Participants will build a complete ML model from data cleaning to deployment. Prerequisites: basic Python knowledge.",
                        "workshop", now.plus(14, ChronoUnit.DAYS), now.plus(14, ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS),
                        "Computer Lab 5", 80, 74, admin.getId(),
                        "https://picsum.photos/seed/cems-datascience/1200/700",
                        List.of("data-science", "python", "ml", "workshop"),
                        now.plus(13, ChronoUnit.DAYS)),

                createEvent("Yoga & Mindfulness Morning",
                        "Start your day with guided yoga, breathing exercises, and a mindfulness meditation session on the campus lawn. Suitable for all experience levels. Mats and water provided. Certified yoga instructor leads the 90-minute session.",
                        "sports", now.plus(1, ChronoUnit.DAYS), now.plus(1, ChronoUnit.DAYS).plus(2, ChronoUnit.HOURS),
                        "Campus East Lawn", 100, 45, admin.getId(),
                        "https://picsum.photos/seed/cems-yoga/1200/700",
                        List.of("yoga", "wellness", "mindfulness", "fitness"),
                        now.plus(0, ChronoUnit.DAYS)),

                createEvent("Sustainable Design Hackathon",
                        "Join 200+ creators for a 48-hour sprint to build a greener future. Design sustainable solutions for campus waste management, energy consumption, and transportation. Industry mentors from green-tech companies evaluate projects. Winners receive grants to pilot their solutions on campus.",
                        "technical", now.plus(16, ChronoUnit.DAYS), now.plus(18, ChronoUnit.DAYS),
                        "Green Innovation Center", 200, 184, admin.getId(),
                        "https://picsum.photos/seed/cems-sustainable/1200/700",
                        List.of("sustainability", "design", "hackathon", "green"),
                        now.plus(15, ChronoUnit.DAYS)),

                createEvent("Photography Walk & Exhibition",
                        "Guided photography walk through campus capturing architecture, nature, and candid moments. Professional photographer leads techniques for composition, lighting, and storytelling through images. Best photos will be displayed in a week-long campus gallery exhibition.",
                        "cultural", now.plus(20, ChronoUnit.DAYS), now.plus(20, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS),
                        "Campus Main Gate (Start Point)", 50, 32, admin.getId(),
                        "https://picsum.photos/seed/cems-photography/1200/700",
                        List.of("photography", "art", "exhibition", "creative"),
                        now.plus(19, ChronoUnit.DAYS)),

                createEvent("Blockchain & Web3 Workshop",
                        "Hands-on workshop on building decentralized applications. Write and deploy smart contracts on Ethereum testnet, interact with them via a React frontend, and understand tokenomics. No prior blockchain experience required — just JavaScript basics.",
                        "workshop", now.plus(22, ChronoUnit.DAYS), now.plus(22, ChronoUnit.DAYS).plus(5, ChronoUnit.HOURS),
                        "Tech Hub - Room 301", 70, 68, admin.getId(),
                        "https://picsum.photos/seed/cems-blockchain/1200/700",
                        List.of("blockchain", "web3", "ethereum", "workshop"),
                        now.plus(21, ChronoUnit.DAYS)),

                createEvent("Code Challenge: Algorithms Arena",
                        "Competitive programming contest testing your DSA skills. 3-hour timed challenge with problems ranging from easy to expert. Real-time leaderboard, hints system, and post-contest editorial walkthrough. Top 10 contestants win prizes and placement interview slots.",
                        "technical", now.plus(25, ChronoUnit.DAYS), now.plus(25, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS),
                        "Computer Lab 1", 120, 110, admin.getId(),
                        "https://picsum.photos/seed/cems-code-challenge/1200/700",
                        List.of("competitive-programming", "dsa", "algorithms", "coding"),
                        now.plus(24, ChronoUnit.DAYS)),

                createEvent("Contemporary Art Workshop",
                        "Explore modern art techniques including abstract painting, mixed media collage, and digital illustration. Professional artists guide you through creative expression with all materials provided. Open to all skill levels — no experience necessary.",
                        "cultural", now.plus(28, ChronoUnit.DAYS), now.plus(28, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS),
                        "Studio B - Arts Building", 40, 28, admin.getId(),
                        "https://picsum.photos/seed/cems-art/1200/700",
                        List.of("art", "painting", "creative", "workshop"),
                        now.plus(27, ChronoUnit.DAYS))
        );

        eventRepository.saveAll(events);
        log.info("Seed complete. Admin: {} / {}", adminEmail, adminPassword);
    }

    private Event createEvent(String title, String description, String category,
                              Instant date, Instant endDate, String venue,
                              int capacity, int registeredCount, String organizerId,
                              String banner, List<String> tags, Instant registrationDeadline) {
        Event e = new Event();
        e.setTitle(title);
        e.setDescription(description);
        e.setCategory(category);
        e.setDate(date);
        e.setEndDate(endDate);
        e.setVenue(venue);
        e.setCapacity(capacity);
        e.setRegisteredCount(registeredCount);
        e.setOrganizer(organizerId);
        e.setBanner(banner);
        e.setTags(tags);
        e.setRegistrationDeadline(registrationDeadline);
        return e;
    }
}
