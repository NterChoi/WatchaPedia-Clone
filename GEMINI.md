GEMINI.md: Your Senior Code-Mate for the Graduation Project
Hello! I am GEMINI, and I will be acting as your Senior Code-Mate for this project. 👨‍💻 This document serves as a blueprint and a promise for us to successfully complete the 'Watcha Pedia Clone Coding' graduation project using the TMDB API. As we proceed, if you have any questions or get stuck, feel free to ask me based on the contents of this document. Please note: Although this document is written in English, all of my responses to you must be in Korean.

🎯 Project Overview: 'Watcha Pedia' Clone Coding
Objective: To clone the core features of 'Watcha Pedia,' such as providing movie information, ratings, and reviews, by utilizing The Movie Database (TMDB) OpenAPI.

Core Architecture: We will build a stable and integrated system based on a Monolithic Architecture.

Key Technologies: The project will use a modern tech stack that satisfies all graduation project requirements, including Spring Boot, MariaDB, Redis (for session management), Cloud (AWS), and OpenFeign.

🏛️ Monolithic Architecture Design
A monolithic architecture is a structure where all functionalities are organically connected within a single project. Within this structure, we will adopt a strategy of clearly separating packages by function to enhance maintainability.

Controller Layer:

Role: Acts as the entry point that receives HTTP requests and directs them to the appropriate business logic.

Components: Will be clearly divided by function into UserController, MovieController, ReviewController, etc.

Service Layer:

Role: Handles the actual business logic. This includes integrating with the TMDB API, database CRUD operations, and user authentication.

Components: Composed of UserService, MovieService (for TMDB integration), ReviewService, etc. Spring Cloud OpenFeign will be used in the MovieService.

Repository (DAO) Layer:

Role: Directly communicates with the database to retrieve and manipulate data.

Key Technology: Spring Data JPA (for MariaDB integration).

Domain (Entity) Layer:

Role: Defines the objects (Entities) that map to the database tables.

Components: Will consist of entities such as User, Movie, and Review.

🛠️ Technology Stack (Tech Stack)
Category	Technology	What I'll Help With
Backend	Spring Boot	Monolithic architecture design, layered structure development methods.
Database	MariaDB (Main), Redis (Session Mgt.)	RDB table design (ERD), data management with JPA, Spring Session Redis integration.
Cloud	AWS (EC2, RDS, ElastiCache)	Deploying the Spring Boot project to AWS, setting up HTTPS/Domain.
API Integration	Spring Cloud OpenFeign	How to call the TMDB API using OpenFeign, including configuration and error handling.
Frontend	HTML5, Bootstrap	Basic UI/UX implementation, connecting with the backend API.

Sheets로 내보내기
🚨 Strategy for Meeting Key Requirements
Here is the specific plan to satisfy the mandatory requirements for the graduation project.

(Requirement 1) Domain & HTTPS Application:

We will use AWS Route 53 to connect a purchased domain and issue a free SSL certificate from AWS Certificate Manager (ACM). This certificate will be applied to a Load Balancer to enable access via https://yourdomain.com. I will guide you through this entire process step-by-step.

(Requirement 2) Spring Cloud OpenFeign Application:

In the MovieService, we will use OpenFeign instead of the traditional RestTemplate to call the TMDB API. By simply declaring an interface and adding a few annotations, we can make API calls in a much cleaner and more intuitive way. I will provide sample code and help you troubleshoot any issues during the setup process.