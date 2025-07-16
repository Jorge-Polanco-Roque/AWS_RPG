const awsQuestions = [
  // EC2 Questions
  {
    id: 1,
    category: "EC2",
    domain: "Design Resilient Architectures",
    difficulty: "intermediate",
    question: "A company is migrating a web application to AWS. The application requires high availability and must handle sudden traffic spikes. The application consists of a web tier and a database tier. What is the MOST cost-effective solution that meets these requirements?",
    options: [
      "Deploy the application on a single large EC2 instance with an RDS Multi-AZ database",
      "Use Auto Scaling Group with Application Load Balancer and RDS with read replicas",
      "Deploy on multiple EC2 instances across multiple AZs with an RDS Single-AZ database",
      "Use Elastic Beanstalk with a single EC2 instance and DynamoDB"
    ],
    correct: 1,
    explanation: "Auto Scaling Group with ALB provides high availability and handles traffic spikes cost-effectively. RDS read replicas improve performance for read-heavy workloads.",
    cosmicHorrorContext: {
      entityName: "The Scaling Leviathan",
      description: "A massive tentacled beast that grows and shrinks based on the digital demands of mortals",
      flavorText: "The Leviathan's many eyes watch the traffic patterns, spawning new instances as the cosmic load increases..."
    }
  },
  {
    id: 2,
    category: "VPC",
    domain: "Design Secure Architectures",
    difficulty: "advanced",
    question: "A financial services company needs to establish a secure connection between their on-premises data center and AWS VPC. The connection must be encrypted, provide consistent network performance, and bypass the public internet. Which combination of services should they use?",
    options: [
      "VPN Gateway with Internet Gateway",
      "AWS Direct Connect with VPN backup",
      "AWS Direct Connect with Virtual Private Gateway",
      "NAT Gateway with VPN Connection"
    ],
    correct: 2,
    explanation: "Direct Connect provides dedicated network connection with consistent performance. Virtual Private Gateway enables secure communication between on-premises and VPC.",
    cosmicHorrorContext: {
      entityName: "The Void Bridge",
      description: "An ethereal bridge spanning the abyss between physical and digital realms",
      flavorText: "Through the Void Bridge, data flows like whispers across the cosmic expanse, never touching the corrupted public networks..."
    }
  },
  {
    id: 3,
    category: "S3",
    domain: "Design Cost-Optimized Architectures",
    difficulty: "intermediate",
    question: "A media company stores video files in S3 that are frequently accessed for the first 30 days, then rarely accessed. After 1 year, the files are accessed less than once per year but must be retained for compliance. What is the MOST cost-effective storage lifecycle policy?",
    options: [
      "S3 Standard → S3 Standard-IA → S3 Glacier → S3 Deep Archive",
      "S3 Standard → S3 Glacier → S3 Deep Archive",
      "S3 Standard → S3 Standard-IA → S3 Deep Archive",
      "S3 Standard → S3 One Zone-IA → S3 Glacier"
    ],
    correct: 0,
    explanation: "This progression optimizes costs: Standard for frequent access, Standard-IA for infrequent access, Glacier for long-term archival, and Deep Archive for compliance storage.",
    cosmicHorrorContext: {
      entityName: "The Eternal Archive",
      description: "A cosmic library where data transforms through stages of existence",
      flavorText: "The Archive's ancient keeper sorts your digital memories through realms of decreasing warmth, until they rest in the deepest, coldest vaults..."
    }
  },
  {
    id: 4,
    category: "Lambda",
    domain: "Design Performant Architectures",
    difficulty: "advanced",
    question: "A company has a Lambda function that processes images uploaded to S3. The function takes 5 minutes to process each image and frequently times out. The company wants to optimize performance and reduce costs. What is the BEST approach?",
    options: [
      "Increase Lambda timeout to 15 minutes and memory to maximum",
      "Use Step Functions to orchestrate multiple Lambda functions",
      "Migrate the processing to EC2 instances with Auto Scaling",
      "Use Lambda with SQS and implement batch processing"
    ],
    correct: 1,
    explanation: "Step Functions can orchestrate long-running workflows by breaking them into smaller Lambda functions, avoiding timeout issues while maintaining serverless architecture.",
    cosmicHorrorContext: {
      entityName: "The Ritual Orchestrator",
      description: "A cosmic conductor that breaks complex ceremonies into precise, sequential steps",
      flavorText: "The Orchestrator's many arms conduct the symphony of functions, each movement precisely timed to avoid the timeout curse..."
    }
  },
  {
    id: 5,
    category: "RDS",
    domain: "Design Resilient Architectures",
    difficulty: "intermediate",
    question: "A database-driven application requires 99.99% availability. The application experiences read-heavy workloads during business hours. The database must be able to failover automatically in case of primary database failure. What is the MOST appropriate solution?",
    options: [
      "RDS Multi-AZ with read replicas in different regions",
      "RDS Multi-AZ with read replicas in the same region",
      "RDS Single-AZ with manual backups",
      "DynamoDB with Global Tables"
    ],
    correct: 1,
    explanation: "Multi-AZ provides automatic failover for high availability. Read replicas in the same region reduce latency for read-heavy workloads while maintaining consistency.",
    cosmicHorrorContext: {
      entityName: "The Mirror Realm Database",
      description: "A database that exists simultaneously in multiple dimensional planes",
      flavorText: "When one realm falls to chaos, the Mirror Database seamlessly shifts consciousness to its parallel existence..."
    }
  },
  {
    id: 6,
    category: "ELB",
    domain: "Design Performant Architectures",
    difficulty: "beginner",
    question: "A web application running on EC2 instances needs to distribute incoming traffic across multiple instances. The application uses HTTP/HTTPS protocols and requires SSL termination. Which load balancer should be used?",
    options: [
      "Classic Load Balancer",
      "Application Load Balancer",
      "Network Load Balancer",
      "Gateway Load Balancer"
    ],
    correct: 1,
    explanation: "Application Load Balancer operates at Layer 7, supports HTTP/HTTPS protocols, and provides SSL termination capabilities.",
    cosmicHorrorContext: {
      entityName: "The Traffic Weaver",
      description: "A spider-like entity that distributes digital souls across multiple vessels",
      flavorText: "The Weaver's web catches each request, routing it through the SSL veil to the most suitable vessel..."
    }
  },
  {
    id: 7,
    category: "CloudWatch",
    domain: "Design Resilient Architectures",
    difficulty: "intermediate",
    question: "A company wants to monitor their EC2 instances and receive notifications when CPU utilization exceeds 80%. They also want to automatically scale instances based on this metric. What services should they configure?",
    options: [
      "CloudWatch Alarms with SNS and Auto Scaling",
      "CloudWatch Logs with Lambda and Auto Scaling",
      "CloudTrail with SNS and Auto Scaling",
      "CloudWatch Events with SQS and Auto Scaling"
    ],
    correct: 0,
    explanation: "CloudWatch Alarms monitor metrics and trigger actions. SNS sends notifications, and Auto Scaling can use the same alarm to scale instances.",
    cosmicHorrorContext: {
      entityName: "The Vigilant Eye",
      description: "An omniscient entity that watches all digital activities across the cosmic infrastructure",
      flavorText: "The Eye never sleeps, constantly measuring the vital signs of your digital realm, ready to sound the cosmic alarm..."
    }
  },
  {
    id: 8,
    category: "IAM",
    domain: "Design Secure Architectures",
    difficulty: "advanced",
    question: "A company has multiple AWS accounts and wants to centrally manage access permissions. Users from different departments need different levels of access to resources across accounts. What is the MOST secure and manageable approach?",
    options: [
      "Create IAM users in each account with cross-account roles",
      "Use AWS Organizations with AWS SSO and permission sets",
      "Share IAM credentials across accounts",
      "Use AWS Cognito with cross-account access"
    ],
    correct: 1,
    explanation: "AWS Organizations with SSO provides centralized identity management and permission sets allow fine-grained access control across multiple accounts.",
    cosmicHorrorContext: {
      entityName: "The Cosmic Gatekeeper",
      description: "A multi-dimensional entity that guards the portals between organizational realms",
      flavorText: "The Gatekeeper's many keys unlock specific chambers across the cosmic organization, each soul granted only the visions they are permitted to see..."
    }
  },
  {
    id: 9,
    category: "Route53",
    domain: "Design Performant Architectures",
    difficulty: "intermediate",
    question: "A global company wants to route users to the nearest AWS region for optimal performance. Their application is deployed in us-east-1, eu-west-1, and ap-southeast-1. What Route 53 routing policy should they use?",
    options: [
      "Simple routing",
      "Weighted routing",
      "Latency-based routing",
      "Geolocation routing"
    ],
    correct: 2,
    explanation: "Latency-based routing directs users to the AWS region with the lowest latency, providing optimal performance.",
    cosmicHorrorContext: {
      entityName: "The Dimensional Navigator",
      description: "A cosmic entity that guides souls through the fastest paths across dimensional barriers",
      flavorText: "The Navigator's ethereal compass points toward the realm where your digital essence can manifest with minimal temporal distortion..."
    }
  },
  {
    id: 10,
    category: "DynamoDB",
    domain: "Design Cost-Optimized Architectures",
    difficulty: "advanced",
    question: "A social media application stores user posts in DynamoDB. The application has unpredictable traffic patterns with sudden spikes. Most posts are read frequently for the first few days, then rarely accessed. What is the MOST cost-effective approach?",
    options: [
      "Use provisioned capacity with manual scaling",
      "Use on-demand capacity with DynamoDB Accelerator (DAX)",
      "Use on-demand capacity with TTL for old posts",
      "Use provisioned capacity with auto scaling and DynamoDB streams"
    ],
    correct: 2,
    explanation: "On-demand capacity handles unpredictable traffic without pre-provisioning. TTL automatically removes old posts, reducing storage costs.",
    cosmicHorrorContext: {
      entityName: "The Temporal Custodian",
      description: "A keeper of digital memories that fade with time",
      flavorText: "The Custodian watches over your social echoes, allowing them to burn bright initially, then fade into the cosmic void as time devours their relevance..."
    }
  },
  {
    id: 11,
    category: "CloudFront",
    domain: "Design Performant Architectures",
    difficulty: "intermediate",
    question: "A company serves static content globally and wants to improve performance while reducing costs. Their content is stored in S3 and includes images, videos, and documents. What solution provides the BEST performance improvement?",
    options: [
      "Enable S3 Transfer Acceleration",
      "Use CloudFront with S3 as origin",
      "Use multiple S3 buckets in different regions",
      "Use ElastiCache with S3"
    ],
    correct: 1,
    explanation: "CloudFront CDN caches content at edge locations globally, reducing latency and bandwidth costs while improving user experience.",
    cosmicHorrorContext: {
      entityName: "The Shadow Network",
      description: "A web of ethereal mirrors that reflect content across the cosmic realm",
      flavorText: "The Shadow Network's mirrors appear wherever souls gather, reflecting your digital artifacts from the nearest dimensional echo..."
    }
  },
  {
    id: 12,
    category: "API Gateway",
    domain: "Design Secure Architectures",
    difficulty: "advanced",
    question: "A company exposes their microservices through API Gateway. They want to implement authentication, rate limiting, and request/response transformation. The APIs will be accessed by both internal applications and external partners. What is the MOST comprehensive solution?",
    options: [
      "Use API Gateway with Lambda authorizers and usage plans",
      "Use API Gateway with Cognito and WAF",
      "Use API Gateway with IAM roles and CloudWatch",
      "Use API Gateway with API keys and VPC endpoints"
    ],
    correct: 0,
    explanation: "Lambda authorizers provide flexible authentication, and usage plans implement rate limiting and access control for different client types.",
    cosmicHorrorContext: {
      entityName: "The Cosmic Sentinel",
      description: "A guardian that stands at the gates between digital realms",
      flavorText: "The Sentinel examines each digital soul seeking passage, transforming their essence and limiting their requests based on ancient cosmic laws..."
    }
  },
  {
    id: 13,
    category: "ECS",
    domain: "Design Resilient Architectures",
    difficulty: "intermediate",
    question: "A company wants to containerize their application and deploy it on AWS with minimal operational overhead. The application needs to scale automatically based on CPU utilization. What is the MOST managed solution?",
    options: [
      "ECS with EC2 launch type and Auto Scaling",
      "ECS with Fargate launch type and Auto Scaling",
      "EKS with managed node groups",
      "EC2 instances with Docker and Auto Scaling"
    ],
    correct: 1,
    explanation: "ECS with Fargate is serverless and requires minimal operational overhead. Auto Scaling based on CPU utilization provides automatic scaling.",
    cosmicHorrorContext: {
      entityName: "The Vessel Shepherd",
      description: "A cosmic entity that tends to containerized souls without the burden of managing their physical forms",
      flavorText: "The Shepherd guides your containerized spirits through the serverless void, scaling their manifestations as the digital energies demand..."
    }
  },
  {
    id: 14,
    category: "SQS",
    domain: "Design Resilient Architectures",
    difficulty: "intermediate",
    question: "A distributed application needs to process messages asynchronously. Some messages are more important than others and should be processed first. The application should handle message failures gracefully. What is the BEST approach?",
    options: [
      "Use multiple SQS standard queues with different priorities",
      "Use SQS FIFO queue with message deduplication",
      "Use SQS standard queue with dead letter queue",
      "Use SNS with SQS subscribers and dead letter queue"
    ],
    correct: 3,
    explanation: "SNS allows message prioritization through different topics/queues. SQS subscribers handle processing, and dead letter queues manage failures.",
    cosmicHorrorContext: {
      entityName: "The Message Wraiths",
      description: "Ethereal messengers that carry digital communications through the cosmic void",
      flavorText: "The Wraiths sort messages by cosmic importance, ensuring vital communications reach their destinations while failed messages are banished to the dead letter realm..."
    }
  },
  {
    id: 15,
    category: "ElastiCache",
    domain: "Design Performant Architectures",
    difficulty: "advanced",
    question: "A web application experiences high read latency from its RDS database. The application has a read-heavy workload with frequently accessed data that doesn't change often. What caching strategy provides the BEST performance improvement?",
    options: [
      "ElastiCache Redis with lazy loading",
      "ElastiCache Memcached with write-through",
      "ElastiCache Redis with write-through and TTL",
      "DynamoDB Accelerator (DAX)"
    ],
    correct: 2,
    explanation: "Redis with write-through ensures data consistency, while TTL prevents stale data. This combination optimizes performance for read-heavy workloads.",
    cosmicHorrorContext: {
      entityName: "The Memory Phantoms",
      description: "Spectral entities that store echoes of frequently accessed digital knowledge",
      flavorText: "The Phantoms remember what souls seek most, manifesting cached knowledge instantly while the TTL curse ensures memories don't become cursed with age..."
    }
  }
];

const questionsByCategory = {
  "Design Resilient Architectures": [
    { weight: 0.30, topics: ["Multi-AZ", "Auto Scaling", "Load Balancing", "Disaster Recovery"] }
  ],
  "Design High-Performing Architectures": [
    { weight: 0.28, topics: ["Caching", "Database Performance", "Network Optimization", "Compute Optimization"] }
  ],
  "Design Secure Architectures": [
    { weight: 0.26, topics: ["IAM", "VPC Security", "Encryption", "Monitoring"] }
  ],
  "Design Cost-Optimized Architectures": [
    { weight: 0.16, topics: ["Storage Classes", "Instance Types", "Reserved Instances", "Spot Instances"] }
  ]
};

const cosmicEntities = [
  {
    name: "Azathoth, The Blind Idiot God of Scaling",
    description: "Controls all auto-scaling nightmares across the AWS cosmos",
    associatedServices: ["Auto Scaling", "ELB", "CloudWatch"]
  },
  {
    name: "Cthulhu, The Dreaming Database",
    description: "Sleeps in the depths of RDS, awakening only when queries disturb its slumber",
    associatedServices: ["RDS", "DynamoDB", "Aurora"]
  },
  {
    name: "Nyarlathotep, The Crawling Chaos of Networks",
    description: "Weaves the dark networks that connect all digital realms",
    associatedServices: ["VPC", "Route53", "CloudFront"]
  },
  {
    name: "Shub-Niggurath, The Black Goat of Storage",
    description: "Mother of all S3 buckets and the infinite storage spawn",
    associatedServices: ["S3", "EBS", "EFS"]
  },
  {
    name: "Yog-Sothoth, The Key and the Gate",
    description: "Guardian of all IAM permissions and security gates",
    associatedServices: ["IAM", "Cognito", "WAF"]
  }
];

module.exports = {
  awsQuestions,
  questionsByCategory,
  cosmicEntities
};